import { Injectable } from '@angular/core'; 
import { GridsterConfig } from 'angular-gridster2';
import { BehaviorSubject, Subject } from 'rxjs';
import { DashboardWrapperService } from '../infrastructure/dashboard-wrapper.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DashboardWrapperFacade {

  private userDashBoardsSubject = new Subject<any>();
  public userDashBoardsList$ =  this.userDashBoardsSubject.asObservable();
  private dashboardContentUpdateSubject = new Subject<any>();
  private dashboardContentListSubject = new Subject<any>();
  private dashboardAllWidgetsSubject = new Subject<any>();
  public dashboardContentList$ =  this.dashboardContentListSubject.asObservable();
  public dashboardAllWidgets$ =  this.dashboardAllWidgetsSubject.asObservable();
  public dashboardContentUpdate$ =  this.dashboardContentUpdateSubject.asObservable();

  private dashboardConfigurationSubject = new BehaviorSubject<GridsterConfig>(
    {}
  );
  public dashboardConfiguration$ =
    this.dashboardConfigurationSubject.asObservable();
  //private widgetCoponentCollection = WidgetRegistry;

  constructor(private dashboardWrapperService: DashboardWrapperService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService) {}
  showSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
        const err = subtitle;
        this.loggingService.logException(err)
    }
    this.snackbarService.manageSnackBar(type, subtitle);
}

showLoader(){  this.loaderService.show();}
hideLoader() { this.loaderService.hide();}

getLoggedinUserDashboards(typeCode :  string) {
    this.dashboardWrapperService.getLoggedinUserDashboards(typeCode).subscribe({
      next: (result) => { 
        this.userDashBoardsSubject.next(result);      
        
      },       
      error: (error) => { 
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  updateDashboardAllWidgets(dashboardId : string , dashBoardWidgetsUpdatedDto :  any) {
    this.showLoader();
    this.dashboardWrapperService.updateDashboardAllWidgets(dashboardId  , dashBoardWidgetsUpdatedDto).subscribe({
      next: (result) => { 
        this.dashboardContentUpdateSubject.next(result);
        this.showSnackBar(SnackBarNotificationType.SUCCESS, 'Dashboard Updated')
        this.hideLoader();
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }


  loadDashboardContent(dashboardId : string) {
   return  this.dashboardWrapperService.getDashboardContent(dashboardId) 
  }

  getDashboardAllWidgets() {
    return this.dashboardWrapperService.getDashboardAllWidgets()
  }

  loadDashboardConfiguration(): void {
    this.dashboardWrapperService.getDashboardConfiguration().subscribe({
      next: (dashboardConfiguration) => {
        this.dashboardConfigurationSubject.next(dashboardConfiguration);
      },
      error: (error) => {
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
}
