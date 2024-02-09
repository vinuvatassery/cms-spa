/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
/** Facades **/
import { DashboardWrapperFacade } from '@cms/dashboard/domain';
/** Services **/
import { LocalStorageService } from '@cms/shared/util-core';
import { AuthService } from '@cms/shared/util-oidc';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType,
} from 'angular-gridster2';
import { first, Subject, Subscription } from 'rxjs';
import { WidgetRegistry } from '../../widget-registry';
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
  public dashboardContentList$ =
    this.dashboardWrapperFacade.dashboardContentList$;
  public dashboardAllWidgets$ =
    this.dashboardWrapperFacade.dashboardAllWidgets$;
  public dashboardConfiguration$ =
    this.dashboardWrapperFacade.dashboardConfiguration$;

  private dashboardContentListDataSubject = new Subject<any>();
  public dashboardContentListData$ =
    this.dashboardContentListDataSubject.asObservable();

  private dashboardAllWidgetsDataSubject = new Subject<any>();
  public dashboardAllWidgetsListData$ =
    this.dashboardAllWidgetsDataSubject.asObservable();
  public dashboardContentUpdate$ = this.dashboardWrapperFacade.dashboardContentUpdate$
  static dashBoardContentData: any;
  dashBoardAllWidgetsData!: any;
  configSubscription!: Subscription;
  dashBoardContentSubscription!: Subscription;
  dashBoardAllWidgetsSubscription!: Subscription;
  configSubscriptionItems: GridsterConfig = [];
  private widgetCoponentCollection = WidgetRegistry;
  allWidgetsconfigSubscriptionItems: GridsterConfig = {
    itemChangeCallback: DashboardPageComponent.itemChange,
    itemResizeCallback: this.itemResize,
    draggable: { enabled: false },
    resizable: { enabled: false },
  };
  dashBoardSubscriptionItems: any;
  //#endregion
  static updatedWidgets: any = [];
  public events: string[] = [];
  isReorderEnable = false;
  public areaList: Array<string> = [
    'ORHIVE Case Worker Dashboard',
    'ORHIVE Admin Dashboard',
    'ORHIVE Manager Dashboard',
    'ORHIVE Client Details Dashboard',
  ];
  public selectedValue = 'ORHIVE Case Worker Dashboard';
  @Output() itemChanged: EventEmitter<GridsterItem> = new EventEmitter();
  @Output() itemResized: EventEmitter<GridsterItem> = new EventEmitter();
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
        enabled: true,
      },
      resizable: {
        enabled: true,
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
      { cols: 1, rows: 1, y: 0, x: 6 },
    ];
  }

  /** Lifecycle hooks **/
  ngOnInit() {
   this.initializeDashboard()
  }

  initializeDashboard()
  {
    this.dashboardWrapperFacade.getDashboardAllWidgets();
    this.dashBoardAllWidgetsSubscribe();
    this.ConfigureDashboard();
    this.loadDashboadContent();
    this.dashBoardContentSubscribe();
  }

  dashBoardContentSubscribe() {
    this.dashBoardContentSubscription = this.dashboardContentList$
    .pipe(first(response => response != null)).subscribe(
      (response) => {
        response.filter((element : any) => {
          
          element.widgetProperties.componentData.component = this.widgetCoponentCollection[element?.widgetProperties.componentData.component];
        });
        if(response[0].widgetProperties.componentData.component)
        {
        DashboardPageComponent.dashBoardContentData = response;
        
        this.dashboardContentListDataSubject.next(response);
        }
      }
    );
  }

  dashBoardAllWidgetsSubscribe() {
    this.dashBoardAllWidgetsSubscription = this.dashboardAllWidgets$
    .pipe(first(response => response != null))
    .subscribe(
      (response) => {
        response.filter((element : any) => {
          
          element.widgetProperties.componentData.component = this.widgetCoponentCollection[element?.widgetProperties.componentData.component];
        });
        this.dashBoardAllWidgetsData = response;
        ;
        this.dashboardAllWidgetsDataSubject.next(response);
      }
    );
  }

  removeDashboardWidget(data: any) {
    alert(data);
  }
  editDashboardClicked(config: any) {
    this.configSubscriptionItems = {
      itemChangeCallback: DashboardPageComponent.itemChange,
      itemResizeCallback: this.itemResize,
      draggable: { enabled: true },
      resizable: { enabled: true },
    };
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
    this.configSubscription = this.dashboardConfiguration$.subscribe(
      (response) => {
        this.configSubscriptionItems = response;
      }
    );
  }
  editDashboardCancelClicked(save : any) {
    this.configSubscriptionItems = {
      draggable: { enabled: false },
      resizable: { enabled: false },
    };
    this.isReorderEnable = false;
    this.inputs = {
      isEditDashboard: this.isReorderEnable,
    };
    if(save === 'true')
    {
          let dashboardContentPostData = DashboardPageComponent.dashBoardContentData
          let updatedWidgetsPostData = DashboardPageComponent.updatedWidgets
          dashboardContentPostData.forEach((widg: any) =>
          {
            if(widg?.widgetProperties)
            {      
            widg.updated = false;    
          
            }
          });

          updatedWidgetsPostData.forEach((widg: any) =>
          {
            
            if(widg[0]?.widgetProperties && widg[0]?.newItem !== true)
            {
              
            widg[0].widgetProperties.componentData.component =    widg[0].widgetName;
            widg[0].updated = true;
            dashboardContentPostData.push(widg[0])
            }
          });
          
          dashboardContentPostData.forEach((widg: any) =>
          {
            if(widg?.widgetProperties && widg?.stringified!== true)
            {  
              widg.widgetProperties.componentData.component =    widg?.widgetName;
              widg.stringified = true  
            widg.widgetProperties = JSON.stringify(widg?.widgetProperties).trim()     
            
            }
          });
        const dashBoardWidgetsUpdated ={
          dashBoardWidgetsUpdated : dashboardContentPostData
        }
        this.dashboardWrapperFacade.updateDashboardAllWidgets('E2301551-610C-43BF-B7C9-9B623ED425C3' , dashBoardWidgetsUpdated)
        DashboardPageComponent.dashBoardContentData =[]
        DashboardPageComponent.updatedWidgets = []
        this.dashBoardUpdateSubscribe()
   }  
    
  }

  dashBoardUpdateSubscribe() {
   this.dashboardContentUpdate$.subscribe(
      (response) => {     
        if(response === true)
        {  
        this.initializeDashboard()
        }
      }
    );
  }

  static itemChange(    item: GridsterItem,    itemComponent: GridsterItemComponentInterface  ) {
    
    const dashBoardData = DashboardPageComponent.dashBoardContentData;
    let changedWidget = dashBoardData.filter(
      (x: any) => x.widgetProperties.componentData['id'] == item['id']
    );
    DashboardPageComponent.updatedWidgets.forEach((widg: any) => {
      if (widg[0]?.widgetProperties?.componentData.id == item['id']) {
        DashboardPageComponent.updatedWidgets.splice(widg, 1);
      }
    });
   if(changedWidget[0]?.widgetId)
   {
    DashboardPageComponent.updatedWidgets.push(changedWidget);
   }
  }

  itemResize(    item: GridsterItem,    itemComponent: GridsterItemComponentInterface  ) {
    
    const dashBoardData = DashboardPageComponent.dashBoardContentData;
    let changedWidget = dashBoardData.filter(
      (x: any) => x.widgetProperties.componentData['id'] == item['id']
    );
    DashboardPageComponent.updatedWidgets.forEach((widg: any) => {
      if (widg[0]?.widgetProperties?.componentData?.id == item['id']) {
        DashboardPageComponent.updatedWidgets.splice(widg, 1);
      }
    });
  
    if(changedWidget[0]?.widgetId)
    {
     DashboardPageComponent.updatedWidgets.push(changedWidget);
    }
  }

  changedOptions() {}

  removeItem(item: any) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(item: any) {
    
    item.newItem = true;
    DashboardPageComponent.dashBoardContentData.push(item);

    this.dashBoardAllWidgetsData = this.dashBoardAllWidgetsData.filter(
      (x: any) => !(x.widgetId == item.widgetId)
    );

    this.dashboardContentListDataSubject.next(
      DashboardPageComponent.dashBoardContentData
    );

    this.dashboardAllWidgetsDataSubject.next(this.dashBoardAllWidgetsData);
  }

  removeWidget(item: any) {
    this.dashBoardAllWidgetsData.push(item);

    DashboardPageComponent.dashBoardContentData =
      DashboardPageComponent.dashBoardContentData.filter(
        (x: any) => !(x.widgetId == item.widgetId)
      );

    this.dashboardContentListDataSubject.next(
      DashboardPageComponent.dashBoardContentData
    );

    this.dashboardAllWidgetsDataSubject.next(this.dashBoardAllWidgetsData);
  }
}
