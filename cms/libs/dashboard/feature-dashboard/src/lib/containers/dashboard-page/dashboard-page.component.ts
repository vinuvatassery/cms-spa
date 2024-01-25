/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core'; 
/** Facades **/
import {  DashboardWrapperFacade } from '@cms/dashboard/domain';
/** Services **/
import { LocalStorageService } from '@cms/shared/util-core';
import { AuthService } from '@cms/shared/util-oidc';
import { GridsterConfig } from 'angular-gridster2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'dashboard-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
    //#region Variables
 public dashboardContentList$ =  this.dashboardWrapperFacade.dashboardContentList$;
  public dashboardConfiguration$ =  this.dashboardWrapperFacade.dashboardConfiguration$;
  configSubscription!: Subscription;
  configSubscriptionItems: GridsterConfig = [];
  //#endregion 
  public events: string[] = [];
  isReorderEnable = false;
  public areaList: Array<string> = [
    "ORHIVE Case Worker Dashboard",
    "ORHIVE Admin Dashboard",
    "ORHIVE Manager Dashboard",
    "ORHIVE Client Details Dashboard",
  ];
  public selectedValue = "ORHIVE Case Worker Dashboard";
  /** Constructor **/
  constructor(
    private authService: AuthService, 
    private readonly localStorageService: LocalStorageService, 
    private readonly dashboardWrapperFacade: DashboardWrapperFacade
  ) {
    this.loadConfigSubscription();
  }

  /** Lifecycle hooks **/
  ngOnInit() { 
    
    this.ConfigureDashboard();
    this.loadDashboadContent();
    
  }
 
  editDashboardClicked(config: any){
    this.configSubscriptionItems = {
      draggable: { enabled: true },
      resizable: { enabled: true },
    }
    this.isReorderEnable = true;
  }
  user() {
    return this.authService.getUser();
  }
  onGetUser() {
    return this.authService.getUser();
  }
  //#region Other Methods

  ConfigureDashboard() {
    this.dashboardWrapperFacade.loadDashboardConfiguration();
  }

  loadDashboadContent() {
    this.dashboardWrapperFacade.loadDashboardContent();
  }
  ngOnDestroy() { 
    this.configSubscription.unsubscribe();
  }
  private loadConfigSubscription() {
    this.configSubscription = this.dashboardConfiguration$.subscribe((response) => {
      this.configSubscriptionItems = response;
       
    });
  }
  editDashboardCancelClicked(){ 
    this.configSubscriptionItems = {
      draggable: { enabled: false },
      resizable: { enabled: false },
    }
    this.isReorderEnable = false;
  }
  
}
