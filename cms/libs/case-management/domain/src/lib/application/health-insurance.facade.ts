/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';

@Injectable({ providedIn: 'root' })
export class HealthInsuranceFacade {
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

  /** Constructor**/
  constructor(private readonly contactDataService: ContactDataService) {}

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

  loadMedicalHealthPlans(): void {
    this.contactDataService.loadMedicalHealthPlans().subscribe({
      next: (medicalHealthPlansResponse) => {
        this.medicalHealthPlansSubject.next(medicalHealthPlansResponse);
      },
      error: (err) => {
        console.error('err', err);
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

  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
}
