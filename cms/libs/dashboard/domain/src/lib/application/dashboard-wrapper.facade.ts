import { Injectable } from '@angular/core'; 
import { GridsterConfig } from 'angular-gridster2';
import { BehaviorSubject, Subject } from 'rxjs';
import { DashboardContent } from '../..';
import { DashboardWrapperService } from '../infrastructure/dashboard-wrapper.service';
//import { WidgetRegistry } from 'libs/dashboard/feature-dashboard/src/lib/widget-registry';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DashboardWrapperFacade {

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

  updateDashboardAllWidgets(dashboardId : string , dashBoardWidgetsUpdatedDto :  any) {
    this.loaderService.show();
    this.dashboardWrapperService.updateDashboardAllWidgets(dashboardId  , dashBoardWidgetsUpdatedDto).subscribe({
      next: (result) => { 
        this.dashboardContentUpdateSubject.next(result);
        this.showSnackBar(SnackBarNotificationType.SUCCESS, 'Dashboard Updated')
        this.loaderService.hide();
      },
       
      error: (error) => { 
        this.loaderService.hide();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }


  loadDashboardContent(): void {
    this.dashboardWrapperService.getDashboardContent("CAREASSIST")
    .subscribe({
      next: (dashboardList : any) => {
        debugger
    dashboardList.forEach((widg : any) => {
      
           widg.widgetProperties = JSON.parse(widg.widgetProperties.replaceAll('\\',' '));
            });
        // dashboardList.filter((element : any) => {
          
        //   element.widgetProperties.componentData.component = this.widgetCoponentCollection[element?.widgetProperties.componentData.component];
        // });
        this.dashboardContentListSubject.next(dashboardList);
      },
      error: (error) => {
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  getDashboardAllWidgets(): void {
    this.dashboardWrapperService.getDashboardAllWidgets().subscribe({
      next: (dashboardList : any) => {
        
    dashboardList.forEach((widg : any) => {
      
           widg.widgetProperties = JSON.parse(widg.widgetProperties.replaceAll('\\',' '));
            });
        // dashboardList.filter((element : any) => {
          
        //   element.widgetProperties.componentData.component = this.widgetCoponentCollection[element?.widgetProperties.componentData.component];
        // });
        this.dashboardAllWidgetsSubject.next(dashboardList);
      },
      error: (error) => {
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
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
