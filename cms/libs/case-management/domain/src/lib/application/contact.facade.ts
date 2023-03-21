/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Contact, ContactInfo } from '../entities/contact';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { ZipCodeFacade } from '@cms/system-config/domain'
import { catchError, of, Subject } from 'rxjs';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  /** Private properties **/
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private ddlCountriesSubject = new BehaviorSubject<any>([]);
  private ddlPreferredContactMethodsSubject = new BehaviorSubject<any>([]);
  private ddlAddressTypesSubject = new BehaviorSubject<any>([]);
  private ddlPhoneTypesSubject = new BehaviorSubject<any>([]);
  private ddlrelationshipToClientSubject = new BehaviorSubject<any>([]);
  private friendsOrFamilySubject = new BehaviorSubject<any>([]);
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private addressesSubject = new BehaviorSubject<any>([]);
  private phoneNumbersSubject = new BehaviorSubject<any>([]);
  private emailAddressesSubject = new BehaviorSubject<any>([]);
  private showloaderOnCounty = new BehaviorSubject<boolean>(false);
  private clientPhonesSubject =  new Subject<any>();

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  ddlCountries$ = this.ddlCountriesSubject.asObservable();
  ddlPreferredContactMethods$ =
    this.ddlPreferredContactMethodsSubject.asObservable();
  ddlAddressTypes$ = this.ddlAddressTypesSubject.asObservable();
  ddlPhoneTypes$ = this.ddlPhoneTypesSubject.asObservable();
  ddlRelationshipToClient$ = this.ddlrelationshipToClientSubject.asObservable();
  friendsOrFamily$ = this.friendsOrFamilySubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  address$ = this.addressesSubject.asObservable();
  phoneNumbers$ = this.phoneNumbersSubject.asObservable();
  emailAddress$ = this.emailAddressesSubject.asObservable();
  showloaderOnCounty$ = this.showloaderOnCounty.asObservable();
  clientPhones$ = this.clientPhonesSubject.asObservable();

  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = ' '
  public sortType = 'asc'

  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];


  /** Constructor**/
  constructor(
    private readonly contactDataService: ContactDataService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly zipCodeFacade: ZipCodeFacade,   
    private readonly notificationSnackbarService : NotificationSnackbarService ,
    private readonly loaderService: LoaderService,
    private configurationProvider : ConfigurationProvider 
  ) { }


  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }
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


  /** Public methods **/
  loadDdlStates(): void {
    this.zipCodeFacade.getStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlCounties(stateCode: string): void {
    this.showloaderOnCounty.next(true);
    this.zipCodeFacade.getCounties(stateCode).subscribe({
      next: (ddlCountriesResponse) => {
        this.ddlCountriesSubject.next(ddlCountriesResponse);
        this.showloaderOnCounty.next(false);
      },
      error: (err) => {
        this.loggingService.logException(err);
        this.showloaderOnCounty.next(false);
      },
    });
  }

  loadDdlPreferredContactMethods(): void {
    this.contactDataService.loadDdlPreferredContactMethods().subscribe({
      next: (ddlPreferredContactMethodsResponse) => {
        this.ddlPreferredContactMethodsSubject.next(
          ddlPreferredContactMethodsResponse
        );
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadAddress(): void {
    this.contactDataService.loadAddresses().subscribe({
      next: (addressesResponse) => {
        this.addressesSubject.next(addressesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlAddressType(): void {
    this.contactDataService.loadDdlAddressTypes().subscribe({
      next: (ddlAddressTypesResponse) => {
        this.ddlAddressTypesSubject.next(ddlAddressTypesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadPhoneNumbers(): void {
    this.contactDataService.loadPhoneNumbers().subscribe({
      next: (phoneNumbersResponse) => {
        this.phoneNumbersSubject.next(phoneNumbersResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlPhoneType(): void {
    this.contactDataService.loadDdlPhoneTypes().subscribe({
      next: (ddlPhoneTypesResponse) => {
        this.ddlPhoneTypesSubject.next(ddlPhoneTypesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadEmailAddress(): void {
    this.contactDataService.loadEmailAddresses().subscribe({
      next: (emailAddressesResponse) => {
        this.emailAddressesSubject.next(emailAddressesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlRelationshipToClient(): void {
    this.contactDataService.loadDdlRelationshipToClient().subscribe({
      next: (ddlrelationshipToClientResponse) => {
        this.ddlrelationshipToClientSubject.next(
          ddlrelationshipToClientResponse
        );
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadFriendsorFamily(): void {
    this.contactDataService.loadFriendsorFamily().subscribe({
      next: (friendsOrFamilyResponse) => {
        this.friendsOrFamilySubject.next(friendsOrFamilyResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadContactInfo(clientId: number, clientCaseEligibilityId: string) {
    return this.contactDataService.loadContactInfo(clientId, clientCaseEligibilityId);
  }

  createContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    return this.contactDataService.createContactInfo(clientId, clientCaseEligibilityId, contactInfo)
      .pipe(
        catchError((err: any) => {
          this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
          if (!(err?.error ?? false)) {
            this.loggingService.logException(err);
          }
          return of(false);
        })
      );
  }

  updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    return this.contactDataService.updateContactInfo(clientId, clientCaseEligibilityId, contactInfo).pipe(
      catchError((err: any) => {
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
        }
        return of(false);
      })
    );
  }


  //#region client profile //NOSONAR
    loadClientPhones(clientId : number,skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated : boolean): void {
      this.showLoader();
      this.contactDataService.loadClientPhones(clientId , skipcount ,maxResultCount  ,sort , sortType,showDeactivated).subscribe({
        next: (clientPhonesResponse : any) => {        
          if(clientPhonesResponse)
          {      
            const gridView = {
              data : clientPhonesResponse["items"] ,        
              total:  clientPhonesResponse["totalCount"]      
              };      
          
            this.clientPhonesSubject.next(gridView);
            this.hideLoader();    
          }
          else{
          this.hideLoader();    
          }
        },
        error: (err) => {      
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);       
        },
      });
    }

  //#endregion client profile //NOSONAR
}
