/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CaseFacade, SearchHeaderType } from '@cms/case-management/domain';
/** Facades **/
import { DashboardFacade } from '@cms/dashboard/domain';
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
  dashboard$ = this.dashboardFacade.dashboard$;
  public events: string[] = [];
  isReorderEnable = false;
  /** Constructor **/
  constructor(
    private readonly dashboardFacade: DashboardFacade,
    private readonly localStorageService: LocalStorageService,
    private readonly caseFacade: CaseFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseFacade.enableSearchHeader(SearchHeaderType.CaseSearch);
    this.loadDashboard();
  }
  editDashboardClicked(){
    this.isReorderEnable = true;
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
      kind: "Hydroelectric",
      share: 0.175,
    },
    {
      kind: "Nuclear",
      share: 0.238,
    },
    {
      kind: "Coal",
      share: 0.118,
    },
    {
      kind: "Solar",
      share: 0.052,
    },
    {
      kind: "Wind",
      share: 0.225,
    },
    {
      kind: "Other",
      share: 0.192,
    },
  ];
  public pharmacyClaimsLabelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  } 
}
