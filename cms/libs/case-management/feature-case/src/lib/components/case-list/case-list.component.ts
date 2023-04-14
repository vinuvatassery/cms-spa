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
import { CaseFacade,CaseScreenTab } from '@cms/case-management/domain';
import { Observable } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';
import { FilterService, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import {ConfigurationProvider, LocalStorageService} from '@cms/shared/util-core';
import { LocalStorageKeys } from '@cms/shared/ui-common';


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

public state!: any;
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
  constructor(private readonly caseFacade: CaseFacade,private readonly lovFacade: LovFacade, public readonly  intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider, private readonly  cdr :ChangeDetectorRef,
    private readonly localStorageService: LocalStorageService
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
    if (this.selectedTab == 1)
    {
      this.sort = [];
      this.sortType = "";
      this.sortValue = "";
    }
    this.state=this.getGridState();
    if (Object.keys(this.state).length === 0) {
      this.defaultGridState();
    }
    
      this.sortColumn = this.columns[this.sort[0]?.field];
      this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': "";
      this.sortDir = this.sort[0]?.dir === 'desc'? 'Descending': "";
      if(!this.selectedColumn)
      {
        this.selectedColumn = "";
        this.columnName = "";
        this.filter = "";
      }
    this.loadProfileCasesList()
  }
  defaultGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters:{logic:'and',filters:[]}
      };
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
    this.state=stateData;
    this.saveGridState();
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
      this.filteredBy = this.columns[this.columnName];
      this.isFiltered = true;
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
  private saveGridState(){
    this.localStorageService.setItem(this.selectedTab+'_'+LocalStorageKeys.GridState, JSON.stringify(this.state));
  }
  private getGridState(){
   return JSON.parse(this.localStorageService.getItem(this.selectedTab+'_'+LocalStorageKeys.GridState) || '{}');
  }
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
    this.saveGridState();
    this.loadProfileCasesList();
  }
  onColumnReorder(event:any)
  {
    this.columnsReordered = true;
  }

  public columnChange(e: ColumnVisibilityChangeEvent) {
    this.cdr.detectChanges()
  }
}
