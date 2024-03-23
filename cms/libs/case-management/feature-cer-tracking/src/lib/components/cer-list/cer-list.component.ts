/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { CerTrackingFacade } from '@cms/case-management/domain';
/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State ,} from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, first } from 'rxjs';
import { ColumnVisibilityChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { StatusFlag } from '@cms/shared/ui-common';
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
  @Input() sendResponse$!: Observable<any>;
  @Input() gridState$! : any
  @Input() caseStatus: string = '';
  @Output() loadCerTrackingListEvent = new EventEmitter<any>();
  @Output() loadCerTrackingDateListEvent = new EventEmitter<any>();
  @Output() sendCersEvent = new EventEmitter<any>();
  @Output() goToCerEvent = new EventEmitter<any>();
  @Output() saveCersStateEvent = new EventEmitter<any>();

  /** Public properties **/
  isOpenSendCER$ =  new BehaviorSubject<boolean>(false);;
  todayDate = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public isGridLoaderShow = false;
  selectedDate!: any;
  loader = false;
  datesSubject = new Subject<any>();
  titleSubject = new Subject<string>();
  cerTrackingDatesList$ = this.datesSubject.asObservable();
  loadDefSelectedateSubject = new Subject<any>();
  loadDefSelectedate$ = this.loadDefSelectedateSubject.asObservable();
  title$ = this.titleSubject.asObservable();
  gridCERDataSubject = new Subject<any>();
  gridCERData$ = this.gridCERDataSubject.asObservable();
  public state!: any;
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
  statusTitle ="Current Status"
  addRemoveColumns="Default Columns"
  gridDataResult! : GridDataResult

  filterData : CompositeFilterDescriptor={logic:'and',filters:[]};

  columns : any = {
    clientFullName:"Client Name",
    cerSentDate :"Date CER Sent",
    cerReceivedDate : "Date CER Received",
    cerCompletedDate : "Date CER Completed",
    reminderSentDate : "Reminder Sent Date",
    cerResentDate : "CER Re-Sent Date",
    restrictedSentDate : "Restricted Sent Date",
    assignedCmId : "Case Manager" ,
    assignedCwId : "Case Worker" ,
    clientId:"Client ID",
    eligibilityStatus:"Current Status",
    insurancePolicyId:"Insurance Policy Id",
    caseWorkerName:"Case Worker",
    caseManagerName:"Case Manager",
    disEnrollmentDate:"Disenrollment Date",
    caseManagerDomain: "Case Manager Domain",
    sexes: "Sex"
  }

  eligibilityStatus = [
    'ACCEPT',
    'DISENROLLED',
    'RESTRICTED'
  ];

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
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Go to CER',
      click: (eligibilityCer: any): void => {
        this.goToCerEvent.emit(eligibilityCer?.clientCaseEligibilityId);
      },
    }
  ];

  constructor(private cdr:ChangeDetectorRef,private readonly cerTrackingFacade: CerTrackingFacade){

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.dateDropdownDisabled = false
    this.loader = true;
  }
  ngOnChanges(): void {


   if(this.gridState$)
   {
    this.state = this.gridState$
    this.dataStateChange(this.state);
   }
   else
   {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter:{logic:'and',filters:[]},
    };
    this.loadcerTrackingDates();
   }
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
    this.state.skip = 0;   
    this.loadCerTrackingList();
  }

  setTitle(data : any)
  {
    this.statusTitle = data?.isHistorical === StatusFlag.Yes ?  'Status @ End of EP' : 'Current Status'
    this.titleSubject.next(this.statusTitle)
  }
  public dataStateChange(stateData: any): void {
    // if (this.caseStatus != '') {
    //   this.state?.filter?.filters?.push(
    //     {
    //       field: "eligibilityStatus",
    //       operator: "eq",
    //       value:this.caseStatus
    //     });
    // }
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
    this.loader = true;
    this.state.take = data.value;
    this.loadCerTrackingList();
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value
      }],
        logic: "or"
    });
  }

  private loadCerTrackingList(): void {
    this.dateDropdownDisabled = false
    this.loadCerData(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType
    );

  }

  loadCerData(
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
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    if(this.selectedDate)
    {
    this.loadCerTrackingListEvent.next(gridDataRefinerValue);
    this.saveCersStateEvent.emit(this.state)
    }
    this.gridDataHandle()
  }
  onColumnReorder(event:any)
  {
    this.columnsReordered = true;
  }
  loadCerTrackingDateListHandle() {

    this.cerTrackingDates$
      ?.pipe(
        first((trackingDateList: any) => trackingDateList != null)
      )
      .subscribe((trackingDateList: any) => {
        if (trackingDateList?.seletedDate) {
          this.loadDefSelectedateSubject.next(trackingDateList?.seletedDate);
          this.datesSubject.next(trackingDateList?.datesList);
          this.selectedDate = trackingDateList?.seletedDate;
          this.epDateOnChange(this.selectedDate);
        }
        else
        {
          this.titleSubject.next(this.statusTitle)
          this.datesSubject.next(trackingDateList?.datesList);
          this.loadDefSelectedateSubject.next(null);
          this.loader = false;
          this.dateDropdownDisabled = false
        }
      });
  }

  gridDataHandle() {
    this.cerTrackingData$.subscribe((data: GridDataResult) => {
    this.statusTitle = data?.data[0]?.isHistorical === StatusFlag.Yes ?  'Status @ End of EP' : 'Current Status'
    this.titleSubject.next(this.statusTitle)
    this.gridDataResult = data
    for (const res in this.gridDataResult?.data) {

      this.validateDates(res)

      if(this.gridDataResult?.data[res].cerResentDate)
      {
      this.gridDataResult.data[res].cerResentDate = new Date(this.gridDataResult?.data[res].cerResentDate)
      }

      if(this.gridDataResult?.data[res].restrictedSentDate)
      {
      this.gridDataResult.data[res].restrictedSentDate = new Date(this.gridDataResult?.data[res].restrictedSentDate)
      }

      if(this.gridDataResult?.data[res].disEnrollmentDate)
      {
      this.gridDataResult.data[res].disEnrollmentDate = new Date(this.gridDataResult?.data[res].disEnrollmentDate)
      }

      if(this.gridDataResult?.data[res].eilgibilityStartDate)
      {
      this.gridDataResult.data[res].eilgibilityStartDate = new Date(this.gridDataResult?.data[res].eilgibilityStartDate)
      }

      if(this.gridDataResult?.data[res].eligibilityEndDate)
      {
      this.gridDataResult.data[res].eligibilityEndDate = new Date(this.gridDataResult?.data[res].eligibilityEndDate)
      }
    }
    //this.gridDataResult.data = filterBy(this.gridDataResult.data, this.filterData)
    this.gridCERDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.loader = false;
        this.dateDropdownDisabled = false
      }
    });
  }

 private validateDates( res :  any)
 {
  if(this.gridDataResult?.data[res].dob)
  {
  this.gridDataResult.data[res].dob = new Date(this.gridDataResult?.data[res].dob)
  }
  if(this.gridDataResult?.data[res].cerSentDate)
  {
  this.gridDataResult.data[res].cerSentDate = new Date(this.gridDataResult?.data[res].cerSentDate)
  }

  if(this.gridDataResult?.data[res].cerReceivedDate)
  {
  this.gridDataResult.data[res].cerReceivedDate = new Date(this.gridDataResult?.data[res].cerReceivedDate)
  }

  if(this.gridDataResult?.data[res].cerCompletedDate)
  {
  this.gridDataResult.data[res].cerCompletedDate = new Date(this.gridDataResult?.data[res].cerCompletedDate)
  }

  if(this.gridDataResult?.data[res].reminderSentDate)
  {
  this.gridDataResult.data[res].reminderSentDate = new Date(this.gridDataResult?.data[res].reminderSentDate)
  }
 }

 public filterChange(filter: CompositeFilterDescriptor): void {
  this.filterData = filter;

  //this.gridDataResult.data = filterBy(this.gridDataResult.data, filter)
  this.gridCERDataSubject.next(this.gridDataResult);
 }
  public columnChange(e: ColumnVisibilityChangeEvent) {
    const columnsRemoved = e?.columns.filter(x=> x.hidden).length
    const columnsAdded = e?.columns.filter(x=> x.hidden === false).length

    this.addRemoveColumns =''
    if(columnsAdded > 0)
    {
      this.addRemoveColumns = "Columns Added"
    }

    if(columnsRemoved > 0)
    {
      this.addRemoveColumns += " Columns Removed"
    }
    if(columnsAdded == 0 && columnsRemoved == 0)
    {
      this.addRemoveColumns = "Default Columns"
    }
    this.cdr.detectChanges()
  }

  resendCer(){
    this.isOpenSendCER$.next(true);
    this.sendResponse$.subscribe((resp: boolean) => {
      this.isOpenSendCER$.next(!resp);
    });
  }

  sendCer(cerId:string){
    this.loader = true;
    const gridDataRefinerValue = {
      trackingDate: this.selectedDate,
      skipCount: this.state.skip ?? 0,
      pagesize: this.state.take ?? 0,
      sortColumn:  this.sortValue,
      sortType: this.sortType,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };

    this.sendCersEvent.emit({cerId: cerId, gridDataRefinerValue: gridDataRefinerValue});
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
    this.loader = true;
    this.filterData = {logic:'and',filters:[]}
    this.loadCerTrackingList();
  }

  public getGridCellColor(eligibilityStatus: string) {
    let result;
    switch (eligibilityStatus) {
      case "RESTRICTED":
        result = "#FFEDC4";
        break;
      default:
        result = "transparent";
        break;
    }
    return result;
  }

}
