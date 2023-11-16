/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'; 
/** Facades **/
import { DashboardFacade, DashboardWrapperFacade } from '@cms/dashboard/domain';
/** Services **/
import { LocalStorageService } from '@cms/shared/util-core';
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { TileLayoutReorderEvent } from "@progress/kendo-angular-layout";
import { TileLayoutResizeEvent } from "@progress/kendo-angular-layout";

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
  dashboard$ = this.dashboardFacade.dashboard$;
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
    private readonly dashboardFacade: DashboardFacade,
    private readonly localStorageService: LocalStorageService, 
    private readonly dashboardWrapperFacade: DashboardWrapperFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() { 
    this.loadDashboard();
    this.ConfigureDashboard();
    this.loadDashboadContent();
  }
  editDashboardClicked(){
    this.isReorderEnable = true;
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

  public onReorder(e: TileLayoutReorderEvent): void {
    this.log(e, "reorder");
  }

  public onResize(e: TileLayoutResizeEvent): void {
    this.log(e, "resize");
  }

  private log(
    event: TileLayoutReorderEvent | TileLayoutResizeEvent,
    eventName: string
  ): void {
 
 
    this.events.unshift(`${eventName}: ${JSON.stringify(event)}`);
  }
  /** Private methods **/
  private loadDashboard(): void {
    this.dashboardFacade.loadDashboard();
  }

  /** Public methods **/
  testLocalStorageService() {
    this.localStorageService.setItem('test', 'test');
  }


  public clientByStatus = [
    {
      kind: "ACCEPT",
      share: 70,
    },
    {
      kind: "PENDING",
      share: 5,
    },
    {
      kind: "WAITLIST",
      share: 8,
    },
    {
      kind: "RESTRICTED",
      share: 17,
    }, 
  ];
  
  public clientByGroup = [
    {
      kind: "UPP",
      share: 50,
    },
    {
      kind: "GROUP I",
      share: 5,
    },
    {
      kind: "GROUP II",
      share: 7,
    },
    {
      kind: "BRIDGE",
      share: 9,
    },
    {
      kind: "GROUP I / INS GAP",
      share: 10,
    },
    {
      kind: "GROUP II / INS GAP",
      share: 11,
    },
  ];
  
  public pharmacyClaims = [
    {
      kind: "FULL PAY",
      share: 68,
    },
    {
      kind: "REGULAR PAY",
      share: 32,
    }, 
  ];
 
  
}
