import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseScreenTab } from '@cms/case-management/domain';
import { WidgetFacade } from '@cms/dashboard/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { UserDataService } from '@cms/system-config/domain';
import {
  LegendLabels,
  LegendLabelsContentArgs,
  LegendMarkers,
  SeriesClickEvent,
  SeriesLabelsAlignment,
  SeriesLabelsContentArgs,
} from '@progress/kendo-angular-charts';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'dashboard-widget-client-by-status',
  templateUrl: './widget-client-by-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetClientByStatusComponent implements OnInit, OnDestroy {
  activeClientsByStatus: any;
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  data = [
    { clientFullName: 'All Clients', userId: null },
    { clientFullName: 'My Clients', userId: '' },
  ];
  public labelAlign: SeriesLabelsAlignment = 'column';
  myClients: boolean = false;
  totalStatusCount: number = 0;
  selectedActiveClientByStatus: any = 'All Clients';
  @Input() isEditDashboard!: any;
  @Input() dashboardId!: any;
  @Output() removeWidget = new EventEmitter<string>();
  userId: any;
  labels: LegendLabels = {
    content: this.legendContent,
    font: "14px Neue Helvetica Roman ",
    margin: 5
  };
  markers: LegendMarkers = {
    type: 'circle',
    width: 10,
    height: 10
  }
  
  constructor(
    private widgetFacade: WidgetFacade,
    private readonly userDataService: UserDataService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {}

  removeWidgetCard() {
    this.removeWidget.emit();
  }
  ngOnInit(): void {
    this.getLoginUserId();
    this.loadActiveClients();
    this.loadActiveClientsByStatusChart(null);
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.value > 0 ? e.category : ''}`;
  }
  public legendContent(e: LegendLabelsContentArgs): string {
    return e.text + '  ' + e.value;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clientsNavigate(event: any) {
    this.loadActiveClientsByStatusChart(event);
  }
  loadActiveClientsByStatusChart(userId: any) {
    this.activeClientsByStatus = null;
    this.widgetFacade.loadActiveClientsByStatusChart(this.dashboardId, userId);
    this.widgetFacade.activeClientsByStatusChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.activeClientsByStatus = response;
            this.totalStatusCount = 0;
            this.activeClientsByStatus.chartData.series.forEach(
              (element: any) => {
                element.data.forEach((data: any) => {
                  switch (data?.category) {
                    case 'ACCEPT': {
                      data.color = '#FFD064';
                      break;
                    }
                    case 'INCOMPLETE': {
                      data.color = '#ED6363';
                      break;
                    }
                    case 'RESTRICTED': {
                      data.color = '#0063A6';
                      break;
                    }
                  }

                  this.totalStatusCount = this.totalStatusCount + data.value;
                });
              }
            );
            this.cdr.detectChanges();
          }
        },
      });
  }

  public onClick(event: SeriesClickEvent): void {
    let selectedTab =
      this.selectedActiveClientByStatus == this.userId
        ? CaseScreenTab.MY_CASES
        : CaseScreenTab.ALL;
    const query = {
      queryParams: {
        tab: selectedTab,
        casestatus: event?.dataItem?.category,
      },
    };
    this.router.navigate([`/case-management/cases/`], query);
    this.cdr.detectChanges();
  }
  loadActiveClients() {
    this.widgetFacade.loadActivebyStatusClients();
    this.widgetFacade.activeClientsOnStatus$.subscribe({
      next: (res: Array<any>) => {
        if (res) {
          res.forEach((user) => {
            this.data.push(user);
          });
          this.data[1].userId = this.userId;
        }
      },
    });
  }
  getLoginUserId() {
    this.userDataService.getProfile$.subscribe((users: any[]) => {
      if (users.length > 0) {
        this.userId = users[0]?.loginUserId;
      }
    });
  }
}
