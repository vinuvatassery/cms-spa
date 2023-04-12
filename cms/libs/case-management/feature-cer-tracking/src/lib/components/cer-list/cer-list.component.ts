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
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { State } from '@progress/kendo-data-query';
import { BehaviorSubject, Subject, first } from 'rxjs';
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
  @Input() cerTrackingDates$: any
  @Input() cerTrackingCount$: any;
  @Input() sendCerCount$: any;
  @Output() loadCerTrackingListEvent = new EventEmitter<any>();
  @Output() loadCerTrackingDateListEvent = new EventEmitter<any>();
  @Output() loadSendCerCountEvent = new EventEmitter<any>();
  @Output() sendCersEvent = new EventEmitter<any>();
  // @Output() SendCerRemainderEvent = new EventEmitter<any>();
  // @Output() loadCerTrackingDateListEvent = new EventEmitter<any>();

  /** Public properties **/
  isOpenSendCER = false;
  todayDate = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public isGridLoaderShow = false;
  selectedDate!: any;
  loader = false;
  datesSubject = new Subject<any>();
  cerTrackingDatesList$ = this.datesSubject.asObservable();
  loadDefSelectedateSubject = new Subject<any>();
  loadDefSelectedate$ = this.loadDefSelectedateSubject.asObservable();
  gridCERDataSubject = new Subject<any>();
  gridCERData$ = this.gridCERDataSubject.asObservable();
  public state!: State;
  dateDropdownDisabled = false;
  cerActionButtonType$ = new BehaviorSubject<string>('NONE');
  // isSendButtonVisible:boolean = null;
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public bulkActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Send CER Reminders',
      // icon: "done",
      click: (): void => { },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Send Restricted Notices',
      // icon: "edit",
      click: (): void => { },
    },
  ];

  public gridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Send CER Reminders',
      // icon: "done",
      click: (): void => { },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Send Restricted Notices',
      // icon: "edit",
      click: (): void => { },
    },
  ];

  /* Constructor */
  constructor(private readonly intl: IntlService, 
    private readonly configProvider: ConfigurationProvider,){    
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
    this.loadSendCerCountEvent.emit(this.selectedDate);
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

  private setCerActionButtonVisibility(data: any){
    if(data?.total > 0){
      const isCerSendAlready = data?.data.findIndex((i:any) => i.cerSentDate !== null) !== -1;
      if(isCerSendAlready){
        this.cerActionButtonType$.next('BULK');
        return;
      }
      if(new Date(this.selectedDate) < new Date()){
        this.cerActionButtonType$.next('SEND');
        return;
      }     
    }    

    this.cerActionButtonType$.next('NONE');    
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
      this.setCerActionButtonVisibility(data);
      if (data?.total >= 0 || data?.total === -1) {
        this.loader = false;
        this.dateDropdownDisabled = false
      }
    });
  }

  sendCer(){
    const date = this.intl.formatDate(new Date(this.selectedDate), this.configProvider.appSettings.dateFormat)
    this.sendCersEvent.emit(date);
  }

  cancelSendCer(){
    this.isOpenSendCER = false;
  }
}
