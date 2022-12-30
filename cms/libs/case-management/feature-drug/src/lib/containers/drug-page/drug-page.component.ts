/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { debounceTime, distinctUntilChanged, pairwise, startWith,first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { DrugPharmacyFacade, PriorityCode, WorkflowFacade,IncomeFacade, PrescriptionDrugFacade, PrescriptionDrug, StatusFlag, YesNoFlag, CompletionChecklist } from '@cms/case-management/domain';
import { Validators, FormGroup, FormControl, FormBuilder, } from '@angular/forms';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  public prescriptionDrugForm :FormGroup = new FormGroup({
    hivFlag: new FormControl('', []),
    nonPrefFlag: new FormControl('', [])
  });
 // prescriptionDrugForm!: FormGroup;
  prescriptionDrug: PrescriptionDrug={
    clientCaseEligibilityId: '',
    hivPositiveFlag: '',
    nonPreferredPharmacyFlag: '',
  };
  isBenefitsChanged = true;
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$
  addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
  editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
  removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
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
 
  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
   
    private route: ActivatedRoute,
    private readonly incomeFacade: IncomeFacade,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private prescriptionDrugFacade :PrescriptionDrugFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    debugger;
    this.buildForm();
    this.loadSessionData();
    this.addSaveSubscription();
    this.loadClientPharmacies();
    this.priscriptionDrugFormChanged();
    
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  }

  /** Private Methods **/

  private buildForm() {
    debugger;
    this.prescriptionDrugForm = new FormGroup({
      hivFlag: new FormControl(''),
      nonPrefFlag: new FormControl('')
    });
  }
  private loadPrescriptionDrug(): void {
    debugger;
     this.isDisabled = false;
    this.prescriptionDrugFacade.loadPrescriptionDrug( this.clientCaseEligibilityId).subscribe({
      next: response => {
        debugger;
        if(response!==null){
          this.prescriptionDrugForm.controls["hivFlag"].setValue(response.hivPositiveFlag);
          this.prescriptionDrugForm.controls["nonPrefFlag"].setValue(response.nonPreferredPharmacyFlag);
          
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
      else {
        if (this.prescriptionDrugForm?.get(key)?.value && this.prescriptionDrugForm?.get(key)?.valid) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: StatusFlag.Yes
          };

          completedDataPoints.push(item);
        }
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
    debugger;
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        debugger;
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.loadPrescriptionDrug();
        }
      });

  }
  private save() {
    debugger;
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      
      this.prescriptionInfo.clientCaseEligibilityId = this.clientCaseEligibilityId;
      this.prescriptionInfo.hivPositiveFlag= this.prescriptionDrugForm.controls["hivFlag"].value;
      this.prescriptionInfo.nonPreferredPharmacyFlag= this.prescriptionDrugForm.controls["nonPrefFlag"].value;
      return this.prescriptionDrugFacade.updatePrescriptionDrug(this.prescriptionInfo);
      
    }

    return of(false)
  }

  /** Internal event methods **/
  
  onBenefitsValueChange() {
    this.isBenefitsChanged = !this.isBenefitsChanged;
  }


  /* Pharmacy */
  private loadClientPharmacies() {
    this.drugPharmacyFacade.loadClientPharmacyList(this.workflowFacade.clientId ?? 0);
    this.clientpharmacies$.subscribe({
      next: (pharmacies) => {
        pharmacies.forEach((pharmacyData: any) => {
          pharmacyData.PharmacyNameAndNumber =
            pharmacyData.PharmacyName + ' #' + pharmacyData.PharmcayId;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }

  addPharmacy(vendorId: string) {
    this.drugPharmacyFacade.addClientPharmacy(this.workflowFacade.clientId ?? 0, vendorId, PriorityCode.Primary);
  }

  editPharmacyInit(vendorId: string) {
    this.drugPharmacyFacade.getPharmacyById(vendorId);
  }

  editPharmacy(data: any) {
    this.drugPharmacyFacade.editClientPharmacy(this.workflowFacade.clientId ?? 0, data?.clientPharmacyId, data?.vendorId, PriorityCode.Primary);
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(this.workflowFacade.clientId ?? 0, clientPharmacyId);
  }
}

