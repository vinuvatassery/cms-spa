/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { SnackBar, StatusFlag } from '@cms/shared/ui-common';
import { NotificationSnackbarService, SnackBarNotificationType, LoggingService, LoaderService,ConfigurationProvider } from '@cms/shared/util-core';
import { HealthInsurancePolicy } from '../entities/health-insurance-policy';
import { HealthInsurancePolicyDataService } from '../infrastructure/health-insurance-policy.data.service';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { WorkflowFacade } from './workflow.facade';


@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyFacade {
  
  /** Private properties **/
  private coPaysAndDeductiblesSubject = new BehaviorSubject<any>([]);
  private healthInsuranceStatusSubject = new BehaviorSubject<any>([]);
  private healthInsurancePolicySubject = new Subject<HealthInsurancePolicy>();
  private medicalPremiumPaymentsSubject = new BehaviorSubject<any>([]);
  private triggerPriorityPopupSubject = new BehaviorSubject<boolean>(false);
  showInsuranceRequiredSubject  = new BehaviorSubject<boolean>(false);
  private medicalHealthPolicySubject = new BehaviorSubject<any>([]);
  private medicalHealthPlansSubject = new BehaviorSubject<any>([]);
  private ddlMedicalHealthPalnPremiumFrequecySubject = new BehaviorSubject<any>(
    []
  );
  private premiumPaymentsSubject = new BehaviorSubject<any>([]);
  triggeredPremiumPaymentSaveSubject = new BehaviorSubject<boolean>(false);
  triggeredCoPaySaveSubject = new BehaviorSubject<boolean>(false);
  private clientmaxmumbalanceSubject = new Subject<any>();
  /** Public properties **/
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>(); 
  coPaysAndDeductibles$ = this.coPaysAndDeductiblesSubject.asObservable();
  healthFacadesnackbar$ = this.snackbarSubject.asObservable();
  healthInsurancePolicy$ = this.healthInsurancePolicySubject.asObservable();
  healthInsuranceStatus$ = this.healthInsuranceStatusSubject.asObservable();
  showInsuranceRequired$ = this.showInsuranceRequiredSubject.asObservable();
  medicalPremiumPayments$ = this.medicalPremiumPaymentsSubject.asObservable();
  triggerPriorityPopup$ = this.triggerPriorityPopupSubject.asObservable();
  medicalHealthPolicy$ = this.medicalHealthPolicySubject.asObservable();
  medicalHealthPlans$ = this.medicalHealthPlansSubject.asObservable();
  ddlMedicalHealthPalnPremiumFrequecy$ =
  this.ddlMedicalHealthPalnPremiumFrequecySubject.asObservable();
  premiumPayments$ = this.premiumPaymentsSubject.asObservable();
  triggeredPremiumPaymentSave$ = this.triggeredPremiumPaymentSaveSubject.asObservable();
  triggeredCoPaySave$ = this.triggeredCoPaySaveSubject.asObservable();
  clientmaxmumbalance$ = this.clientmaxmumbalanceSubject.asObservable();

  public dateFields: Array<string> = [
    'startDate',
    'endDate',
    'premiumPaidThruDate',
    'nextPremiumDueDate',
    'medicarePartAStartDate',
    'medicarePartBStartDate',
    'oonStartDate',
    'oonEndDate',
    'creationTime'
  ];

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();

  }

  /** Constructor**/
  constructor(private readonly notificationSnackbarService: NotificationSnackbarService,
    private loggingService: LoggingService, private readonly loaderService: LoaderService,
    private healthInsurancePolicyService: HealthInsurancePolicyDataService,
    private configurationProvider: ConfigurationProvider,
    private readonly workflowFacade:WorkflowFacade) { }

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  saveHealthInsurancePolicy(healthInsurancePolicy: HealthInsurancePolicy) {

    const formData = new FormData();
    if (!!healthInsurancePolicy?.copyOfInsuranceCardFile) {
      formData.append('CopyOfInsuranceCardFile', healthInsurancePolicy?.copyOfInsuranceCardFile ?? '');
    }
    if (!!healthInsurancePolicy?.copyOfSummaryFile) {
      formData.append('CopyOfSummaryFile', healthInsurancePolicy?.copyOfSummaryFile ?? '');
    }
    if (!!healthInsurancePolicy?.proofOfPremiumFile) {
      formData.append('ProofOfPremiumFile', healthInsurancePolicy?.proofOfPremiumFile ?? '');
    }
    if (!!healthInsurancePolicy?.medicareCardFile) {
      formData.append('MedicareCardFile', healthInsurancePolicy?.medicareCardFile ?? '');
    }
    this.formDataAppendObject(formData, healthInsurancePolicy);

    return this.healthInsurancePolicyService.saveHealthInsurancePolicy(formData);
  }
  updateHealthInsurancePolicy(healthInsurancePolicy: any) {
    const formData = new FormData();
    if (!!healthInsurancePolicy?.copyOfInsuranceCardFile) {
      formData.append('CopyOfInsuranceCardFile', healthInsurancePolicy?.copyOfInsuranceCardFile ?? '');
    }
    if (!!healthInsurancePolicy?.copyOfSummaryFile) {
      formData.append('CopyOfSummaryFile', healthInsurancePolicy?.copyOfSummaryFile ?? '');
    }
    if (!!healthInsurancePolicy?.proofOfPremiumFile) {
      formData.append('ProofOfPremiumFile', healthInsurancePolicy?.proofOfPremiumFile ?? '');
    }
    if (!!healthInsurancePolicy?.medicareCardFile) {
      formData.append('MedicareCardFile', healthInsurancePolicy?.medicareCardFile ?? '');
    }
    this.formDataAppendObject(formData, healthInsurancePolicy);

    return this.healthInsurancePolicyService.updateHealthInsurancePolicy(formData);
  }

  getCarrierContactInfo(carrierId: any) {
    return this.healthInsurancePolicyService.getCarrierContactInfo(carrierId);
  }

  getHealthInsurancePolicyById(clientInsurancePolicyId: string): void {
    this.showLoader();
    this.healthInsurancePolicyService.getHealthInsurancePolicyById(clientInsurancePolicyId).subscribe({
      next: (response) => {
        this.hideLoader();
        this.healthInsurancePolicySubject.next(response);
      },
      error: (err) => {
        this.hideLoader();
      },
    });
  }  
  getMedicalClaimMaxbalance(clientId: number,caseEligibilityId:string): void {    
    this.showLoader();
    this.healthInsurancePolicyService.getMedicalClaimMaxbalance(clientId,caseEligibilityId).subscribe({
      next: (response) => {
        this.hideLoader();
        this.clientmaxmumbalanceSubject.next(response);
      },
      error: (err) => {
        this.hideLoader();
      },
    });
  }  
  setHealthInsurancePolicyPriority(healthInsurancePolicies: any) {
    return this.healthInsurancePolicyService.setHealthInsurancePolicyPriority(healthInsurancePolicies);
  }

  getHealthInsurancePolicyPriorities(clientId:any,clientCaseEligibilityId:any,insuranceStatus:string) {
    return this.healthInsurancePolicyService.getHealthInsurancePolicyPriorities(clientId,clientCaseEligibilityId,insuranceStatus);
  }

  deleteInsurancePolicyByEligibilityId(clientCaseEligibilityId:any){
    return this.healthInsurancePolicyService.deleteInsurancePolicyByEligibiltyId(clientCaseEligibilityId);
  }
  deleteInsurancePolicy(insurancePolicyId: any, endDate? : Date , isCerForm = false) {
    return this.healthInsurancePolicyService.deleteInsurancePolicy(insurancePolicyId , endDate , isCerForm);
  }
  copyHealthInsurancePolicy(insurancePolicyId: any, healthInsurancePolicy: any = {}) {
    const formData = new FormData();
    if (!!healthInsurancePolicy?.copyOfInsuranceCardFile) {
      formData.append('CopyOfInsuranceCardFile', healthInsurancePolicy?.copyOfInsuranceCardFile ?? '');
    }
    if (!!healthInsurancePolicy?.copyOfSummaryFile) {
      formData.append('CopyOfSummaryFile', healthInsurancePolicy?.copyOfSummaryFile ?? '');
    }
    if (!!healthInsurancePolicy?.proofOfPremiumFile) {
      formData.append('ProofOfPremiumFile', healthInsurancePolicy?.proofOfPremiumFile ?? '');
    }
    if (!!healthInsurancePolicy?.medicareCardFile) {
      formData.append('MedicareCardFile', healthInsurancePolicy?.medicareCardFile ?? '');
    }
    this.formDataAppendObject(formData, healthInsurancePolicy);

    return this.healthInsurancePolicyService.copyHealthInsurancePolicy(insurancePolicyId, formData);
  }
  saveInsuranceFlags(insuranceFlags: any): Observable<any> {
    return this.healthInsurancePolicyService.updateInsuranceFlags(insuranceFlags);
  }
  loadHealthInsuranceStatus() {
    this.healthInsurancePolicyService.loadHealthInsuranceStatus().subscribe({
      next: (healthInsuranceStatusResponse) => {
        this.healthInsuranceStatusSubject.next(healthInsuranceStatusResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  
  loadMedicalPremiumPayments() {
    this.healthInsurancePolicyService.loadMedicalPremiumPayments().subscribe({
      next: (medicalPremiumPaymentsResponse) => {
        this.medicalPremiumPaymentsSubject.next(medicalPremiumPaymentsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  
  loadMedicalHealthPlans(clientId: any, clientCaseEligibilityId: any,typeParam:any, skipCount: any, pageSize: any, sortBy:any, sortType:any): void {
    this.showLoader();
    this.healthInsurancePolicyService.loadMedicalHealthPlans(clientId, clientCaseEligibilityId, typeParam, skipCount, pageSize,sortBy,sortType).subscribe({
      next: (medicalHealthPlansResponse: any) => {
        this.medicalHealthPolicySubject.next(medicalHealthPlansResponse);
        if (medicalHealthPlansResponse) {
          if (medicalHealthPlansResponse['clientInsurancePolicies'] == null) {
            medicalHealthPlansResponse['clientInsurancePolicies'] = []
          }
          const gridView: any = {
            data: medicalHealthPlansResponse['clientInsurancePolicies'],
            total: medicalHealthPlansResponse?.totalCount,
          };
          this.updateWorkflowCount('insurance_plans',  medicalHealthPlansResponse?.totalCount > 0);
          if(medicalHealthPlansResponse?.clientInsurancePolicies.length > 1){
            this.triggerPriorityPopupSubject.next(true);
          }
          else
          {
            this.triggerPriorityPopupSubject.next(false);
          }
          this.medicalHealthPlansSubject.next(gridView);
        }
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  private updateWorkflowCount(dataPointName:string, isCompleted:boolean){
    const dataPoint: CompletionChecklist[] = [{
      dataPointName: dataPointName,
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(dataPoint);
  }
  private formDataAppendObject(fd: FormData, obj: any, key?: any) {
    let i, k;
    for (i in obj) {
      k = key ? key + '[' + i + ']' : i;
      if (obj[i] instanceof File) {
        continue;
      }
      else if (typeof obj[i] == 'object') {
        if (this.dateFields.indexOf(i) >= 0) {         
            fd.append(i, obj[i]);
        }
        else {
          this.formDataAppendObject(fd, obj[i], k);
        }
      }
      else {
        fd.append(k, obj[i]);
      }
    }
  }

  loadCoPaysAndDeductibles(clientId: any, clientCaseId: any, clientCaseEligibilityId: any, gridDataRefinerValue: any) {
    this.showLoader()
    this.healthInsurancePolicyService.loadPaymentRequest(clientId, clientCaseId, clientCaseEligibilityId, gridDataRefinerValue).subscribe({
      next: (coPaysAndDeductiblesResponse: any) => {        
        const gridView = {
          data: coPaysAndDeductiblesResponse['items'],
          total: coPaysAndDeductiblesResponse['totalCount'],
        };
        this.coPaysAndDeductiblesSubject.next(gridView);
        this.hideLoader();
      },
      error: (err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },

    });

  }
  loadPremiumPayments(clientId: any, clientCaseId: any, clientCaseEligibilityId: any, gridDataRefinerValue: any) {
    this.showLoader()
    
    this.healthInsurancePolicyService.loadPaymentRequest(clientId, clientCaseId, clientCaseEligibilityId, gridDataRefinerValue).subscribe({
      next: (premiumPaymentsResponse: any) => {
        const gridView = {
          data: premiumPaymentsResponse['items'],
          total: premiumPaymentsResponse['totalCount'],
        };
        this.premiumPaymentsSubject.next(gridView);
        this.hideLoader();
      },
      error: (err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  savePaymentRequest(paymentRequest:any){
    return this.healthInsurancePolicyService.savePaymentRequest(paymentRequest);
  }

  loadInsurancePoliciesByProviderId(insurancePlanId: any, clientId: any, clientCaseEligibilityId: any, isDental: any) {
   return this.healthInsurancePolicyService.loadInsurancePoliciesByProviderId(insurancePlanId, clientId, clientCaseEligibilityId, isDental);
  }

  validateCerReviewStatus(eligibilityId: any,) : Observable<boolean>{
    return this.healthInsurancePolicyService.validateCerReviewStatus(eligibilityId).pipe(
      catchError((err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        return of(false);
      })
    );
  }
}
