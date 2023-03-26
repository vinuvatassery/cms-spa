/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Contact, ContactInfo,ClientAddress } from '../entities/contact';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { ZipCodeFacade } from '@cms/system-config/domain'
import { catchError, of,Subject } from 'rxjs';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService, ConfigurationProvider } from '@cms/shared/util-core';
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
  showLoaderOnState = new BehaviorSubject<boolean>(false);
  showAddPopupSubject = new BehaviorSubject<boolean>(false);
  editAddressSubject = new BehaviorSubject<boolean>(false);
  editedAddressSubject = new Subject<any>();
  private clientEmailsSubject =  new Subject<any>();
  private clientEmailSubject =  new Subject<any>();
  private addClientEmailSubject =  new Subject<any>();
  private preferredClientEmailSubject =  new Subject<any>();
  private deactivateClientEmailSubject =  new Subject<any>();
  private removeClientEmailSubject =  new Subject<any>();
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
  showAddPopup$ = this.showAddPopupSubject.asObservable();
  editAddress$ =this.editAddressSubject.asObservable();
  editedAddress$ =this.editedAddressSubject.asObservable();
  showLoaderOnState$ = this.showLoaderOnState.asObservable();
  clientEmails$ = this.clientEmailsSubject.asObservable();
  clientEmail$ = this.clientEmailSubject.asObservable();
  addClientEmailResponse$ = this.addClientEmailSubject.asObservable();
  preferredClientEmail$ = this.preferredClientEmailSubject.asObservable();
  deactivateClientEmail$ = this.deactivateClientEmailSubject.asObservable();
  removeClientEmail$ = this.removeClientEmailSubject.asObservable();
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
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly zipCodeFacade: ZipCodeFacade,
    private configurationProvider : ConfigurationProvider 
  ) { }

  /** Public methods **/
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;    
        this.loggingService.logException(err)
      }  
        this.snackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();   
  }

  showLoader()
  {
    this.loaderService.show();
  }
    
  hideLoader()
  {
    this.loaderService.hide();
  }

  loadDdlStates(): void {
    this.zipCodeFacade.getStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
        this.showLoaderOnState.next(false);
      },
      error: (err) => {
        this.loggingService.logException(err);
        this.showLoaderOnState.next(false);
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

  createAddress(clientId: number, clientCaseEligibilityId: string, clientAddress: ClientAddress) {
    return this.contactDataService.createAddress(clientId, clientCaseEligibilityId, clientAddress);
  }

  updateAddress(clientId: number, clientCaseEligibilityId: string, clientAddress: ClientAddress) {
    return this.contactDataService.updateAddress(clientId, clientCaseEligibilityId, clientAddress);
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

  getClientAddress(clientId:any){
    this.showLoader();
    return this.contactDataService.getClientAddress(clientId).subscribe({
      next: (addressesResponse) => {
        this.hideLoader();
        this.addressesSubject.next(addressesResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      }
    });
  }

  deleteClientAddress(clientId:any,clientAddressId:any){
    return this.contactDataService.deleteClientAddress(clientId,clientAddressId);
  }

  deactivateClientAddress(clientId:any,clientAddressId:any){
    return this.contactDataService.deactivateClientAddress(clientId,clientAddressId);
  }

  //#region client email//NOSONAR
  loadClientEmails(clientCaseEligibilityId : string,skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated : boolean): void {
     
    this.contactDataService.loadClientEmails(clientCaseEligibilityId , skipcount ,maxResultCount  ,sort , sortType,showDeactivated).subscribe({
      next: (clientEmailsResponse : any) => {        
        if(clientEmailsResponse)
        { 
          const gridView = {
            data : clientEmailsResponse["items"] ,        
            total:  clientEmailsResponse["totalCount"]      
            };      
        
          this.clientEmailsSubject.next(gridView);
        
        }
       
      },
      error: (err) => {  
        const gridView = {
          data : null ,        
          total:  -1      
          };  
        this.clientPhonesSubject.next(gridView);     
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)       
      },
    });
  }

  loadClientEmail(clientId : number,clientEmailId : string,clientCaseEligibilityId : string): void {
    this.showLoader()
    this.contactDataService.loadClientEmail(clientId , clientEmailId , clientCaseEligibilityId).subscribe({
      next: (clientEmailReponse : any) => {        
        if(clientEmailReponse)
        {                  
          this.hideLoader()
          this.clientEmailSubject.next(clientEmailReponse);
        }         
      },
      error: (err) => {     
     
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }


  
  addClientEmail(emailData: any) {   
    this.showLoader()    
      return this.contactDataService.saveEmail(emailData).subscribe({
        next: (response) => {
          this.addClientEmailSubject.next(response)  
          if (response === true) { 
            this.hideLoader()
            const message =  emailData?.clientEmailId ? 'Email Data Updated Successfully' :'Email Data Added Successfully'
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
          }
      
        },
        error: (err) => {       
        
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)     
        },
      });
    }

    preferredClientEmail(clientId : number,clientEmailId : string) {   
     
      return this.contactDataService.updateClientEmailPreferred(clientId ,clientEmailId ).subscribe({
        next: (response) => {
          this.preferredClientEmailSubject.next(response)  
          if (response === true) { 
            const message =   'Email Data Updated Successfully' 
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
          }
        
        },
        error: (err) => {       
        
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
        },
      });
    }

    deactivateClientEmail(clientId : number,clientEmailId : string) {   
    
      return this.contactDataService.deactivateClientEmail(clientId ,clientEmailId ).subscribe({
        next: (response) => {
          this.deactivateClientEmailSubject.next(response)  
          if (response === true) { 
            const message =   'Email Deactivated Successfully' 
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
          }
      
        },
        error: (err) => {       
        
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
        },
      });
    }

    removeClientEmail(clientId : number,clientEmailId : string) {   
    
      return this.contactDataService.removeClientEmail(clientId ,clientEmailId ).subscribe({
        next: (response) => {
          this.removeClientEmailSubject.next(response)  
          if (response === true) { 
            const message =   'Email Deleted Successfully' 
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
          }
        
        },
        error: (err) => {       
        
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
        },
      });
    }

//#endregion client Email//NOSONAR
//#region client phone//NOSONAR
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
      const gridView = {
        data : null ,        
        total:  -1      
        };  
      this.clientPhonesSubject.next(gridView); 
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)     
    },
  });
}

loadClientPhone(clientId : number,clientPhoneId : string): void {
this.showLoader()
  this.contactDataService.loadClientPhone(clientId , clientPhoneId).subscribe({
    next: (clientPhoneReponse : any) => {        
      if(clientPhoneReponse)
      {                  
        this.hideLoader()
        this.clientPhoneSubject.next(clientPhoneReponse);
      }         
    },
    error: (err) => {     
   
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err);       
    },
  });
}



addClientPhone(phoneData: any) {   
  this.showLoader()
    return this.contactDataService.savePhone(phoneData).subscribe({
      next: (response) => {
        this.addClientPhoneSubject.next(response)  
        if (response === true) { 
          this.hideLoader()
          const message =  phoneData?.clientPhoneId ? 'Phone Data Updated Successfully' :'Phone Data Added Successfully'
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
        }
    
      },
      error: (err) => {       
      
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }

  preferredClientPhone(clientId : number,clientPhoneId : string) {   
   
    return this.contactDataService.updateClientPhonePreferred(clientId ,clientPhoneId ).subscribe({
      next: (response) => {
        this.preferredClientPhoneSubject.next(response)  
        if (response === true) { 
          const message =   'Phone Data Updated Successfully' 
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
        }
      
      },
      error: (err) => {       
      
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)        
      },
    });
  }

  deactivateClientPhone(clientId : number,clientPhoneId : string) {   
  
    return this.contactDataService.deactivateClientPhone(clientId ,clientPhoneId ).subscribe({
      next: (response) => {
        this.deactivateClientPhoneSubject.next(response)  
        if (response === true) { 
          const message =   'Phone Deactivated Successfully' 
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
        }
    
      },
      error: (err) => {       
      
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)         
      },
    });
  }

  removeClientPhone(clientId : number,clientPhoneId : string) {   
  
    return this.contactDataService.removeClientPhone(clientId ,clientPhoneId ).subscribe({
      next: (response) => {
        this.removeClientPhoneSubject.next(response)  
        if (response === true) { 
          const message =   'Phone Deleted Successfully' 
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, message);
        }
      
      },
      error: (err) => {       
      
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)     
      },
    });
  }

//#endregion client phone//NOSONAR
}
