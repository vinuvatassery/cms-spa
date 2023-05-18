/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import { CaseFacade,CaseScreenTab, CaseStatusCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { Observable } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';
import { FilterService, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import {ConfigurationProvider} from '@cms/shared/util-core';
import { Router } from '@angular/router';


@Component({
  selector: 'case-management-case-list',
  templateUrl: './case-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseListComponent implements OnInit, OnChanges {

public isGridLoaderShow = true;
@Input() searchLoaderVisibility$!: Observable<boolean>;
sortColumn = "";
sortDir = "";
columnsReordered = false;
filteredBy = "";
searchValue = "";
isFiltered = false;

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
    clientId:"Client ID",
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
  columnDroplist : any = {
    ALL: "ALL",
    SSN:"ssn",
    HA:"homeAddress",
    P:"phone",
    URN:"urn",
    NOIC:"insuranceFullName",
    E:"email",
    CN:"clientFullName",
    IPI:"insurancePolicyId",
    NOOI:"officialIdFullName",
    CI:"clientId"
  }
  columnName!: any;

  /** Public properties **/
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  ddlGridColumns$ = this.caseFacade.ddlGridColumns$;
  groupLov$ = this.lovFacade.groupLov$;
  caseStatusType$ = this.lovFacade.caseStatusType$;
  selectedColumn!: any;
  filter! : any
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() loadCasesListEvent = new EventEmitter<any>();
  groupData:any=[]
  caseStatusTypes:any=[];
  caseStatusCodes:any=["CANCELED","REVIEW","NEW"];
  public gridFilter: CompositeFilterDescriptor={logic:'and',filters:[]};
  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade,private readonly lovFacade: LovFacade, public intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider, private cdr :ChangeDetectorRef,
    private readonly router: Router
    ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlGridColumns();
    this.lovFacade.getGroupLovs();
    this.lovFacade.getCaseStatusLovs();
    this.getCaseStatusLovs();
    this.selectedColumn = 'ALL';
    this.getGroupLovs() ;
  }

  public get tabOptions(): typeof CaseScreenTab {
    return CaseScreenTab; 
  }

  private getGroupLovs() {
    this.groupLov$
    .subscribe({
      next: (data: any) => {
        this.groupData=data;
      }
    });
  }
  private getCaseStatusLovs() {
    this.caseStatusType$
    .subscribe({
      next: (data: any) => {
        data=data.filter((item:any) => !this.caseStatusCodes.includes(item.lovCode));
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.caseStatusTypes=data.sort((value1:any,value2:any) => value1.sequenceNbr - value2.sequenceNbr);
      }
    });
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };
      this.sortColumn = this.columns[this.sort[0]?.field];
      if(this.sort[0]?.dir === 'asc') {
        this.sortDir = 'Ascending';
      }
      if(this.sort[0]?.dir === 'desc') {
        this.sortDir = 'Descending';
      }
      if(!this.selectedColumn)
      {
        this.selectedColumn = "";
        this.columnName = "";
        this.filter = "";
      }
    this.loadProfileCasesList()
  }
 filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }
 groupFilterChange(value: any, filterService: FilterService): void {
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
  filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value.lovDesc
    }],
      logic: "or"
  });
}

 pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadProfileCasesList()
  }
  public dataStateChange(stateData: any): void {
    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.columnName = stateFilter.field;
      if(this.columnName === 'eilgibilityStartDate' || this.columnName === 'eligibilityEndDate')
      {
        let date = this.intl.formatDate(stateFilter.value, this.dateFormat);
        this.filter = date;
      }
      else
      {
        this.filter = stateFilter.value;
      }
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
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? ""
    this.sortType = stateData.sort[0]?.dir ?? ""
    this.state=stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': "";
    this.sortDir = this.sort[0]?.dir === 'desc'? 'Descending': "";
    this.loadProfileCasesList();
}
  private loadProfileCasesList(): void {
    this.loadCases(this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType, this.columnName,this.filter)
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
    this.state.skip = 0;
    this.state.take = this.pageSizes[0]?.value;
    this.columnName = this.columnDroplist[this.selectedColumn];
    this.filter = event;
    this.loadProfileCasesList();
  }
  setToDefault()
  {
    this.pageSizes = this.caseFacade.gridPageSizes;
    this.sortValue  = this.caseFacade.sortValue;
    this.sortType  = this.caseFacade.sortType;
    this.sort  = this.caseFacade.sort;
    if (this.selectedTab == 1)
    {
      this.sort = [];
      this.sortType = "";
      this.sortValue = "";
    }
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };
    this.gridFilter = {logic:'and',filters:[]}
    this.sortColumn = this.columns[this.sort[0]?.field];
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': "";
    this.sortDir = this.sort[0]?.dir === 'desc'? 'Descending': "";
    this.filter = "";
    this.columnName = "";
    this.selectedColumn = "ALL";
    this.searchValue = "";
    this.isFiltered = false;
    this.columnsReordered = false;
    this.loadProfileCasesList();
  }
  onColumnReorder(event:any)
  {
    this.columnsReordered = true;
  }

  public columnChange(e: ColumnVisibilityChangeEvent) {
    this.cdr.detectChanges()
  }

  onCaseClicked(session: any) {  
    if (session && session?.caseStatus !==CaseStatusCode.incomplete) {
      this.router.navigate([`/case-management/cases/case360/${session?.clientId}`]);     
    }    
    else {
      this.router.navigate(['case-management/case-detail'], {
        queryParams: {
          sid: session?.sessionId,
          eid: session?.entityId,
          wtc: WorkflowTypeCode.NewCase
        }
      });
    }
  }
}
