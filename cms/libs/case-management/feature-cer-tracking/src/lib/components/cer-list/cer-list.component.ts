/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
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
 // @Input() cerTrackingDatesList$: any;
  //@Input() selectedDate: any;
  @Output() loadCerTrackingListEvent = new EventEmitter<any>();
  @Output() loadCerTrackingDateListEvent = new EventEmitter<any>();

  /** Public properties **/
  isOpenSendCER = false;
  todayDate = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public isGridLoaderShow = false;
  selectedDate! : any;

  datesSubject = new Subject<any>();
  cerTrackingDatesList$ = this.datesSubject.asObservable();

  loadDefSelectedateSubject = new Subject<any>();
  loadDefSelectedate$ = this.loadDefSelectedateSubject.asObservable();
  public state!: State;
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

  /** Constructor**/
  constructor() {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
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
    this.selectedDate = date;
    this.loadCerTrackingList();
  }

  public dataStateChange(stateData: any): void {
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
}
