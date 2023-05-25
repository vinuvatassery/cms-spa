/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CaseFacade, SearchHeaderType } from '@cms/case-management/domain';
/** Facades **/
import { DashboardFacade } from '@cms/dashboard/domain';
/** Services **/
import { LocalStorageService } from '@cms/shared/util-core';

@Component({
  selector: 'dashboard-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  /** Public properties **/
  dashboard$ = this.dashboardFacade.dashboard$;

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

  /** Private methods **/
  private loadDashboard(): void {
    this.dashboardFacade.loadDashboard();
  }

  /** Public methods **/
  testLocalStorageService() {
    this.localStorageService.setItem('test', 'test');
  }
}
