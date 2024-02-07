import { Injectable } from '@angular/core'; 
import { GridsterConfig } from 'angular-gridster2';
import { BehaviorSubject, Subject } from 'rxjs';
import { DashboardContent } from '../..';
import { DashboardWrapperService } from '../infrastructure/dashboard-wrapper.service';
import { WidgetRegistry } from 'libs/dashboard/feature-dashboard/src/lib/widget-registry';

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
  private widgetCoponentCollection = WidgetRegistry;

  constructor(private dashboardWrapperService: DashboardWrapperService) {}
  

  updateDashboardAllWidgets(dashboardId : string , dashBoardWidgetsUpdatedDto :  any) {
    this.dashboardWrapperService.updateDashboardAllWidgets(dashboardId  , dashBoardWidgetsUpdatedDto).subscribe({
      next: (result) => { 
        this.dashboardContentUpdateSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }


  loadDashboardContent(): void {
    this.dashboardWrapperService.getDashboardContent("CAREASSIST").subscribe({
      next: (dashboardList : any) => {
        
    dashboardList.forEach((widg : any) => {
           widg.widgetProperties = JSON.parse(widg.widgetProperties);
            });
        dashboardList.filter((element : any) => {
          element.widgetProperties.componentData.component = this.widgetCoponentCollection[element?.widgetProperties.componentData.component];
        });
        this.dashboardContentListSubject.next(dashboardList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  getDashboardAllWidgets(): void {
    this.dashboardWrapperService.getDashboardAllWidgets().subscribe({
      next: (dashboardList : any) => {
        
    dashboardList.forEach((widg : any) => {
      debugger
           widg.widgetProperties = JSON.parse(widg.widgetProperties);
            });
        dashboardList.filter((element : any) => {
          
          element.widgetProperties.componentData.component = this.widgetCoponentCollection[element?.widgetProperties.componentData.component];
        });
        this.dashboardAllWidgetsSubject.next(dashboardList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDashboardConfiguration(): void {
    this.dashboardWrapperService.getDashboardConfiguration().subscribe({
      next: (dashboardConfiguration) => {
        this.dashboardConfigurationSubject.next(dashboardConfiguration);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
