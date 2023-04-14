/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-cer-tracking-page',
  templateUrl: './cer-tracking-page.component.html',
  styleUrls: ['./cer-tracking-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerTrackingPageComponent implements OnInit {
  /** Public properties **/
  cer$ = this.cerTrackingFacade.cer$;
  pageSizes = this.cerTrackingFacade.gridPageSizes;
  sortValue = this.cerTrackingFacade.sortValue;
  sortType = this.cerTrackingFacade.sortType;
  sort = this.cerTrackingFacade.sort;
  cerTrackingData$ = this.cerTrackingFacade.cerTrackingList$;
  cerTrackingDates$ = this.cerTrackingFacade.cerTrackingDates$;
  cerTrackingCount$ = this.cerTrackingFacade.cerTrackingCount$;
  sendResponse$ = this.cerTrackingFacade.sendResponse$;

  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadCer();
  }

  /** Private methods **/
  private loadCer(): void {
    this.cerTrackingFacade.loadCer();
  }

  loadCerTrackingDateListHandle() {
    this.cerTrackingFacade.getCerTrackingDatesList();
  }

  loadCerTrackingDataHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      trackingDate: gridDataRefinerValue.trackingDate,
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };

    this.pageSizes = this.cerTrackingFacade.gridPageSizes;
    this.cerTrackingFacade.getCerTrackingList(
      gridDataRefiner.trackingDate,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType
    );

    this.cerTrackingFacade.getCerTrackingDateCounts(gridDataRefiner.trackingDate);
  }

  sendCerCount(cerId: any){
    this.cerTrackingFacade.sendCerCount(cerId);
  }
}
