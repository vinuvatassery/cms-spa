/** Angular **/
import { Injectable } from '@angular/core';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject, Subject } from 'rxjs';
/** Internal libraries **/
import { NavigationMenuService } from '../infrastructure/navigation-menu.data.service';
import { NavigationMenu } from '../entities/navigation-menu';

@Injectable({ providedIn: 'root' })
export class NavigationMenuFacade {
  /** Private properties **/
  private navigationMenuSubject = new BehaviorSubject<NavigationMenu[]>([]);

  /** Public properties **/
  navigationMenu$ = this.navigationMenuSubject.asObservable();

  private pcaReassignmentCountSubject = new Subject<any>()
  pcaReassignmentCount$ = this.pcaReassignmentCountSubject.asObservable();

  private pendingApprovalPaymentCountSubject = new Subject<any>();
  pendingApprovalPaymentCount$ = this.pendingApprovalPaymentCountSubject.asObservable();

  private pendingApprovalGeneralCountSubject = new Subject<any>();
  pendingApprovalGeneralCount$ = this.pendingApprovalGeneralCountSubject.asObservable();

  private pendingApprovalImportedClaimCountSubject = new Subject<any>();
  pendingApprovalImportedClaimCount$ = this.pendingApprovalImportedClaimCountSubject.asObservable();

  private directMessageCountSubject = new Subject<any>();
  directMessageCountCount$ = this.directMessageCountSubject.asObservable();

  /** constructor **/
  constructor(
    private readonly navigationMenuService: NavigationMenuService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
  ) { }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  /** Public methods **/
  getNavigationMenu() {
    this.showLoader()
    return this.navigationMenuService.getNavigationMenu().subscribe({
      next: (menuResponse) => {
        if (menuResponse) {
          menuResponse?.forEach(menu => { menu.filterText = ''; });
          this.navigationMenuSubject.next(menuResponse);
          this.hideLoader()
        }
        this.hideLoader()
      },
      error: (err: any) => {
        this.hideLoader()
        this.notificationSnackbarService.manageSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        this.loggingService.logException(err);
      },
    });
  }

  pcaReassignmentCount(){
    this.navigationMenuService.pcaReassignmentCount().subscribe({
      next:(count: any) => {
        this.pcaReassignmentCountSubject.next(count);
      },
      error: (err: any) => {
        //this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getPendingApprovalPaymentCount(data:any) {
    this.navigationMenuService.getPendingApprovalPaymentCount(data)
    .subscribe(
      {
        next: (count: any) => {
            this.pendingApprovalPaymentCountSubject.next(count);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }

  getPendingApprovalGeneralCount() {
    this.navigationMenuService.getPendingApprovalGeneralCount()
    .subscribe(
      {
        next: (count: any) => {
            this.pendingApprovalGeneralCountSubject.next(count);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }

  getPendingApprovalImportedClaimCount() {
    this.navigationMenuService.getPendingApprovalImportedClaimCount()
    .subscribe(
      {
        next: (count: any) => {
            this.pendingApprovalImportedClaimCountSubject.next(count);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
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

  getDirectMessageCount() {
    this.navigationMenuService.getDirectMessageCount()
    .subscribe(
      {
        next: (count: any) => {
            this.directMessageCountSubject.next(count);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }
}
