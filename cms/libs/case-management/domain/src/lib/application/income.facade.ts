/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Income } from '../entities/income';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';

@Injectable({ providedIn: 'root' })
export class IncomeFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;

  /** Private properties **/
  private ddlIncomeTypesSubject = new BehaviorSubject<any>([]);
  private ddlIncomeSourcesSubject = new BehaviorSubject<any>([]);
  private ddlFrequenciesSubject = new BehaviorSubject<any>([]);
  private ddlProofOfIncomeTypesSubject = new BehaviorSubject<any>([]);
  private incomesSubject = new BehaviorSubject<any>([]);
  private incomesResponseSubject = new BehaviorSubject<any>([]);
  private dependentsProofofSchoolsSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  ddlIncomeTypes$ = this.ddlIncomeTypesSubject.asObservable();
  ddlIncomeSources$ = this.ddlIncomeSourcesSubject.asObservable();
  ddlFrequencies$ = this.ddlFrequenciesSubject.asObservable();
  ddlProofOfIncomdeTypes$ = this.ddlProofOfIncomeTypesSubject.asObservable();
  incomes$ = this.incomesSubject.asObservable();
  incomesResponse$ = this.incomesResponseSubject.asObservable();
  dependentsProofofSchools$ = this.dependentsProofofSchoolsSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly contactDataService: ContactDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider) { }

    ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
    {        
      if(type == SnackBarNotificationType.ERROR)
      {
         const err= subtitle;    
         this.loggingService.logException(err)
      }  
      this.notificationSnackbarService.manageSnackBar(type,subtitle)
      this.HideLoader();   
    }

    ShowLoader()
    {
      this.loaderService.show();
    }
  
    HideLoader()
    {
      this.loaderService.hide();
    }

  /** Public methods **/
  loadDdlIncomeTypes(): void {
    this.contactDataService.loadDdlIncomeTypes().subscribe({
      next: (ddlIncomesTypesResponse) => {
        this.ddlIncomeTypesSubject.next(ddlIncomesTypesResponse);
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)  
      },
    });
  }

  loadDdlIncomeSources(): void {
    this.contactDataService.loadDdlIncomeSources().subscribe({
      next: (ddlIncomeSourcesResponse) => {
        this.ddlIncomeSourcesSubject.next(ddlIncomeSourcesResponse);
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)  
      },
    });
  }

  loadDdlFrequencies(): void {
    this.contactDataService.loadDdlFrequencies().subscribe({
      next: (ddlFrequenciesResponse) => {
        this.ddlFrequenciesSubject.next(ddlFrequenciesResponse);
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)  
      },
    });
  }

  loadDdlProofOfIncomeTypes(): void {
    this.contactDataService.loadDdlProofOfIncomeTypes().subscribe({
      next: (ddlProofOfIncomeTypesResponse) => {
        this.ddlProofOfIncomeTypesSubject.next(ddlProofOfIncomeTypesResponse);
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)  
      },
    });
  }

  loadIncomes(clientId:string,clientCaseEligibilityId:string,skip:any,pageSize:any): void {
    this.ShowLoader();
    this.contactDataService.loadIncomes(clientId,clientCaseEligibilityId,skip,pageSize).subscribe({
      next: (incomesResponse: any) => {
        if(incomesResponse.clientIncomes!=null){
          const gridView: any = {
            data: incomesResponse.clientIncomes,
            total:incomesResponse.totalCount,
          };
          this.incomesSubject.next(gridView);
        }
        else{
          const gridView: any = {
            data: [],
            total:incomesResponse.totalCount,
          };
          this.incomesSubject.next(gridView);
        }
        this.dependentsProofofSchoolsSubject.next(incomesResponse.dependents);
        this.incomesResponseSubject.next(incomesResponse);
         this.HideLoader();
      },
      error: (err) => {
        this.HideLoader();
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)  
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
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)  
      },
    });
  }

  save(noIncomeData : any): Observable<any> {
    return this.contactDataService.updateNoIncomeData(noIncomeData);
  }

  saveClientIncome(clientIncome: any, proofOfIncomeFile: any) {
    const formData: any = new FormData();
    for (var key in clientIncome) {
      if (key == "incomeStartDate" || key == 'incomeEndDate') {
        formData.append(key, (new Date(clientIncome[key]).toLocaleDateString()));
      }
      else {
        formData.append(key, clientIncome[key]);
      }
    }
    formData.append('ProofOfIncomeFile', proofOfIncomeFile);
    return this.contactDataService.saveIncome(formData);
  }
  editClientIncome(clientIncome:any, proofOfIncomeFile:any){
    const formData: any = new FormData();
    for (var key in clientIncome) {
      if (key == "incomeStartDate" || key == 'incomeEndDate') {
        formData.append(key, (new Date(clientIncome[key]).toLocaleDateString()));
      }
      else {
        formData.append(key, clientIncome[key]);
      }
    }
    formData.append('proofOfIncomeFile',proofOfIncomeFile)
    return this.contactDataService.editIncome(formData);
  }

  deleteIncome(clientIncomeId : string, clientId : any, clientCaseEligibilityId : string) {
    return this.contactDataService.deleteIncome(clientIncomeId,clientId,clientCaseEligibilityId);
  }

  loadIncomeDetails(clientIncomeId : string){
    return this.contactDataService.loadIncomeDetailsService(clientIncomeId)
  }
}
