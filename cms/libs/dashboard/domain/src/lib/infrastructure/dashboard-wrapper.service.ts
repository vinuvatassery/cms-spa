import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridsterConfig, GridType } from 'angular-gridster2';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardWrapperService {
  constructor(
    private http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) {}

  options!: GridsterConfig;

  getLoggedinUserDashboards(typeCode: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/user-dashboards/${typeCode}`
    );
  }

  updateDashboardAllWidgets(
    dashboardId: string,
    dashBoardWidgetsUpdatedDto: any
  ) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/${dashboardId}/widgets`,
      dashBoardWidgetsUpdatedDto
    );
  }

  getDashboardAllWidgets() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/all-widgets`
    );
  }
  getDashboardContent(dashboardId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/${dashboardId}`
    );
    
  }

  getDashboardConfiguration(): Observable<GridsterConfig> {
    return of({
      gridType: GridType.VerticalFixed,
      resizable: { enabled: false },
      swap: true,
      pushItems: false,
      outerMargin: true,
      enableEmptyCellDrop: false,
      maxItemCols: 2,
      maxCols: 2,
      margin: 20,
      minItemRows: 1,
      minItemArea: 1,
      setGridSize: true,
      useBodyForBreakpoint: false,
      fixedRowHeight: 38,
      disableWindowResize: false,
      disableWarnings: true,
      scrollSpeed: 10,
      keepFixedWidthInMobile: false,
      keepFixedHeightInMobile: true,
      useTransformPositioning: true,
      mobileBreakpoint: 900,
      draggable: {
        enabled: false,
        ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
        dragHandleClass: 'drag-handle', // drag event only from this class. If `ignoreContent` is true.
        ignoreContentClass: 'no-drag',
      },
    });
  }
}
