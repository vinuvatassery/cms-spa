/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import { CaseFacade,CaseScreenTab, CaseStatusCode, WorkflowTypeCode, GridFacade, GridStateKey } from '@cms/case-management/domain';
import { Observable, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade, UserDataService } from '@cms/system-config/domain';
import { FilterService, ColumnVisibilityChangeEvent, ColumnComponent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import {ConfigurationProvider} from '@cms/shared/util-core';
import { Router } from '@angular/router';


@Component({
  selector: 'case-management-case-list',
  templateUrl: './case-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseListComponent implements OnInit {

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
  @Input() module: string = '';
  @Input() parentModule: string = '';
  addRemoveColumns="Default Columns"
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
  columnName: any = "";

  /** Public properties **/
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  ddlGridColumns$ = this.caseFacade.ddlGridColumns$;
  groupLov$ = this.lovFacade.groupLov$;
  caseStatusType$ = this.lovFacade.caseStatusType$;
  selectedColumn!: any;
  filter : any = "";
  afterDate: any;
  beforeDate: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() loadCasesListEvent = new EventEmitter<any>();
  groupData:any=[]
  caseStatusTypes:any=[];
  caseStatusCodes:any=["CANCELED","REVIEW","NEW"];
  public gridFilter: CompositeFilterDescriptor={logic:'and',filters:[]};
  private userProfileSubsriction !: Subscription;
  loginUserId!:any;
  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade,private readonly lovFacade: LovFacade, public readonly  intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider, private readonly  cdr :ChangeDetectorRef,
    private readonly router: Router,
    private readonly gridFacade: GridFacade,
    private readonly userDataService: UserDataService
    ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.defaultGridState();
    this.loadDdlGridColumns();
    this.lovFacade.getGroupLovs();
    this.lovFacade.getCaseStatusLovs();
    this.getCaseStatusLovs();
    this.selectedColumn = 'ALL';
    this.getGroupLovs() ;
    this.getLoggedInUserProfile();
  }
  ngOnDestroy(): void {
    this.userProfileSubsriction.unsubscribe();
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
  defaultGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters:{logic:'and',filters:[]},
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: ''
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
    this.saveGridState();
    this.loadProfileCasesList()
  }
  public dataStateChange(stateData: any): void {
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
      this.isFiltered =true;
      this.filteredBy =  filterList.toString();
    }
    else
    {
      this.filter = "";
      this.columnName = "";
      this.isFiltered = false
    }
    this.state=stateData;
    this.saveGridState();
    this.setGridState(stateData);
    this.loadProfileCasesList();
  }

  private loadProfileCasesList(): void {
    const gridDataRefinerValue =
    {
      skipCount: this.state.skip ?? 0,
      pagesize : this.state.take ?? 0,
      sortColumn : this.sortValue,
      sortType : this.sortType,
      columnName : this.columnName,
      filter : this.filter,
      afterDate: this.afterDate,
      beforeDate: this.beforeDate
    }

    this.loadCases(gridDataRefinerValue)
  }

   loadCases(gridDataRefinerValue:any)
   {
     this.loadCasesListEvent.next(gridDataRefinerValue);
     this.cdr.detectChanges();
   }

  /** Private methods **/
  getLoggedInUserProfile(){
    this.userProfileSubsriction=this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserId= profile[0]?.loginUserId;
       this.getGridState();
      }
    })
  }
  private saveGridState(){
    const gridState: any = {
      gridStateKey: GridStateKey.GRID_STATE,
      gridStateValue: JSON.stringify(this.state),
      moduleCode:this.module,
      parentModuleCode:this.parentModule,
      userId:this.loginUserId
    };
    this.gridFacade.createGridState(gridState).subscribe({
      next: (x:any) =>{
        this.gridFacade.hideLoader();
      },
      error: (error:any) =>{
        this.gridFacade.hideLoader();
      }
    });
  }
  private getGridState(){
    if(this.loginUserId == undefined){
      return;
    }
    this.gridFacade.hideLoader();
    this.isGridLoaderShow = true;
    this.gridFacade.loadGridState(this.loginUserId,GridStateKey.GRID_STATE,this.module).subscribe({
      next: (x:any) =>{
        if(x){
          this.state=JSON.parse(x?.gridStateValue || '{}') ;
          if(this.state.searchValue!='' && this.state.searchValue!=undefined){
            this.filter = this.searchValue = this.state.searchValue;
            this.columnName = this.state.columnName;
            this.selectedColumn = this.state.selectedColumn;
          }
          this.setGridState(this.state);
        }
        this.loadProfileCasesList();
        this.gridFacade.hideLoader();
      },
      error: (error:any) =>{
        this.gridFacade.hideLoader();
      }
    });
  }
  private loadDdlGridColumns() {
    this.caseFacade.loadDdlGridColumns();
    this.searchLoaderVisibility$.subscribe((data : any) => {
      this.isGridLoaderShow = data;
    });

  }

  onChange(event :any)
  {
    this.defaultGridState()
    this.columnName = this.state.columnName = this.columnDroplist[this.selectedColumn];
    this.sortColumn = this.columns[this.selectedColumn];
    this.filter = {logic:'and',filters:[{
      "filters": [
          {
              "field": this.columnDroplist[this.selectedColumn] ?? "clientFullName",
              "operator": "startswith",
              "value": event
          }
      ],
      "logic": "and"
  }]}
  let stateData = this.state
  stateData.filter = this.filter
  this.dataStateChange(stateData);
    this.saveGridState();
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
      sort: this.sort,
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: ''
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
    const columnsRemoved = e?.columns.filter(x => x.hidden).length;
  const columnsAdded = e?.columns.filter(x => !x.hidden).length;

  if (columnsAdded > 0) {
    this.addRemoveColumns = 'Columns Added';
  }
  else {
    this.addRemoveColumns = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  e.columns.forEach(column => {
    if (column.hidden) {
      const field = (column as ColumnComponent)?.field;
      const mainFilters = this.state.filter.filters;

      mainFilters.forEach((filter:any) => {
          const filterList = filter.filters;

          const foundFilter = filterList.find((x: any) => x.field === field);

          if (foundFilter) {
            filter.filters = filterList.filter((x: any) => x.field !== field);
            this.clearSelectedColumn();
            this.loadProfileCasesList();
          }
        });
      }
    });
  }

  private clearSelectedColumn() {
    this.selectedColumn = '';
    this.columnName = '';
    this.filter = '';
    this.state.searchValue = '';
    this.state.selectedColumn = '';
    this.state.columnName = '';
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

  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    for (let val of filters) {
      if (val.field === 'eilgibilityStartDate' || val.field === 'eligibilityEndDate') {
        this.intl.formatDate(val.value, this.dateFormat);
      }
    }
    const filterList = this.state?.filter?.filters ?? [];
    this.filter = JSON.stringify(filterList);

    if (filters.length > 0) {
      const filterListData = filters.map((filter:any) => this.columns[filter?.filters[0]?.field]);
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cdr.detectChanges();
    }
    else {
      this.filter = "";
      this.columnName = "";
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? "";
    this.sortType = stateData.sort[0]?.dir ?? "";
    this.state = stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending':'';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.loadProfileCasesList();
  }
}
