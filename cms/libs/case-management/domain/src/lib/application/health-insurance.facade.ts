/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
@Injectable({ providedIn: 'root' })
export class HealthInsuranceFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;

  /** Private properties **/
  private ddlMedicalHealthInsurancePlansSubject = new BehaviorSubject<any>([]);
  private ddlMedicalHealthPalnPremiumFrequecySubject = new BehaviorSubject<any>(
    []
  );
  private ddlMedicalHealthPlanPrioritySubject = new BehaviorSubject<any>([]);
  private ddlMedicalHealthPlanMetalLevelSubject = new BehaviorSubject<any>([]);
  private coPaysAndDeductiblesSubject = new BehaviorSubject<any>([]);
  private medicalPremiumPaymentsSubject = new BehaviorSubject<any>([]);
  private healthInsuranceStatusSubject = new BehaviorSubject<any>([]);
  private medicalHealthPlansSubject = new BehaviorSubject<any>([]);
  private medicalHealthPolicySubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  ddlMedicalHealthInsurancePlans$ =
    this.ddlMedicalHealthInsurancePlansSubject.asObservable();
  ddlMedicalHealthPlanPriority$ =
    this.ddlMedicalHealthPlanPrioritySubject.asObservable();
  ddlMedicalHealthPlanMetalLevel$ =
    this.ddlMedicalHealthPlanMetalLevelSubject.asObservable();
  ddlMedicalHealthPalnPremiumFrequecy$ =
    this.ddlMedicalHealthPalnPremiumFrequecySubject.asObservable();
  coPaysAndDeductibles$ = this.coPaysAndDeductiblesSubject.asObservable();
  medicalPremiumPayments$ = this.medicalPremiumPaymentsSubject.asObservable();
  healthInsuranceStatus$ = this.healthInsuranceStatusSubject.asObservable();
  medicalHealthPlans$ = this.medicalHealthPlansSubject.asObservable();
  medicalHealthPolicy$ = this.medicalHealthPolicySubject.asObservable();

  /** Constructor**/
  constructor(private readonly contactDataService: ContactDataService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider) { }

  ShowHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.HideLoader();
  }

  ShowLoader() {
    this.loaderService.show();
  }

  HideLoader() {
    this.loaderService.hide();
  }

  /** Public methods **/
  loadDdlMedicalHealthInsurancePlans(): void {
    this.contactDataService.loadDdlMedicalHealthInsurancePlans().subscribe({
      next: (ddlMedicalHealthInsurancePlansResponse) => {
        this.ddlMedicalHealthInsurancePlansSubject.next(
          ddlMedicalHealthInsurancePlansResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadMedicalHealthPlans(clientId: any, clientCaseEligibilityId: any,skipCount:any,pageSize:any): void {
    this.ShowLoader();
    this.contactDataService.loadMedicalHealthPlans(clientId, clientCaseEligibilityId,skipCount,pageSize).subscribe({
      next: (medicalHealthPlansResponse: any) => {
        this.medicalHealthPolicySubject.next(medicalHealthPlansResponse);
        if (medicalHealthPlansResponse) {
          const gridView: any = {
            data: medicalHealthPlansResponse['clientInsurancePolicies'],
            total: medicalHealthPlansResponse?.totalCount,
          };
          
        this.medicalHealthPlansSubject.next(gridView);
        }
        this.HideLoader();
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  loadDdlMedicalHealthPlanPriority(): void {
    this.contactDataService.loadDdlMedicalHealthPlanPriority().subscribe({
      next: (ddlMedicalHealthPlanPriorityResponse) => {
        this.ddlMedicalHealthPlanPrioritySubject.next(
          ddlMedicalHealthPlanPriorityResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlMedicalHealthPlanMetalLevel() {
    this.contactDataService.loadDdlMedicalHealthPlanMetalLevel().subscribe({
      next: (ddlMedicalHealthPlanMetalLevelResponse) => {
        this.ddlMedicalHealthPlanMetalLevelSubject.next(
          ddlMedicalHealthPlanMetalLevelResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlMedicalHealthPalnPremiumFrequecy() {
    this.contactDataService
      .loadDdlMedicalHealthPalnPremiumFrequecy()
      .subscribe({
        next: (ddlMedicalHealthPalnPremiumFrequecyResponse) => {
          this.ddlMedicalHealthPalnPremiumFrequecySubject.next(
            ddlMedicalHealthPalnPremiumFrequecyResponse
          );
        },
        error: (err) => {
          console.error('err', err);
        },
      });
  }

  loadMedicalPremiumPayments() {
    this.contactDataService.loadMedicalPremiumPayments().subscribe({
      next: (medicalPremiumPaymentsResponse) => {
        this.medicalPremiumPaymentsSubject.next(medicalPremiumPaymentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadHealthInsuranceStatus() {
    this.contactDataService.loadHealthInsuranceStatus().subscribe({
      next: (healthInsuranceStatusResponse) => {
        this.healthInsuranceStatusSubject.next(healthInsuranceStatusResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCoPaysAndDeductibles() {
    this.contactDataService.loadCoPaysAndDeductibles().subscribe({
      next: (coPaysAndDeductiblesResponse) => {
        this.coPaysAndDeductiblesSubject.next(coPaysAndDeductiblesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  saveInsuranceFlags(insuranceFlags: any): Observable<any> {
    return this.contactDataService.updateInsuranceFlags(insuranceFlags);
  }

  deleteInsurancePolicy(insurancePolicyId:any){
    return this.contactDataService.deleteInsurancePolicy(insurancePolicyId);
  }
}
