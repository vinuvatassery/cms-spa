/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter } from '@angular/core'; 
/** Facades **/
import {  DashboardWrapperFacade } from '@cms/dashboard/domain';
/** Services **/
import { LocalStorageService } from '@cms/shared/util-core';
import { AuthService } from '@cms/shared/util-oidc';
import {  DisplayGrid, 
  GridsterConfig,
  GridsterItem, 
  GridsterItemComponentInterface, 
  GridType } from 'angular-gridster2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'dashboard-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  inputs = {
    isEditDashboard: false, 
  };
  outputs = {
    removeWidget: (type: any) => this.removeDashboardWidget(type),
  };
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
  @Output() itemChanged : EventEmitter<GridsterItem>= new EventEmitter();
  @Output() itemResized : EventEmitter<GridsterItem>= new EventEmitter();
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  /** Constructor **/
  constructor(
    private authService: AuthService, 
    private readonly localStorageService: LocalStorageService, 
    private readonly dashboardWrapperFacade: DashboardWrapperFacade
  ) {
    this.loadConfigSubscription();
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      minCols: 1,
      maxCols: 2,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 2,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1, 
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 10, y: 0, x: 2 },
      { cols: 1, rows: 1, y: 0, x: 4 },
      { cols: 2, rows: 2, y: 1, x: 4 },
      { cols: 1, rows: 1, y: 4, x: 5 },
      { cols: 1, rows: 1, y: 2, x: 1 },
      { cols: 2, rows: 2, y: 5, x: 5 },
      { cols: 2, rows: 2, y: 3, x: 2 },
      { cols: 2, rows: 1, y: 2, x: 2 },
      { cols: 1, rows: 1, y: 3, x: 4 },
      { cols: 1, rows: 1, y: 0, x: 6 }
    ];
    
  }

  /** Lifecycle hooks **/
  ngOnInit() { 
    
    this.ConfigureDashboard();
    this.loadDashboadContent();
   
  }
 
  removeDashboardWidget(data:any){
    alert(data);
  }
  editDashboardClicked(config: any){
    this.configSubscriptionItems = {
      itemChangeCallback: DashboardPageComponent.itemChange,
      itemResizeCallback: this.itemResize,  
      draggable: { enabled: true },
      resizable: { enabled: true },
    }
    this.isReorderEnable = true;
    this.inputs = {
      isEditDashboard: this.isReorderEnable, 
    };
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
    this.inputs = {
      isEditDashboard: this.isReorderEnable, 
    };
  }

  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) {
    debugger
    console.info('itemChanged', item, itemComponent);
  }

    itemResize(item: GridsterItem,
      itemComponent: GridsterItemComponentInterface) {
    
    console.info('itemResized', item, itemComponent);
  }

  changedOptions() {
    debugger
  }

  removeItem(item : any) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(item : any)
  {
 const  data = {
      id: 1,
      cols: 2,
      rows: 3,
      x: 0,
      y: 0,
      component: item,
      isVisible: true,
    }
    debugger
    this.dashboard.push(data)
  }
  
}
