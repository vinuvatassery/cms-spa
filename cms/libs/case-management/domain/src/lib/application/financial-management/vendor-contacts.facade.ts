/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { catchError,of, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { VendorContactsDataService } from '../../infrastructure/financial-management/vendor-contacts.data.service';
/** Providers **/
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class VendorContactsFacade {
  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'contactName';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [
    {
      field: this.sortValue,
    },
  ];

  /** Private properties **/
  private contactsDataSubject = new BehaviorSubject<any>([]);
  private contactsSubject = new BehaviorSubject<any>([]);
  private allContactsSubject = new BehaviorSubject<any>([]);
  private deActiveContactAddressSubject = new BehaviorSubject<boolean>(false);
  private removeContactAddressSubject = new BehaviorSubject<boolean>(false);
  private mailCodeSubject = new Subject<any>();

  /** Public properties **/
  contactsData$ = this.contactsDataSubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  allContacts$ = this.allContactsSubject.asObservable();

  deActiveContactAddressObs = this.deActiveContactAddressSubject.asObservable();
  removeContactAddressObs = this.removeContactAddressSubject.asObservable();
  mailCodes$ = this.mailCodeSubject.asObservable();

  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();

  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  errorShowHideSnackBar(subtitle: any) {
    this.notificationSnackbarService.manageSnackBar(
      SnackBarNotificationType.ERROR,
      subtitle,
      NotificationSource.UI
    );
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  /** Constructor**/
  constructor(
    public vendorcontactsDataService: VendorContactsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  /** Public methods **/
  loadContactsListGrid() {
    this.vendorcontactsDataService.loadContactsListService().subscribe({
      next: (dataResponse) => {
        this.contactsDataSubject.next(dataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  loadcontacts(vendorAddressId:string, skip: any, pageSize: any, sortBy: any, sortType: any, filters:any)
  {
   return  this.vendorcontactsDataService.loadcontacts(vendorAddressId,skip,pageSize, sortBy, sortType, filters)
  }

  

  saveContactAddress(contactAddress: any) {

    this.showLoader();
    return this.vendorcontactsDataService.saveContactAddress(contactAddress).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
          this.hideLoader();
        }
        return of(false);
      })
    );
  }
  deactiveContactAddress(vendorContactId: string){
    return new Promise((resolve,reject) =>{
      this.loaderService.show();
      this.vendorcontactsDataService.deactiveContactAddress(vendorContactId).subscribe({
       next: (response:any) => {
         if(response){
          this.deActiveContactAddressSubject.next(true);
          resolve(true);
          this.loaderService.hide();
         }
         this.loaderService.hide();
         this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Contact  De-Activated Successfully');
       },
       error: (err) => {
        resolve(false);
         this.loaderService.hide();
         this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
         this.loggingService.logException(err);
       },
     });
    })

  }

  removeContactAddress( vendorContactId: string) {
    return new Promise((resolve,reject) =>{
      this.loaderService.show();
      return this.vendorcontactsDataService.removeContactAddress(vendorContactId).subscribe({
        next: (response) => {
          if (response === true) {
            this.removeContactAddressSubject.next(true);
            resolve(true);
            this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Contact Removed Successfully');
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
        error: (err) => {
          resolve(false);
          this.removeContactAddressSubject.next(false);
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
    })

  }
  updateContactAddress(contact:any){
    this.loaderService.show();
    return this.vendorcontactsDataService.updateContactAddress(contact).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loaderService.hide();
          this.loggingService.logException(err);
        }
        return of(false);
      })
    );
   }

   getContactAddress(vendorContactId: string){
    return this.vendorcontactsDataService.getContactAddress(vendorContactId);
   }

   loadMailCodes(vendorId: string): void {
    this.showLoader();
    this.vendorcontactsDataService.loadVendorMailCodes(vendorId).subscribe({
      next: (reponse: any) => {
        if (reponse) {
          this.hideLoader();
          this.mailCodeSubject.next(reponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadVendorAllContacts(vendorId:string)
  {
    this.showLoader();
    this.vendorcontactsDataService.loadVendorAllContacts(vendorId).subscribe({
      next:(res:any)=>{
      this.allContactsSubject.next(res);
      this.hideLoader();
      },
      error:(err:any)=>{
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
     this.hideLoader();
      }
    })
  }
}

