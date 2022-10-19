/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    private readonly localStorageService: LocalStorageService
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
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
