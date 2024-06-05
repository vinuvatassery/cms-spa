/** Angular **/
import { AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { debounceTime, distinctUntilChanged, pairwise, startWith, first, forkJoin, mergeMap, of, Subscription, tap, BehaviorSubject } from 'rxjs';
/** Facades **/
import {
  DrugPharmacyFacade, WorkflowFacade, PrescriptionDrugFacade, PrescriptionDrug,
  CompletionChecklist, NavigationType,
} from '@cms/case-management/domain';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
/** Enums **/
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusFlag, YesNoFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Public properties **/
  prescriptionDrugForm!: FormGroup;
  prescriptionDrug!: PrescriptionDrug;
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$;
  searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
  addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
  editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
  removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
  triggerPriorityPopup$ = this.drugPharmacyFacade.triggerPriorityPopup$;
  selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;
  clientCaseEligibilityId: string = '';
  sessionId: any = '';
  clientId: any;
  clientCaseId: any;
  nonPreferredFlagValidation = false;
  prescriptionInfo = {} as PrescriptionDrug;
  isPharmacyAdded = false;
  showPharmacyRequiredValidation$ = new BehaviorSubject(false);
  isCerForm :any;
  showPharmacySection = true;
  isCerText=false;
  prevClientCaseEligibilityId:any;
  workflowTypeCode:any;
  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription!: Subscription;
  private saveForLaterValidationSubscription!: Subscription;
  private hivCodeValueSubscription !: Subscription;

  /** Constructor **/
  constructor(
    private workflowFacade: WorkflowFacade,
    private route: ActivatedRoute,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly prescriptionDrugFacade: PrescriptionDrugFacade,
    private changeDetector: ChangeDetectorRef,
    private readonly router: Router,
  ) {

  }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.loadSessionData();
    this.prescriptionDrugFormChanged();
    this.addHivCodeChangeSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.hivCodeValueSubscription.unsubscribe();
  }


  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  /** Private Methods **/
  private buildForm() {
    this.prescriptionDrugForm = new FormGroup({
      prescriptionDrugsForHivCode: new FormControl('', {
        validators: Validators.required,
      }),
      nonPreferredPharmacyCode: new FormControl(''),
      isClientNotUsingAnyPharmacy:new FormControl(false)
    });
  }

  private loadPrescriptionDrug(): void {
    this.loaderService.show();
    this.prescriptionDrugFacade
      .loadPrescriptionDrug(this.clientId, this.clientCaseEligibilityId)
      .subscribe({
        next: (response) => {
          this.prescriptionDrugForm.reset();
          if (response !== null) {
            this.prescriptionDrug = response;
            this.prescriptionDrugForm.patchValue(response);
            if(response?.prescriptionDrugsForHivCode === 'YES'){
              this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].setValue(false);
              this.showPharmacySection = true;              
            }else {
              this.showPharmacySection = false;
              this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].setValue(true);
              this.updateWorkflowCount('pharmacy', true);
            }
            this.adjustAttributeChanged(response?.prescriptionDrugsForHivCode === 'YES');
            this.changeDetector.detectChanges();
            this.loaderService.hide();
          } else {
            this.loaderService.hide();
            this.adjustAttributeChanged(false);
          }
        },
        error: (err) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        },
      });
  }

  private prescriptionDrugFormChanged() {
    this.prescriptionDrugForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null),
        pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
      });
  }

  private updateFormCompleteCount(prev: any, curr: any) {
    const completedDataPoints: CompletionChecklist[] = [];
    
    Object.keys(this.prescriptionDrugForm.controls).forEach((key) => {
      if (prev && curr && prev[key] !== curr[key]) {
        const status = curr[key] ? StatusFlag.Yes : StatusFlag.No;
        completedDataPoints.push({ dataPointName: key, status });
      }
    });
  
    if (this.isPharmacyAdded) {
      const pharmacyChecklistItem = completedDataPoints.find(dp => dp.dataPointName === 'isClientNotUsingAnyPharmacy');
      if (pharmacyChecklistItem) {
        pharmacyChecklistItem.status = StatusFlag.Yes;
      }
    }
  
    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }
  
  private adjustAttributeChanged(isRequired: boolean) {
    const data: CompletionChecklist = {
      dataPointName: 'nonPreferredPharmacyCode_ adjusted',
      status: isRequired ? StatusFlag.Yes : StatusFlag.No,
    };  
    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
    this.updateInitialCompletionCheckList();
  }

  private updateInitialCompletionCheckList() {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.prescriptionDrugForm.controls).forEach((key) => {
      let item: CompletionChecklist = {
        dataPointName: key,
        status: this.prescriptionDrugForm?.get(key)?.value ? StatusFlag.Yes : StatusFlag.No,
      };

      completedDataPoints.push(item);
    });

    if (completedDataPoints.length > 0) {
      if(this.isPharmacyAdded){
        completedDataPoints = completedDataPoints.map(dp => {
          if(dp.dataPointName === 'isClientNotUsingAnyPharmacy'){
            return { ...dp, status: StatusFlag.Yes };
          }

          return dp;
        });
      }
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$
      .pipe(
        tap(() => {
          this.loaderService.show();
          this.workflowFacade.disableSaveButton();
        }),
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.save()])
        )
      )
      .subscribe(([navigationType, isSaved]) => {
        if (isSaved) {
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Prescription Drugs Saved Successfully'
          );
          this.workflowFacade.navigate(navigationType);
        } else {
          this.workflowFacade.enableSaveButton();
        }

        this.loaderService.hide();
      });
  }

  private loadSessionData() {
    this.loaderService.show();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (
          session !== null &&
          session !== undefined &&
          session.sessionData !== undefined
        ) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(
            session.sessionData
          ).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.loadPrescriptionDrug();
          this.loadClientPharmacies(this.clientId);
          this.loaderService.hide();
        }
        this.prevClientCaseEligibilityId = JSON.parse(
          session.sessionData
        )?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true;
        }else {
          this.isCerForm = false;
        }
      });
  }

  private save() {
    this.prescriptionDrugForm.markAllAsTouched();
    if(this.isCerForm && !this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy']?.value){
      this.prescriptionDrugForm.controls['prescriptionDrugsForHivCode'].setValue('YES');
    } else if(this.isCerForm && this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy']?.value)
    {
    this.prescriptionDrugForm.controls['prescriptionDrugsForHivCode'].setValue('NO');
    }
    this.changeDetector.detectChanges();
    const isHivCodeYes = this.prescriptionDrugForm.controls['prescriptionDrugsForHivCode'].value?.toUpperCase() == YesNoFlag.Yes.toUpperCase();
    if (!this.isPharmacyAdded && isHivCodeYes) {
      this.showPharmacyRequiredValidation$.next(true);
      return of(false);;
    }

    if (!isHivCodeYes) {
      this.prescriptionDrugForm.controls['nonPreferredPharmacyCode'].setValue(null);
    }

    if (this.prescriptionDrugForm.valid) {
      const drugs = this.workflowFacade.deepCopy(this.prescriptionDrugForm.value);
      drugs.clientCaseEligibilityId = this.clientCaseEligibilityId;
      drugs.clientId = this.clientId;
      drugs.clientCaseId = this.clientCaseId;
      drugs.concurrencyStamp = this.prescriptionDrug?.concurrencyStamp;
       drugs.IsCerForm=this.isCerForm
      return this.prescriptionDrugFacade.updatePrescriptionDrug(
        drugs
      );
    }

    return of(false);
  }


  /** Internal event methods **/




  /* Pharmacy */
  private loadClientPharmacies(clientId: number) {
    this.loaderService.show();
    this.drugPharmacyFacade.loadClientPharmacyList(clientId);
    this.clientpharmacies$.subscribe({
      next: (pharmacies) => {
        if (pharmacies?.length > 0) {
          pharmacies?.forEach((pharmacyData: any) => {
            const pharmacyNumber = pharmacyData?.pharmacyNumber ? `#${pharmacyData.pharmacyNumber}` : '';
            pharmacyData.PharmacyNameAndNumber = `${pharmacyData.PharmacyName} ${pharmacyNumber}`;
          });
          this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].setValue(false);
          this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].updateValueAndValidity();
        this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy']?.disable();
        this.showPharmacySection = true;
        this.isCerText=true;
        }else {
          this.isCerText=false;
          this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].setValue(true);
          this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].updateValueAndValidity();
          this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy']?.enable();
          this.showPharmacySection = false;
        }
        this.changeDetector.detectChanges();
        const pharmacyFound = pharmacies?.length > 0;
        if (pharmacyFound) {
          this.showPharmacyRequiredValidation$.next(false);
        }
        this.isPharmacyAdded = pharmacyFound;
        this.updateWorkflowCount('pharmacy', pharmacyFound);
        this.updateWorkflowCount('isClientNotUsingAnyPharmacy', pharmacyFound);
        this.loaderService.hide();
      },
      error: (err) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        this.updateWorkflowCount('pharmacy', false);
        this.updateWorkflowCount('isClientNotUsingAnyPharmacy', false);
      },
    });
  }

  private updateWorkflowCount(dataPointName: string, isCompleted: boolean) {
    const workFlowdata: CompletionChecklist[] = [
      {
        dataPointName: dataPointName,
        status: isCompleted ? StatusFlag.Yes : StatusFlag.No,
      },
    ];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }

  addPharmacy(pharmacy: any) {
    this.drugPharmacyFacade.addClientPharmacy(
      this.workflowFacade.clientId ?? 0,
      pharmacy.vendorId,
      pharmacy.VendorAddressId
    );
  }

  editPharmacyInit(vendorId: string) {
    this.drugPharmacyFacade.getPharmacyById(vendorId);
  }

  editPharmacy(data: any) {
    this.drugPharmacyFacade.editClientPharmacy(
      this.workflowFacade.clientId ?? 0,
      data?.clientPharmacyId,
      data?.vendorId,
      data.vendorAddressId
    );
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.workflowFacade.clientId ?? 0,
      clientPharmacyId
    ).then((isRemoved) =>{
      if(isRemoved){
        this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].setValue(false);
        this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy'].updateValueAndValidity();
      }
     
    })

    
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription =
      this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
        if (this.checkValidations()) {
          this.save().subscribe((response: any) => {
            if (response) {
              this.workflowFacade.saveForLaterCompleted(true)
              this.loaderService.hide();
        
            }
          })
        }
        else {
          this.workflowFacade.saveForLaterCompleted(true)
        
        }
      });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription =
      this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
        if (val) {
          this.checkValidations()
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      });
  }
onCheckClientPharmacies(event:any){

   this.prescriptionDrugForm.controls['isClientNotUsingAnyPharmacy']?.valueChanges
      .subscribe((value: any) => {
        this.showPharmacySection = value ? false : true;
        if(value){
          this.showPharmacyRequiredValidation$.next(false);
        }
      });
}
  checkValidations() {
    return this.prescriptionDrugForm.valid;
  }
  hivFlagSelected(event: Event) {
    if (
      this.prescriptionDrugForm.controls[
        'prescriptionDrugsForHivCode'
      ].value?.toUpperCase() == YesNoFlag.Yes.toUpperCase()
    ) {
      this.showPharmacySection=true;
      this.nonPreferredFlagValidation = true;
      this.prescriptionDrugForm
        .get('nonPreferredPharmacyCode')
        ?.setValidators([Validators.required]); // or clearValidators()
      this.prescriptionDrugForm
        .get('nonPreferredPharmacyCode')
        ?.updateValueAndValidity();
      if (
        this.prescriptionDrugForm.controls[
          'nonPreferredPharmacyCode'
        ].value?.toUpperCase() != YesNoFlag.Yes.toUpperCase() &&
        this.prescriptionDrugForm.controls['nonPreferredPharmacyCode'].value?.toUpperCase() != YesNoFlag.No.toUpperCase()) {
        this.prescriptionDrugForm.controls['nonPreferredPharmacyCode'].setValue(null);
      }
      this.adjustAttributeChanged(true);
      this.updateWorkflowCount('pharmacy', this.isPharmacyAdded);
    } else {
      this.prescriptionDrugForm
        .get('nonPreferredPharmacyCode')
        ?.clearValidators();
      this.prescriptionDrugForm
        .get('nonPreferredPharmacyCode')
        ?.setValidators(null);
      this.prescriptionDrugForm
        .get('nonPreferredPharmacyCode')
        ?.updateValueAndValidity();
      this.showPharmacySection=false;
      this.nonPreferredFlagValidation = false;
      this.adjustAttributeChanged(false);
      this.showPharmacyRequiredValidation$.next(false);
    }
  }

  private addHivCodeChangeSubscription(): void {
    this.hivCodeValueSubscription = this.prescriptionDrugForm.controls['prescriptionDrugsForHivCode']?.valueChanges
      .subscribe((value: any) => {
        if(value === YesNoFlag.Yes.toUpperCase())
        {
          this.showPharmacySection = true;
        }
        
      });
  }
}

