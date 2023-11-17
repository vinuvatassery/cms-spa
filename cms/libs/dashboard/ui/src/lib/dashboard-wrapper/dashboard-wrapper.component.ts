/*
npm install angular-gridster2 --save
npm install ng-dynamic-component --save
npm install chart.js 
npm install ng2-charts --save

*/

import { Component, OnInit } from '@angular/core';
import { DashboardWrapperFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'cms-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss'],
})
export class DashboardWrapperComponent implements OnInit {
  //#region Variables
  public dashboardContentList$ =
    this.dashboardWrapperFacade.dashboardContentList$;
  public dashboardConfiguration$ =
    this.dashboardWrapperFacade.dashboardConfiguration$;

  //#endregion

  //#region constructor
  constructor(private dashboardWrapperFacade: DashboardWrapperFacade) {}
  //#endregion

  //#region Life cycle hook
  ngOnInit(): void {
    this.ConfigureDashboard();
    this.loadDashboadContent();
  }
  //#endregion

  //#region Other Methods

  ConfigureDashboard() {
    this.dashboardWrapperFacade.loadDashboardConfiguration();
  }

  loadDashboadContent() {
    this.dashboardWrapperFacade.loadDashboardContent();
  }

  //#endregion
}
