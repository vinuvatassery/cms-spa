/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
/** Facades **/
import { CaseFacade, CaseScreenTab } from '@cms/case-management/domain';
import { Observable } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'case-management-case-list',
  templateUrl: './case-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseListComponent implements OnInit, OnChanges {

public isGridLoaderShow = true;
@Input() searchLoaderVisibility$!: Observable<boolean>;
sortColumn = "Client Name";
sortDir = "Ascending";
columnsReordered = false;

public state!: State;
  /*** Input properties ***/
  @Input() cases: any;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() columnDroplist$ : any;
  @Input() selectedTab: CaseScreenTab = 0;
  columns : any = {
    clientFullName:"Client Name",
    officialIdFullName:"Name on Official ID",
    insuranceFullName:"Name on Primary Insurance Card",
    pronouns:"Pronouns",
    clientId:"ID",
    urn:"URN",
    preferredContact:"Preferred Contact",
    caseStatus:"Status",
    group:"Group",
    eilgibilityStartDate:"Eligibility Start Date",
    eligibilityEndDate:"Eligibility End Date",
    email:"Email",
    phone:"Phone",
    genders:"Gender",
    homeAddress:"Home Address",
    ssn:"SSN",
    insurancePolicyId:"Insurance Policy Id",
    assignedCw:"Assigned to"
  }

  /** Public properties **/
  ddlGridColumns$ = this.caseFacade.ddlGridColumns$;
  selectedColumn!: any;
  filter! : any
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() loadCasesListEvent = new EventEmitter<any>();

  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlGridColumns();
    this.selectedColumn = 'ALL';
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };
    if(!this.selectedColumn)
    {
      this.selectedColumn = "";
      this.filter = "";
    }
    this.loadProfileCasesList()

  }

  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadProfileCasesList()
  }
  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? 'clientFullName'
    this.sortType = stateData.sort[0]?.dir ?? 'asc'
    this.state=stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = stateData.sort[0]?.dir === 'asc'? 'Ascending': stateData.sort[0]?.dir === 'desc'? 'Descending': "";
    this.loadProfileCasesList();
}
  private loadProfileCasesList(): void {
    this.loadCases(this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType, this.selectedColumn,this.filter)
  }
   loadCases(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string, columnName : any, filter : any)
   {
     const gridDataRefinerValue =
     {
       skipCount: skipcountValue,
       pagesize : maxResultCountValue,
       sortColumn : sortValue,
       sortType : sortTypeValue,
       columnName : columnName,
       filter : filter
     }
     this.loadCasesListEvent.next(gridDataRefinerValue)
   }

  /** Private methods **/
  private loadDdlGridColumns() {
    this.caseFacade.loadDdlGridColumns();
    this.searchLoaderVisibility$.subscribe((data : any) => {
      this.isGridLoaderShow = data;
    });

  }

  onChange(event :any)
  {
    this.filter = event;
    this.loadProfileCasesList();
  }
  setToDefault()
  {
    //this.grid.reorderColumn([]);
    this.pageSizes = this.caseFacade.gridPageSizes;
    this.sortValue  = this.caseFacade.sortValue;
    this.sortType  = this.caseFacade.sortType;
    this.sort  = this.caseFacade.sort;
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };
    this.sortColumn = this.columns[this.sort[0]?.field];
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': this.sort[0]?.dir === 'desc'? 'Descending': "";
    this.loadProfileCasesList();
  }
  onColumnReorder(event:any)
  {
    this.columnsReordered = true;
  }
  // onColumnMenuSelect(event : any)
  // {
  //   debugger;
  // }
}
