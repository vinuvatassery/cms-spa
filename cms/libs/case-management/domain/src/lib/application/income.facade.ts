/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Income } from '../entities/income';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';

@Injectable({ providedIn: 'root' })
export class IncomeFacade {
  /** Private properties **/
  private ddlIncomeTypesSubject = new BehaviorSubject<any>([]);
  private ddlIncomeSourcesSubject = new BehaviorSubject<any>([]);
  private ddlFrequenciesSubject = new BehaviorSubject<any>([]);
  private ddlProofOfIncomeTypesSubject = new BehaviorSubject<any>([]);
  private incomesSubject = new BehaviorSubject<any>([]);
  private dependentsProofofSchoolsSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  ddlIncomeTypes$ = this.ddlIncomeTypesSubject.asObservable();
  ddlIncomeSources$ = this.ddlIncomeSourcesSubject.asObservable();
  ddlFrequencies$ = this.ddlFrequenciesSubject.asObservable();
  ddlProofOfIncomdeTypes$ = this.ddlProofOfIncomeTypesSubject.asObservable();
  incomes$ = this.incomesSubject.asObservable();
  dependentsProofofSchools$ =
    this.dependentsProofofSchoolsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly contactDataService: ContactDataService) {}

  /** Public methods **/
  loadDdlIncomeTypes(): void {
    this.contactDataService.loadDdlIncomeTypes().subscribe({
      next: (ddlIncomesTypesResponse) => {
        this.ddlIncomeTypesSubject.next(ddlIncomesTypesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlIncomeSources(): void {
    this.contactDataService.loadDdlIncomeSources().subscribe({
      next: (ddlIncomeSourcesResponse) => {
        this.ddlIncomeSourcesSubject.next(ddlIncomeSourcesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlFrequencies(): void {
    this.contactDataService.loadDdlFrequencies().subscribe({
      next: (ddlFrequenciesResponse) => {
        this.ddlFrequenciesSubject.next(ddlFrequenciesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlProofOfIncomeTypes(): void {
    this.contactDataService.loadDdlProofOfIncomeTypes().subscribe({
      next: (ddlProofOfIncomeTypesResponse) => {
        this.ddlProofOfIncomeTypesSubject.next(ddlProofOfIncomeTypesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadIncomes(): void {
    this.contactDataService.loadIncomes().subscribe({
      next: (incomesResponse:any) => {
        this.incomesSubject.next(incomesResponse.clientIncomes);
        this.dependentsProofofSchoolsSubject.next(incomesResponse.dependets);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDependentsProofofSchools(): void {
    this.contactDataService.loadDependentsProofofSchools().subscribe({
      next: (dependentsProofofSchoolsResponse) => {
        this.dependentsProofofSchoolsSubject.next(
          dependentsProofofSchoolsResponse
        );
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

  saveClientIncome(clientIncome:any,proofOfIncomeFile:any){
    debugger
    clientIncome.clientCaseEligibilityId="D323838C-80F3-4BB6-8FD4-EF6A9FE37335";
    clientIncome.clientDependentId="00640C15-B796-4D12-9F3F-BD5A2B2DB2FD";
    clientIncome.clientId=2;
    const formData = new FormData();
    Object.keys(clientIncome).forEach((key:any) => formData.append(key, clientIncome[key]));
    formData.append('proofOfIncomeFile',proofOfIncomeFile[0])
    return this.contactDataService.saveIncome(formData);
  }

}
