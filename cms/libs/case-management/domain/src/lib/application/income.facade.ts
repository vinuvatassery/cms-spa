/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, ConfigurationProvider, NotificationSource  } from '@cms/shared/util-core';
import { Observable,Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class IncomeFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'incomeSourceCodeDesc';
  public sortType = 'asc';

  /** Private properties **/
  private ddlIncomeTypesSubject = new BehaviorSubject<any>([]);
  private ddlIncomeSourcesSubject = new BehaviorSubject<any>([]);
  private ddlFrequenciesSubject = new BehaviorSubject<any>([]);
  private ddlProofOfIncomeTypesSubject = new BehaviorSubject<any>([]);
  private incomesSubject = new BehaviorSubject<any>([]);
  private incomesResponseSubject = new BehaviorSubject<any>([]);
  private dependentsProofofSchoolsSubject = new BehaviorSubject<any>([]);
  incomeValidSubject = new Subject<boolean>();
  dependantProofProfilePhotoSubject = new Subject();
  incomeListProfilePhotoSubject = new Subject();

  /** Public properties **/
  ddlIncomeTypes$ = this.ddlIncomeTypesSubject.asObservable();
  ddlIncomeSources$ = this.ddlIncomeSourcesSubject.asObservable();
  ddlFrequencies$ = this.ddlFrequenciesSubject.asObservable();
  ddlProofOfIncomdeTypes$ = this.ddlProofOfIncomeTypesSubject.asObservable();
  incomes$ = this.incomesSubject.asObservable();
  incomesResponse$ = this.incomesResponseSubject.asObservable();
  dependentsProofofSchools$ = this.dependentsProofofSchoolsSubject.asObservable();
  incomeValid$ = this.incomeValidSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly contactDataService: ContactDataService,
    private readonly loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly userManagementFacade: UserManagementFacade) { }

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

  loadIncomes(clientId:string,clientCaseEligibilityId:string,skip:any,pageSize:any, sortBy:any, sortType:any): void {
    this.showLoader();
    this.contactDataService.loadIncomes(clientId,clientCaseEligibilityId,skip,pageSize, sortBy, sortType).subscribe({
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
        if(incomesResponse.dependents){
          this.loadDependantProofDistinctUserIdsAndProfilePhoto(incomesResponse.dependents);
        }
        if(incomesResponse.clientIncomes){
          this.loadIncomeDistinctUserIdsAndProfilePhoto(incomesResponse.clientIncomes);
        }
        this.hideLoader();
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadDependantProofDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.dependantProofProfilePhotoSubject.next(data);
          }
        },
      });
    }
}

loadIncomeDistinctUserIdsAndProfilePhoto(data: any[]) {
  const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
  if(distinctUserIds){
    this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
    .subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          this.incomeListProfilePhotoSubject.next(data);
        }
      },
    });
  }
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
    for (let key in clientIncome) {
      if( key == 'incomeEndDate'&& clientIncome.incomeEndDate !=null && clientIncome.incomeEndDate !=""){
        formData.append(key, (new Date(clientIncome[key]).toLocaleDateString("en-US")));
      }
      if (key == "incomeStartDate") {
        formData.append(key, (new Date(clientIncome[key]).toLocaleDateString("en-US")));
      }
      else {
        formData.append(key, clientIncome[key]);
      }
    }
    formData.append('ProofOfIncomeFile', proofOfIncomeFile);
    formData.append('documentTypeCode', documentTypeCode);
    return this.contactDataService.saveIncome(clientId,formData);
  }
  editClientIncome(clientId : any, clientIncomeId : any, clientIncome:any, proofOfIncomeFile:any, documentTypeCode: any){
    const formData: any = new FormData();
    for (let key in clientIncome) {
      if( key == 'incomeEndDate'&& clientIncome.incomeEndDate !=null && clientIncome.incomeEndDate !=""){
        formData.append(key, (new Date(clientIncome[key]).toLocaleDateString("en-US")));
      }
      if (key == "incomeStartDate") {
        formData.append(key, (new Date(clientIncome[key]).toLocaleDateString("en-US")));
      }
      else {
        formData.append(key, clientIncome[key]);
      }
    }
    formData.append('proofOfIncomeFile',proofOfIncomeFile)
    formData.append('documentTypeCode', documentTypeCode);
    return this.contactDataService.editIncome(clientId, clientIncomeId, formData);
  }

  deleteIncome(clientIncomeId : string, clientId : any) {
    return this.contactDataService.deleteIncome(clientIncomeId,clientId);
  }
  loadIncomeDetails(clientId : any, clientIncomeId : string){
    return this.contactDataService.loadIncomeDetailsService(clientId, clientIncomeId)
  }
}
