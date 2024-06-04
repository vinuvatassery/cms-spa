/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import { DashboardWrapperFacade, WidgetFacade } from '@cms/dashboard/domain';
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
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'dashboard-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Public properties **/
  inputs = {
    isEditDashboard: false,
    dashboardId: '00000000-0000-0000-0000-000000000000',
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

  private dashboardAllWidgetsDataSubject = new Subject<any>();
  public dashboardAllWidgetsListData$ =
    this.dashboardAllWidgetsDataSubject.asObservable();

  private dashboardContentListDataSubject = new Subject<any>();
  public dashboardContentListData$ =
    this.dashboardContentListDataSubject.asObservable();

  private userDashBoardsListDataSubject = new Subject<any>();
  public userDashBoardsListData$ =
    this.userDashBoardsListDataSubject.asObservable();
  public dashboardContentUpdate$ =
    this.dashboardWrapperFacade.dashboardContentUpdate$;
  public userDashBoardsList$ = this.dashboardWrapperFacade.userDashBoardsList$;
  static dashBoardContentData: any = [];
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
  selectedDashBoard!: string;
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
  addWidgetConfiguration: GridsterConfig;
  /** Constructor **/
  constructor(
    private authService: AuthService,
    private readonly localStorageService: LocalStorageService,
    private readonly dashboardWrapperFacade: DashboardWrapperFacade,
    private readonly cd: ChangeDetectorRef,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly widgetFacade: WidgetFacade
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
      maxItemCols: 1,
      minItemCols: 1,
      maxItemRows: 20,
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

    this.addWidgetConfiguration = {
      gridType: GridType.VerticalFixed, 
      resizable: { enabled: true },
      swap: true,
      pushItems: false,
      outerMargin: true,
      enableEmptyCellDrop: false,
      maxItemCols: 2,
      maxCols: 2,
      margin: 10,
      minItemRows: 1,
      minItemArea: 1,
      setGridSize: true,
      useBodyForBreakpoint: true,
      fixedRowHeight: 38,
      disableWindowResize: true,
      disableWarnings: true,
      scrollSpeed: 10,
      keepFixedWidthInMobile: false,
      keepFixedHeightInMobile: true,
      draggable: {
        enabled: true,
      },
    };
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.dashboardWrapperFacade.showLoader();
    this.userDashBoardLstSubscribe();
    this.initializeDashboard();
  }

  initializeDashboard() {
    this.dashBoardAllWidgetsSubscribe();
    this.ConfigureDashboard();

    if (this.selectedDashBoard) {
      this.dashBoardContentSubscribe(this.selectedDashBoard);
    } else {
      this.dashboardWrapperFacade.getLoggedinUserDashboards('CASE_MANAGEMENT');
    }
  }

  dashBoardChange(dashboard: any) {
    this.dashBoardContentSubscribe(dashboard?.dashboardId);
    this.selectedDashBoard = dashboard?.dashboardId;
    this.inputs.dashboardId = dashboard?.dashboardId;
    this.cd.detectChanges();
    this.dashboardContentListDataSubject.next(null);
  }

  userDashBoardLstSubscribe() {
    this.userDashBoardsList$
      .pipe(first((response) => response != null))
      .subscribe((response: any) => {
        this.userDashBoardsListDataSubject.next(response);
        response.forEach((board: any) => {
          if (board?.defaultFlag === 'Y') {
            this.widgetFacade.selectedDashboardId = board?.dashboardId;
            this.selectedDashBoard = board?.dashboardId;
            this.cd.detectChanges();
            this.dashBoardContentSubscribe(board?.dashboardId);
          }
        });
      });
  }

  dashBoardContentSubscribe(dashboardId: string) {
    this.dashboardWrapperFacade
      .loadDashboardContent(dashboardId)
      .pipe(first((response) => response != null))
      .subscribe((response: any) => {
        response.forEach((widg: any) => {
          widg.widgetProperties = JSON.parse(
            widg.widgetProperties.replaceAll('\\', ' ')
          );
        });
        response.filter((element: any) => {
          element.widgetProperties.componentData.component =
            this.widgetCoponentCollection[
              element?.widgetProperties.componentData.component
            ];
        });
        if (response[0]?.widgetProperties?.componentData?.component) {
          DashboardPageComponent.dashBoardContentData = [];

          response.forEach((widg: any) => {
            if (
              this.userManagementFacade.hasPermission([
                widg.widgetProperties?.componentData?.Permission_Code,
              ])
            ) {
              DashboardPageComponent.dashBoardContentData.push(widg);
            }
          });
          this.dashboardContentListDataSubject.next(
            DashboardPageComponent.dashBoardContentData
          );
          this.dashboardWrapperFacade.hideLoader();
        }
      });
    this.dashboardWrapperFacade.hideLoader();
  }

  dashBoardAllWidgetsSubscribe() {
    this.dashboardWrapperFacade
      .getDashboardAllWidgets()
      .pipe(first((response) => response != null))
      .subscribe((response: any) => {
        response.forEach((widg: any) => {
          widg.widgetProperties = JSON.parse(
            widg.widgetProperties.replaceAll('\\', ' ')
          );
        });
        response.filter((element: any) => {
          element.widgetProperties.componentData.component =
            this.widgetCoponentCollection[
              element?.widgetProperties.componentData.component
            ];
        });
        this.dashBoardAllWidgetsData = [];
        response.forEach((widg: any) => {
          if (
            this.userManagementFacade.hasPermission([
              widg?.widgetProperties?.componentData?.Permission_Code,
            ])
          ) {
            this.dashBoardAllWidgetsData.push(widg);
          }
        });
        this.dashboardAllWidgetsDataSubject.next(this.dashBoardAllWidgetsData);
      });
  }

  removeDashboardWidget(data: any) {
    alert(data);
  }
  editDashboardClicked(config: any) {
    this.configSubscriptionItems = {
      itemChangeCallback: DashboardPageComponent.itemChange,
      itemResizeCallback: this.itemResize,
      draggable: { enabled: true },
      resizable: { enabled: false },
    };
    this.isReorderEnable = true;
    this.inputs = {
      isEditDashboard: this.isReorderEnable,
      dashboardId: this.selectedDashBoard,
    };
    this.dashboardWrapperFacade.getDashboardAllWidgets();
    this.dashBoardAllWidgetsSubscribe();
    this.cd.detectChanges();
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


  processUpdatedWidgetsPostData(updatedWidgetsPostData :  any ,dashboardContentPostData :  any)
  {
    
    if (updatedWidgetsPostData[0]) {
      updatedWidgetsPostData.forEach((widg: any) => {
        if (widg[0]?.widgetProperties && widg[0]?.newItem !== true) {//NOSONAR
          widg[0].widgetProperties.componentData.component = widg[0].widgetName;
          widg[0].updated = true;
          dashboardContentPostData.push(widg[0]);
        }
      });
    }      

      return dashboardContentPostData
  }
  editDashboardCancelClicked(save: any) {
  
    this.configSubscriptionItems = {
      draggable: { enabled: false },
      resizable: { enabled: false },
    };
    this.isReorderEnable = false;
    this.inputs = {
      isEditDashboard: this.isReorderEnable,
      dashboardId: this.selectedDashBoard,
    };
    if (save === 'true' && DashboardPageComponent.dashBoardContentData) {
      let dashboardContentPostData =
        DashboardPageComponent.dashBoardContentData;
      let updatedWidgetsPostData = DashboardPageComponent.updatedWidgets;
      dashboardContentPostData.forEach((widg: any) => {
        if (widg?.widgetProperties) {
          widg.updated = false;
        }
      });

      dashboardContentPostData =  this.processUpdatedWidgetsPostData(updatedWidgetsPostData ,dashboardContentPostData)
      

      dashboardContentPostData.forEach((widg: any) => {
        if (widg?.widgetProperties && widg?.stringified !== true) {
          widg.widgetProperties.componentData.component = widg?.widgetName;
          widg.stringified = true;
          widg.widgetProperties = JSON.stringify(widg?.widgetProperties).trim();
        }
      });
      const dashBoardWidgetsUpdated = {
        dashBoardWidgetsUpdated: dashboardContentPostData,
      };

      this.dashboardWrapperFacade.updateDashboardAllWidgets(
        this.selectedDashBoard,
        dashBoardWidgetsUpdated
      );
      DashboardPageComponent.dashBoardContentData = [];
      DashboardPageComponent.updatedWidgets = [];
      this.dashboardContentListDataSubject.next(null);
      this.dashBoardUpdateSubscribe();
    } else {
      this.initializeDashboard();
    }

   
  }

  dashBoardUpdateSubscribe() {
    this.dashboardWrapperFacade.showLoader();
    this.dashboardContentUpdate$.subscribe((response) => {
      if (response === true) {
        this.initializeDashboard();
      }
    });
  }

  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) {
  
    const dashBoardData = DashboardPageComponent.dashBoardContentData;
    let changedWidget = dashBoardData.filter(
      (x: any) => x.widgetProperties.componentData['id'] == item['id']
    );
    DashboardPageComponent.updatedWidgets.forEach((widg: any) => {
      if (widg[0]?.widgetProperties?.componentData.id == item['id']) {
        DashboardPageComponent.updatedWidgets.splice(widg, 1);
      }
    });
    if (changedWidget[0]?.widgetId) {
      DashboardPageComponent.updatedWidgets.push(changedWidget);
    }
  }

  itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) {
    
    const dashBoardData = DashboardPageComponent.dashBoardContentData;
    let changedWidget = dashBoardData.filter(
      (x: any) => x.widgetProperties.componentData['id'] == item['id']
    );
    DashboardPageComponent.updatedWidgets.forEach((widg: any) => {
      if (widg[0]?.widgetProperties?.componentData?.id == item['id']) {
        DashboardPageComponent.updatedWidgets.splice(widg, 1);
      }
    });

    if (changedWidget[0]?.widgetId) {
      DashboardPageComponent.updatedWidgets.push(changedWidget);
    }
  }



  removeItem(item: any) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(item: any) {
    item.newItem = true;
    DashboardPageComponent.dashBoardContentData.push(item);

    this.dashBoardAllWidgetsData = this.dashBoardAllWidgetsData.filter(
      (x: any) => (x.widgetId !== item.widgetId)
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
        (x: any) => (x.widgetId !== item.widgetId)
      );

    this.dashboardContentListDataSubject.next(
      DashboardPageComponent.dashBoardContentData
    );

    this.dashboardAllWidgetsDataSubject.next(this.dashBoardAllWidgetsData);
  }
}
