/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'; 
/** Facades **/
import {  DashboardWrapperFacade } from '@cms/dashboard/domain';
/** Services **/
import { LocalStorageService } from '@cms/shared/util-core';
import { AuthService } from '@cms/shared/util-oidc';
@Component({
  selector: 'dashboard-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  /** Public properties **/
    //#region Variables
 public dashboardContentList$ =  this.dashboardWrapperFacade.dashboardContentList$;
  public dashboardConfiguration$ =  this.dashboardWrapperFacade.dashboardConfiguration$;

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
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() { 
    
    this.ConfigureDashboard();
    this.loadDashboadContent();
  }
  editDashboardClicked(){
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

  editDashboardCancelClicked(){
    this.isReorderEnable = false;
  }
  
}
