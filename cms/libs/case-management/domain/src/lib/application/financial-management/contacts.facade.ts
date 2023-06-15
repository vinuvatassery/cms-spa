/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { catchError,Observable,of, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ContactsDataService } from '../../infrastructure/financial-management/contacts.data.service';
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
export class ContactsFacade {
  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'address1';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [
    {
      field: this.sortValue,
    },
  ];

  /** Private properties **/
  private contactsDataSubject = new BehaviorSubject<any>([]);
  private contactsSubject = new BehaviorSubject<any>([]);
  private deActiveContactAddressSubject = new BehaviorSubject<boolean>(false);
  private removeContactAddressSubject = new BehaviorSubject<boolean>(false);
  /** Public properties **/
  contactsData$ = this.contactsDataSubject.asObservable();
  
  contacts$ = this.contactsSubject.asObservable();
  deActiveContactAddressObs = this.deActiveContactAddressSubject.asObservable();
  removeContactAddressObs = this.removeContactAddressSubject.asObservable();
  
  
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
    public contactsDataService: ContactsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  /** Public methods **/
  loadContactsListGrid() {
    this.contactsDataService.loadContactsListService().subscribe({
      next: (dataResponse) => {
        this.contactsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  loadcontacts(mailcode:string)
  {
    this.showLoader();
    this.contactsDataService.loadcontacts(mailcode).subscribe({
      next:(res:any)=>{
      this.contactsSubject.next(res);
      this.hideLoader();
      },
      error:(err:any)=>{
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
     this.hideLoader(); 
      }
    })
  }
  saveContactAddress(contactAddress: any) {  

     
    return this.contactsDataService.saveContactAddress(contactAddress).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
        }
        return of(false);
      })
    );
  }
  deactiveContactAddress(vendorContactId: string){ 
    return new Promise((resolve,reject) =>{
      this.loaderService.show();
      this.contactsDataService.deactiveContactAddress(vendorContactId).subscribe({
       next: (response:any) => {
         if(response){
          this.deActiveContactAddressSubject.next(true);
          resolve(true);
         }
         this.loaderService.hide();
         this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, ' Address De-Activated Successfully');
         this.loadcontacts('CO1');
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
      return this.contactsDataService.removeContactAddress(vendorContactId).subscribe({
        next: (response) => {
          if (response === true) {
            this.removeContactAddressSubject.next(true);
            resolve(true);
            this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Address Removed Successfully');
            this.loadcontacts('CO1');
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
}

