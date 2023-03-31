/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';
import { Subject, first } from 'rxjs';

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

  // datesSubject = new Subject<any>();
  // cerTrackingDatesList$ = this.datesSubject.asObservable();

  // loadDefSelectedateSubject = new Subject<any>();
  // loadDefSelectedate$ = this.loadDefSelectedateSubject.asObservable();
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

    // this.cerTrackingDates$
    //   ?.pipe(
    //     first(
    //       (trackingDateList: any) => trackingDateList?.seletedDate != null
    //     )
    //   )
    //   .subscribe((trackingDateList: any) => {
    //     if (trackingDateList?.seletedDate) {
    //       this.loadDefSelectedateSubject.next(trackingDateList?.seletedDate);
    //       this.datesSubject.next(trackingDateList?.datesList);
    //     }
    //   });
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
  }
}
