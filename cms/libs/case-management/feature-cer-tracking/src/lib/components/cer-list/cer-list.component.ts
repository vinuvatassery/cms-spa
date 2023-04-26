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
import { CerTrackingFacade, StatusFlag } from '@cms/case-management/domain';
/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, first } from 'rxjs';
import { ColumnVisibilityChangeEvent, FilterService } from '@progress/kendo-angular-grid';
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
  @Input() sendResponse$!: Observable<any>;;
  @Output() loadCerTrackingListEvent = new EventEmitter<any>();
  @Output() loadCerTrackingDateListEvent = new EventEmitter<any>();
  @Output() sendCersEvent = new EventEmitter<any>();

  /** Public properties **/
  isOpenSendCER$ =  new BehaviorSubject<boolean>(false);;
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
  gridOptionButtonVisible$ = new BehaviorSubject<boolean>(false);
  selectedEligibilityCerId!:string;
  isPaperLessFlag!:boolean;
  clientName!:string;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  sortColumn = "Client Name";
  sortDir = "Ascending";
  columnsReordered = false;
  filteredBy = "";
  searchValue = "";
  isFiltered = false;
  public gridFilter: CompositeFilterDescriptor={logic:'and',filters:[]};
  filter! : any
  columnName!: any;
  selectedColumn!: any;

  columns : any = {
    clientFullName:"Client Name",
    dob :"Date of Birth",  
    clientOfficialIdFullName:"Official Id Full Name",
    clientInsuranceFullName:"Name on Primary Insurance Card",
    cerSentDate :"Date CER Sent",
    cerReceivedDate : "Date CER Received",
    cerCompletedDate : "Date CER Completed",
    reminderSentDate : "Reminder SentDate",
    cerResentDate : "CER Re-Sent Date",
    restrictedSentDate : "Restricted Sent Date",
    spokenLanguage : "Spoken Language" ,
    assignedCmId : "Case Manager" ,
    assignedCwId : "Case Worker" ,
    pronouns:"Pronouns",
    clientId:"Client ID",
    urn:"URN",
    preferredContact:"Preferred Contact",
    eligibilityStatus:"Current Status",
    group:"Group",
    eilgibilityStartDate:"Eligibility Start Date",
    eligibilityEndDate:"Eligibility End Date",
    email:"Email",
    phone:"Phone",
    genders:"Gender",
    homeAddress:"Home Address",
    ssn:"SSN",
    insurancePolicyId:"Insurance Policy Id",
    assignedCw:"Assigned to",
    disEnrollmentDate:"Disenrollment Date"
  }

  public gridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Re-send CER',
      click: (eligibilityCer: any): void => { 
        this.selectedEligibilityCerId = eligibilityCer?.clientCaseEligibilityCerId;
        this.isPaperLessFlag = eligibilityCer?.paperlessFlag === StatusFlag.Yes;
        this.clientName = eligibilityCer?.clientFullName;
        this.resendCer();
      },
    }
  ];

  constructor(private cdr:ChangeDetectorRef,private readonly cerTrackingFacade: CerTrackingFacade){
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
    this.isOpenSendCER$.next(false);
  }

  onOpenSendCERClicked() {
    this.isOpenSendCER$.next(true);
  }

  // updating the pagination infor based on dropdown selection
  epDateOnChange(date: any) {
    this.loader = true;
    this.selectedDate = date;
    this.loadCerTrackingList();
  }

  public dataStateChange(stateData: any): void {       
    debugger 
    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.columnName = stateFilter.field;
     
        this.filter = stateFilter.value;
     
      this.isFiltered = true;
      const filterList = []
      for(const filter of stateData.filter.filters)
      {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy =  filterList.toString();
    }
    else
    {
      this.filter = "";
      this.columnName = "";
      this.isFiltered = false
    }
    this.loader = true;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];    
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': 'Descending';
   
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
  onColumnReorder(event:any)
  {
    this.columnsReordered = true;
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

  resendCer(){
    this.isOpenSendCER$.next(true); 
    this.sendResponse$.subscribe((resp: boolean) => {
      this.isOpenSendCER$.next(!resp); 
    });
  }

  sendCer(){
    this.sendCersEvent.emit(this.selectedEligibilityCerId);
  }

  setToDefault()
  {  
    this.pageSizes = this.cerTrackingFacade.gridPageSizes;
    this.sortValue  = this.cerTrackingFacade.sortValue;
    this.sortType  = this.cerTrackingFacade.sortType;
    this.sort  = this.cerTrackingFacade.sort;
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };
    this.gridFilter = {logic:'and',filters:[]}
    this.sortColumn = this.columns[this.sort[0]?.field];
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending':  'Descending';
    
    this.filter = "";
    this.columnName = "";
    this.selectedColumn = "ALL";
    this.searchValue = "";
    this.isFiltered = false;
    this.columnsReordered = false;
    this.loadCerTrackingList();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    debugger
    this.gridFilter = filter;
  }

  groupFilterChange(value: any, filterService: FilterService): void {
    debugger
    filterService.filter({
        filters: [{
          field: "group",
          operator: "eq",
          value:value.lovTypeCode
      }],
        logic: "or"
    });
}
dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
  debugger
  filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value.lovDesc
    }],
      logic: "or"
  });
}
}
