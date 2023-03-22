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
  private clientPhoneSubject =  new Subject<any>();
  private addClientPhoneSubject =  new Subject<any>();
  private preferredClientPhoneSubject =  new Subject<any>();
  private deactivateClientPhoneSubject =  new Subject<any>();
  private removeClientPhoneSubject =  new Subject<any>();

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
  clientPhone$ = this.clientPhoneSubject.asObservable();
  addClientPhoneResponse$ = this.addClientPhoneSubject.asObservable();
  preferredClientPhone$ = this.preferredClientPhoneSubject.asObservable();
  deactivateClientPhone$ = this.deactivateClientPhoneSubject.asObservable();
  removeClientPhone$ = this.removeClientPhoneSubject.asObservable();

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
     
      this.contactDataService.loadClientPhones(clientId , skipcount ,maxResultCount  ,sort , sortType,showDeactivated).subscribe({
        next: (clientPhonesResponse : any) => {        
          if(clientPhonesResponse)
          {      
            const gridView = {
              data : clientPhonesResponse["items"] ,        
              total:  clientPhonesResponse["totalCount"]      
              };      
          
            this.clientPhonesSubject.next(gridView);
          
          }
         
        },
        error: (err) => {      
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);       
        },
      });
    }

    loadClientPhone(clientId : number,clientPhoneId : string): void {
      this.showLoader();     
      this.contactDataService.loadClientPhone(clientId , clientPhoneId).subscribe({
        next: (clientPhoneReponse : any) => {        
          if(clientPhoneReponse)
          {                  
            this.hideLoader()
            this.clientPhoneSubject.next(clientPhoneReponse);
          }         
        },
        error: (err) => {     
          this.hideLoader() 
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);       
        },
      });
    }


    
    addClientPhone(phoneData: any) {   
        this.loaderService.show();
        return this.contactDataService.savePhone(phoneData).subscribe({
          next: (response) => {
            this.addClientPhoneSubject.next(response)  
            if (response === true) { 
              const message =  phoneData?.clientPhoneId ? 'Phone Data Updated Successfully' :'Phone Data Added Successfully'
              this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
            }
            this.loaderService.hide();
          },
          error: (err) => {       
            this.loaderService.hide();
            this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);       
          },
        });
      }

      preferredClientPhone(clientId : number,clientPhoneId : string) {   
        this.loaderService.show();
        return this.contactDataService.updateClientPhonePreferred(clientId ,clientPhoneId ).subscribe({
          next: (response) => {
            this.preferredClientPhoneSubject.next(response)  
            if (response === true) { 
              const message =   'Phone Data Updated Successfully' 
              this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
            }
            this.loaderService.hide();
          },
          error: (err) => {       
            this.loaderService.hide();
            this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);       
          },
        });
      }

      deactivateClientPhone(clientId : number,clientPhoneId : string) {   
        this.loaderService.show();
        return this.contactDataService.deactivateClientPhone(clientId ,clientPhoneId ).subscribe({
          next: (response) => {
            this.deactivateClientPhoneSubject.next(response)  
            if (response === true) { 
              const message =   'Phone Deactivated Successfully' 
              this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
            }
            this.loaderService.hide();
          },
          error: (err) => {       
            this.loaderService.hide();
            this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);       
          },
        });
      }

      removeClientPhone(clientId : number,clientPhoneId : string) {   
        this.loaderService.show();
        return this.contactDataService.removeClientPhone(clientId ,clientPhoneId ).subscribe({
          next: (response) => {
            this.removeClientPhoneSubject.next(response)  
            if (response === true) { 
              const message =   'Phone Deleted Successfully' 
              this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
            }
            this.loaderService.hide();
          },
          error: (err) => {       
            this.loaderService.hide();
            this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);       
          },
        });
      }

  //#endregion client profile //NOSONAR
}
