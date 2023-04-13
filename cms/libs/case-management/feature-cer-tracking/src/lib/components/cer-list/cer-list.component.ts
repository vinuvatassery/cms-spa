/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
import { ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'case-management-cer-list',
  templateUrl: './cer-list.component.html',
  styleUrls: ['./cer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerListComponent implements OnInit, OnChanges {
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() cerTrackingData$: any;
  @Input() cerTrackingDates$ : any
  @Input() cerTrackingCount$ : any;
  @Output() loadCerTrackingListEvent = new EventEmitter<any>();
  @Output() loadCerTrackingDateListEvent = new EventEmitter<any>();

  /** Public properties **/
  isOpenSendCER = false;
  todayDate = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public isGridLoaderShow = false;
  selectedDate! : any;
  loader= false;
  datesSubject = new Subject<any>();
  cerTrackingDatesList$ = this.datesSubject.asObservable();
  loadDefSelectedateSubject = new Subject<any>();
  loadDefSelectedate$ = this.loadDefSelectedateSubject.asObservable();
  gridCERDataSubject = new Subject<any>();
  gridCERData$ = this.gridCERDataSubject.asObservable();
  public state!: State;
  dateDropdownDisabled= false
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Send CER Reminders',
      // icon: "done",
      click: (): void => {},
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Send Restricted Notices',
      // icon: "edit",
      click: (): void => {},
    },
  ];

  constructor(private cdr:ChangeDetectorRef){
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.dateDropdownDisabled = true
    this.loader = true;
    this.loadcerTrackingDates();

  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }
  /** Private methods **/
  private loadcerTrackingDates() {
    this.loadCerTrackingDateListEvent.emit();
    this.loadCerTrackingDateListHandle()
  }

  /** Internal event methods **/
  onCloseSendCERClicked() {
    this.isOpenSendCER = false;
  }

  onOpenSendCERClicked() {
    this.isOpenSendCER = true;
  }

  // updating the pagination infor based on dropdown selection
  epDateOnChange(date: any) {
    this.loader = true;
    this.selectedDate = date;
    this.loadCerTrackingList();
  }

  public dataStateChange(stateData: any): void {
    this.loader = true;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadCerTrackingList();
  }
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadCerTrackingList();
  }

  private loadCerTrackingList(): void {
    this.dateDropdownDisabled = true
    this.loaCerData(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType
    );

  }

  loaCerData(
    skipcountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      trackingDate: this.selectedDate,
      skipCount: skipcountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadCerTrackingListEvent.next(gridDataRefinerValue);
    this.gridDataHandle()
  }

  loadCerTrackingDateListHandle() {

    this.cerTrackingDates$
      ?.pipe(
        first((trackingDateList: any) => trackingDateList?.seletedDate != null)
      )
      .subscribe((trackingDateList: any) => {
        if (trackingDateList?.seletedDate) {
          this.loadDefSelectedateSubject.next(trackingDateList?.seletedDate);
          this.datesSubject.next(trackingDateList?.datesList);
          this.selectedDate = trackingDateList?.seletedDate;
          this.epDateOnChange(this.selectedDate);
        }
      });
  }

  gridDataHandle() {
    this.cerTrackingData$.subscribe((data: any) => {
      this.gridCERDataSubject.next(data);
      if (data?.total >= 0 || data?.total === -1) {
        this.loader = false;
        this.dateDropdownDisabled = false
      }
    });
  }

  public columnChange(e: ColumnVisibilityChangeEvent) {
    this.cdr.detectChanges()
  }
}
