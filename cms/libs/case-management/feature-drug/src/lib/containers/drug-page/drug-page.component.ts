/** Angular **/
import { ElementRef, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { debounceTime, distinctUntilChanged, pairwise, startWith,first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import {  UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { DrugPharmacyFacade, PriorityCode, WorkflowFacade,IncomeFacade, PrescriptionDrugFacade, PrescriptionDrug, StatusFlag, CompletionChecklist } from '@cms/case-management/domain';
import { FormGroup, FormControl, } from '@angular/forms';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy {
  public uploadRemoveUrl = 'removeUrl';
  public uploadedBenfitSummaryFile: any[] = [];
  summaryBenefitFiles: any;
  summaryBenefitValidator: boolean = false;
  public uploadFileRestrictions: UploadFileRistrictionOptions =
  new UploadFileRistrictionOptions();
  /** Public properties **/
  public prescriptionDrugForm :FormGroup = new FormGroup({
    hivFlag: new FormControl('', []),
    nonPrefFlag: new FormControl('', [])
  });
 // prescriptionDrugForm!: FormGroup;
  prescriptionDrug: PrescriptionDrug={
    clientCaseEligibilityId: '',
    clientId:'',
    clientCaseId:'',
    hivPositiveFlag: '',
    nonPreferredPharmacyFlag: '',
  };
  isBenefitsChanged = true;
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$
  searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
  addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
  editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
  removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
  triggerPriorityPopup$ = this.drugPharmacyFacade.triggerPriorityPopup$;
  selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;
  clientCaseEligibilityId: string = "";
  sessionId: any = "";
  clientId: any;
  clientCaseId: any;
  currentValue:any
  prescriptionDrugData: any = {};
  noIncomeFlag: boolean = false;
  isDisabled = false;
 
 prescriptionInfo = {} as PrescriptionDrug;

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  hasNoIncome = false;
  isNodateSignatureNoted = false;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
 
  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    
    private route: ActivatedRoute,
    private readonly incomeFacade: IncomeFacade,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly elementRef: ElementRef,
    private readonly prescriptionDrugFacade :PrescriptionDrugFacade,
 	  private readonly router :Router) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.loadSessionData();
    this.addSaveSubscription();
    this.priscriptionDrugFormChanged();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    });
  }

  /** Private Methods **/

  private buildForm() {
    this.prescriptionDrugForm = new FormGroup({
      hivFlag: new FormControl(''),
      nonPrefFlag: new FormControl('')
    });
  }
  private loadPrescriptionDrug(): void {
     this.isDisabled = false;
    this.prescriptionDrugFacade.loadPrescriptionDrug( this.clientCaseEligibilityId).subscribe({
      next: response => {
        if(response!==null){
          this.prescriptionDrugForm.controls["hivFlag"].setValue(response.hivPositiveFlag);
          this.prescriptionDrugForm.controls["nonPrefFlag"].setValue(response.nonPreferredPharmacyFlag);
          this.adjustAttributeInit();
        }
      },
    })
  }

  private priscriptionDrugFormChanged() {
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
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.prescriptionDrugForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private adjustAttributeChanged(event: Event) {
    const data: CompletionChecklist = {
      dataPointName: (event.target as HTMLInputElement).name,
      status: (event.target as HTMLInputElement).checked ? StatusFlag.Yes : StatusFlag.No
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
  }

  private adjustAttributeInit() {
    const initialAdjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };

      initialAdjustment.push(data);
    });

    if (initialAdjustment.length > 0) {
      this.workflowFacade.updateBasedOnDtAttrChecklist(initialAdjustment);
    }

    this.updateInitialCompletionCheckList();
  }

  private updateInitialCompletionCheckList(){
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.prescriptionDrugForm.controls).forEach(key => {
      if (this.prescriptionDrugForm?.get(key)?.value && this.prescriptionDrugForm?.get(key)?.valid) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes
        };

        completedDataPoints.push(item);
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.prescriptionDrugFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Prescription Drug saved sucessfully')
        this.workflowFacade.navigate(navigationType);
      }
    });
  }
  

  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.loadPrescriptionDrug();
          this.loadClientPharmacies(this.clientId);
        }
      });

  }
  private save() {
    let isValid = true;
    return of(true);
    // TODO: validate the form
    if (isValid) {
      
      this.prescriptionInfo.clientCaseEligibilityId = this.clientCaseEligibilityId;
      this.prescriptionInfo.clientId = this.clientId;
      this.prescriptionInfo.clientCaseId = this.clientCaseId;
      this.prescriptionInfo.hivPositiveFlag= this.prescriptionDrugForm.controls["hivFlag"].value;
      this.prescriptionInfo.nonPreferredPharmacyFlag= this.prescriptionDrugForm.controls["nonPrefFlag"].value;
      return this.prescriptionDrugFacade.updatePrescriptionDrug(this.prescriptionInfo,this.summaryBenefitFiles);
      
    }

    return of(false)
  }

  /** Internal event methods **/
  
  onBenefitsValueChange() {
    this.isBenefitsChanged = !this.isBenefitsChanged;
  }
  handleFileSelected(event: any) {
    this.summaryBenefitFiles = event.files[0].rawFile;
    this.summaryBenefitValidator = false;
  }

  handleFileRemoved(event: any) {
    this.summaryBenefitFiles = null;
  }

  /* Pharmacy */
  private loadClientPharmacies(clientId:number) {
    this.drugPharmacyFacade.loadClientPharmacyList(clientId);
    this.clientpharmacies$.subscribe({
      next: (pharmacies) => {
        if(pharmacies?.length > 0){
          pharmacies?.forEach((pharmacyData: any) => {
            pharmacyData.PharmacyNameAndNumber =
              pharmacyData.PharmacyName + ' #' + pharmacyData.PharmcayId;
          });          
        }   

        this.updateWorkflowCount('pharmacy', pharmacies?.length > 0);
      },
      error: (err) => {
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.updateWorkflowCount('pharmacy', false);
        console.log(err);
      },
    });
  }

  private updateWorkflowCount(dataPointName:string, isCompleted:boolean){
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: dataPointName,
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }

  addPharmacy(vendorId: string) {
    this.drugPharmacyFacade.addClientPharmacy(this.workflowFacade.clientId ?? 0, vendorId);
  }

  editPharmacyInit(vendorId: string) {
    this.drugPharmacyFacade.getPharmacyById(vendorId);
  }

  editPharmacy(data: any) {
    this.drugPharmacyFacade.editClientPharmacy(this.workflowFacade.clientId ?? 0, data?.clientPharmacyId, data?.vendorId);
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(this.workflowFacade.clientId ?? 0, clientPharmacyId);
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate([`/case-management/cases/case360/${this.clientCaseId}`])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations(){
    return this.prescriptionDrugForm.valid;
  }
}

