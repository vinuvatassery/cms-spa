import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { 
  GridsterConfig,
  GridType,
} from 'angular-gridster2';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardWrapperService {
  constructor(private http: HttpClient  ,private configurationProvider: ConfigurationProvider) {}

  options!: GridsterConfig;

  getLoggedinUserDashboards(typeCode :  string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/user-dashboards/${typeCode}`
    );
    }

  updateDashboardAllWidgets(dashboardId : string , dashBoardWidgetsUpdatedDto :  any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/${dashboardId}/widgets`,dashBoardWidgetsUpdatedDto
    );
    }

  getDashboardAllWidgets() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/all-widgets`
    );
    }
  getDashboardContent(dashboardId : string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/${dashboardId}`
    );
    // return of([
    //   {
    //     id: 1,
    //     cols: 2,
    //     rows: 3,
    //     x: 0,
    //     y: 0,
    //     component: 'TodayAtAGlance',
    //     isVisible: true,
    //   },
    //   {
    //     id: 2,
    //     cols: 1,
    //     rows: 9,
    //     x: 1,
    //     y: 1,
    //     component: 'ApplicationsCers',
    //     isVisible: true,
    //   },
    //   {
    //     id: 3,
    //     cols: 1,
    //     rows: 9,
    //     x: 2,
    //     y: 1,
    //     component: 'RecentlyViewed',
    //     isVisible: true,
    //   },
    //   {
    //     id: 4,
    //     cols: 1,
    //     rows: 7,
    //     x: 0,
    //     y: 3,
    //     component: 'InsuranceTypeFpl',
    //     isVisible: true,
    //   },
    //   {
    //     id: 5,
    //     cols: 1,
    //     rows: 7,
    //     x: 0,
    //     y: 3,
    //     component: 'QuickLinks',
    //     isVisible: true,
    //   },
    //   {
    //     id: 6,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 4,
    //     component: 'ClientByStatus',
    //     isVisible: true,
    //   },

    //   {
    //     id: 7,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 4,
    //     component: 'ActiveClientsByGroup',
    //     isVisible: true,
    //   },
    //   {
    //     id: 8,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 5,
    //     component: 'ProgramIncome',
    //     isVisible: true,
    //   },
    //   {
    //     id: 4,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 5,
    //     component: 'ProgramExpenses',
    //     isVisible: true,
    //   },
    //   {
    //     id: 9,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 6,
    //     component: 'NetIncome',
    //     isVisible: true,
    //   },
    //   {
    //     id: 10,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 7,
    //     component: 'PharmacyClaims',
    //     isVisible: true,
    //   },
    //   {
    //     id: 11,
    //     cols: 1,
    //     rows: 9,
    //     x: 0,
    //     y: 7,
    //     component: 'PremiumExpensesByInsuranceType',
    //     isVisible: true,
    //   },

    //   {
    //     id: 12,
    //     cols: 1,
    //     rows: 6,
    //     x: 0,
    //     y: 8,
    //     component: 'SlotsAllocation',
    //     isVisible: true,
    //   },

    //   {
    //     id: 13,
    //     cols: 1,
    //     rows: 8,
    //     x: 0,
    //     y: 9,
    //     component: 'ServiceTracking',
    //     isVisible: true,
    //   },
    //   {
    //     id: 14,
    //     cols: 1,
    //     rows: 3,
    //     x: 0,
    //     y: 8,
    //     component: 'Liheap',
    //     isVisible: true,
    //   },

    //   {
    //     id: 15,
    //     cols: 1,
    //     rows: 3,
    //     x: 0,
    //     y: 8,
    //     component: 'RentOverages',
    //     isVisible: true,
    //   }, 
    // ]);
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
      margin:20,
      minItemRows: 1,
      minItemArea: 1,    
      setGridSize: true,
      useBodyForBreakpoint: true,
      fixedRowHeight: 38,
      disableWindowResize: false,
      disableWarnings: true,
      scrollSpeed: 10, 
      keepFixedWidthInMobile: false,
      keepFixedHeightInMobile: true,
      draggable: {
        enabled: false,
        ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
        dragHandleClass: 'drag-handle', // drag event only from this class. If `ignoreContent` is true.       
				ignoreContentClass: "no-drag",
      },
    });
  }
}