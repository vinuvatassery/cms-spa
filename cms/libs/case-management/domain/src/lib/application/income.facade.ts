/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, ConfigurationProvider, NotificationSource  } from '@cms/shared/util-core';
import { Observable,Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { GridFilterParam } from '../entities/grid-filter-param';

@Injectable({ providedIn: 'root' })
export class IncomeFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'incomeSourceCodeDesc';
  public sortType = 'asc';
  public dateFields: Array<string> = [
    'incomeStartDate',
    'incomeEndDate',    
  ];

  /** Private properties **/
  private ddlIncomeTypesSubject = new BehaviorSubject<any>([]);
  private ddlIncomeSourcesSubject = new BehaviorSubject<any>([]);
  private ddlFrequenciesSubject = new BehaviorSubject<any>([]);
  private ddlProofOfIncomeTypesSubject = new BehaviorSubject<any>([]);
  private incomesSubject = new BehaviorSubject<any>([]);
  private incomesResponseSubject = new BehaviorSubject<any>([]);
  private dependentsProofofSchoolsSubject = new BehaviorSubject<any>([]);
  incomeValidSubject = new Subject<boolean>();
  employerSubject = new Subject<any>();
  private incomesLoaderSubject = new BehaviorSubject<boolean>(false);

  /** Public properties **/
  ddlIncomeTypes$ = this.ddlIncomeTypesSubject.asObservable();
  ddlIncomeSources$ = this.ddlIncomeSourcesSubject.asObservable();
  ddlFrequencies$ = this.ddlFrequenciesSubject.asObservable();
  ddlProofOfIncomdeTypes$ = this.ddlProofOfIncomeTypesSubject.asObservable();
  incomes$ = this.incomesSubject.asObservable();
  incomesResponse$ = this.incomesResponseSubject.asObservable();
  dependentsProofofSchools$ = this.dependentsProofofSchoolsSubject.asObservable();
  incomeValid$ = this.incomeValidSubject.asObservable();
  employers$ = this.employerSubject.asObservable();
  incomesLoader$ = this.incomesLoaderSubject.asObservable();
  /** Constructor**/
  constructor(
    private readonly contactDataService: ContactDataService,
    private readonly loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider) { }

    showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
    {
      if(type == SnackBarNotificationType.ERROR)
      {
         const err= subtitle;
         this.loggingService.logException(err)
      }
      this.notificationSnackbarService.manageSnackBar(type,subtitle)
      this.hideLoader();
    }

    errorShowHideSnackBar( subtitle : any)
    {
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
    }

    showLoader()
    {
      this.loaderService.show();
    }

    hideLoader()
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlIncomeSources(): void {
    this.contactDataService.loadDdlIncomeSources().subscribe({
      next: (ddlIncomeSourcesResponse) => {
        this.ddlIncomeSourcesSubject.next(ddlIncomeSourcesResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlFrequencies(): void {
    this.contactDataService.loadDdlFrequencies().subscribe({
      next: (ddlFrequenciesResponse) => {
        this.ddlFrequenciesSubject.next(ddlFrequenciesResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDdlProofOfIncomeTypes(): void {
    this.contactDataService.loadDdlProofOfIncomeTypes().subscribe({
      next: (ddlProofOfIncomeTypesResponse) => {
        this.ddlProofOfIncomeTypesSubject.next(ddlProofOfIncomeTypesResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadIncomes(clientId:string,clientCaseEligibilityId:string,gridFilterParam:GridFilterParam): void {
    //this.showLoader();
    this.incomesLoaderSubject.next(true);
    this.contactDataService.loadIncomes(clientId,clientCaseEligibilityId,gridFilterParam).subscribe({
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
         //this.hideLoader();
         this.incomesLoaderSubject.next(false);
      },
      error: (err) => {
        //this.hideLoader();
        this.incomesLoaderSubject.next(false);
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  save(clientCaseEligibilityId : any, noIncomeData : any): Observable<any> {
    return this.contactDataService.updateNoIncomeData(clientCaseEligibilityId, noIncomeData);
  }

  saveClientIncome(clientId : any,clientIncome: any, proofOfIncomeFile: any, documentTypeCode: any) {

    const formData: any = new FormData();
    formData.append('ProofOfIncomeFile', proofOfIncomeFile);
    formData.append('documentTypeCode', documentTypeCode);
    this.formDataAppendObject(formData, clientIncome);
    return this.contactDataService.saveIncome(clientId,formData);
  }
  editClientIncome(clientId : any, clientIncomeId : any, clientIncome:any, proofOfIncomeFile:any, documentTypeCode: any){
    const formData: any = new FormData();    
    formData.append('proofOfIncomeFile',proofOfIncomeFile)
    formData.append('documentTypeCode', documentTypeCode);
    this.formDataAppendObject(formData, clientIncome);
    return this.contactDataService.editIncome(clientId, clientIncomeId, formData);
  }

  deleteIncome(clientIncomeId : string, clientId : any) {
    return this.contactDataService.deleteIncome(clientIncomeId,clientId);
  }
  loadIncomeDetails(clientId : any, clientIncomeId : string){
    return this.contactDataService.loadIncomeDetailsService(clientId, clientIncomeId)
  }

  loadEmployers(searchText :any): void {
    this.contactDataService.loadEmployers(searchText).subscribe({
      next: (employers) => {
        this.employerSubject.next(employers);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
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
  
}
