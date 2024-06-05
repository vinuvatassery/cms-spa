/** Angular **/
import {
  AfterViewInit,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
/** Facades **/
import { CaseFacade,CaseScreenTab, CaseStatusCode, WorkflowTypeCode, GridFacade, GridStateKey, GroupCode } from '@cms/case-management/domain';
import { Observable, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade, UserDataService } from '@cms/system-config/domain';
import { FilterService, ColumnVisibilityChangeEvent, ColumnComponent, ColumnBase } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import {ConfigurationProvider} from '@cms/shared/util-core';
import { Router } from '@angular/router';


@Component({
  selector: 'case-management-case-list',
  templateUrl: './case-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseListComponent implements OnInit, AfterViewInit, OnDestroy {

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
  @Input() healthInsuranceType: string = '';
  @Input() fplPercentage: any;
  @Input() filterOperator: any;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() columnDroplist$ : any;
  @Input() selectedTab: CaseScreenTab = 0;
  @Input() module: string = '';
  @Input() parentModule: string = '';
  @Input() caseStatus: string = '';
  @Input() group: string = '';
  addRemoveColumns="Default Columns"
  defaultColumns = [
    "clientFullName",
    "pronouns",
    "clientId",
    "urn",
    "caseStatus",
    "group",
    "eilgibilityStartDate",
    "eligibilityEndDate",
    "insuranceType",
    "fplPercentage"
    ]
  columns : any = {
    clientFullName:"Client Name",
    officialIdFullName:"Name on Official ID",
    insuranceFullName:"Name on Insurance Card",
    pronouns:"Pronouns",
    clientId:"Client ID",
    urn:"URN",
    preferredContact:"Preferred Contact",
    eligibilityStatusCode:"Status",
    group:"Group",
    eilgibilityStartDate:"Eligibility Start Date",
    eligibilityEndDate:"Eligibility End Date",
    email:"Email",
    phone:"Home Phone",
    genders:"Gender",
    homeAddress:"Home Address",
    ssn:"SSN",
    insurancePolicyId:"Insurance Policy Id",
    assignedCw:"Assigned to",
    dateOfBirth:"Date Of Birth",
    caseManager:"Case Manager",
    insuranceType : "Health Insurance Type",
    fplPercentage : "FPL %"
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
  healthInsuranceType$ = this.lovFacade.healthinsuranceType$;
  selectedColumn!: any;
  filter : any = "";
  afterDate: any;
  beforeDate: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() loadCasesListEvent = new EventEmitter<any>();
  groupData:any=[]
  caseStatusTypes:any=[];
  healthinsuranceTypes:any=[];
  caseStatusCodes:any=["CANCELED","REVIEW","NEW"];
  public gridFilter: CompositeFilterDescriptor={logic:'and',filters:[]};
  private userProfileSubsriction !: Subscription;
  loginUserId!:any;
  groupValue = null;
  statusValue = null;
  healthInsuranceTypeValue = null;
  @ViewChild('clientsGrid') clientsGrid: any;
  defaultColumnState: ColumnBase[] = [];
  selectedGroup="";
  selectedStatus="";
  selectedHealthInsuranceType="";
  casesLoaded=false;
  hiddenColumns: ColumnComponent[]=[];
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
    this.lovFacade.gethealthInsuranceTypeLovs();
    this.gethealthInsuranceTypesLovs();
    this.selectedColumn = 'ALL';
    this.getGroupLovs() ; 
    this.getLoggedInUserProfile();
    if (this.caseStatus == CaseStatusCode.incomplete || this.caseStatus == CaseStatusCode.accept || this.caseStatus == CaseStatusCode.restricted){ 
      this.dashboardCERfilter(); 
    } 
    if(this.healthInsuranceType){
      this.dashboardFPLfilter();
    }
     
    if(this.group == GroupCode.UPP ||  this.group == GroupCode.Bridge || this.group == GroupCode.GroupI
      || this.group == GroupCode.GroupII ||  this.group == GroupCode.GroupINSGAP || this.group == GroupCode.GroupIINSGAP)
      {
        this.dashboardGroupfilter();
      }
  }
  ngOnDestroy(): void {
    this.userProfileSubsriction.unsubscribe();
  }

  ngAfterViewInit() {
    this.defaultColumnState = this.clientsGrid.columns.toArray();
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
  private gethealthInsuranceTypesLovs() {
    this.healthInsuranceType$
    .subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.healthinsuranceTypes=data.sort((value1:any,value2:any) => value1.sequenceNbr - value2.sequenceNbr);
        const obj = this.healthinsuranceTypes.find((x: any) => x.lovCode === this.healthInsuranceType);
        this.selectedHealthInsuranceType = obj;
      }
    });
  }
  
  defaultGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    filter:{logic:'and',filters:[]},
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: ''
      };
  }
  dashboardCERfilter(){
      this.state.filter.filters.push(
        {filters:[{
          field: "eligibilityStatusCode",
          operator: "eq",
          value:this.caseStatus
      }]});
    this.dataStateChange(this.state,false);
  }
  dashboardGroupfilter(){
    this.state.filter.filters.push(
      {filters:[{
        field: "group",
        operator: "eq",
        value:this.group
    }]});
  this.dataStateChange(this.state,false);
}
dashboardFPLfilter(){
  this.state.filter.filters.push(
    {filters:[{
      field: "insuranceType",
      operator: "eq",
      value:this.healthInsuranceType
      },{
        field: "fplPercentage",
        operator: this.filterOperator,
        value:this.fplPercentage
    }]});
this.dataStateChange(this.state,false);
}
 filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }
 groupFilterChange(value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: "group",
          operator: "eq",
          value:value.lovDesc
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

  if(field == "group"){
    this.groupValue = value;
  }
  if(field == "eligibilityStatusCode"){
    this.statusValue = value;
  }
  if(field == "insuranceType"){
    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value.lovCode
    }],
      logic: "or"
  });
    this.healthInsuranceTypeValue = value;
  }
}

 pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.saveGridState();
    this.loadProfileCasesList()
  }
  public dataStateChange(stateData: any, isSearchBarFilter = false): void {
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
      this.selectedStatus ='';
      this.selectedGroup = '';
      this.selectedHealthInsuranceType = '';
    }
    this.state=stateData;
    if (!this.filteredBy.includes('Status')) this.selectedStatus = '';
    if (!this.filteredBy.includes('Group')) this.selectedGroup = '';
    if (!this.filteredBy.includes('Health Insurance Type')) this.selectedHealthInsuranceType = '';
    if(!isSearchBarFilter){
    this.saveGridState();
    }
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
       if(!this.casesLoaded){ 
        if (!this.caseStatus && !this.healthInsuranceType && !this.group && this.loginUserId != undefined){ 
          this.getGridState();
        }         
        this.casesLoaded = true;
       }

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
    this.gridFacade.hideLoader();
    this.isGridLoaderShow = true;
    this.gridFacade.loadGridState(this.loginUserId,GridStateKey.GRID_STATE,this.module).subscribe({
      next: (x:any) =>{
        if(x){
          this.state=JSON.parse(x?.gridStateValue || '{}') ;
          if(this.state.searchValue!='' && this.state.searchValue!=undefined){
            this.filter = this.searchValue = this.state.searchValue;
            this.state.filter = this.filter;
            this.columnName = this.state.columnName;
            this.selectedColumn = this.state.selectedColumn;
          }

          const filters = this.state.filter?.filters ?? [];
          for (let item of filters) {
            this.hiddenColumns = this.defaultColumnState.filter(x => x.hidden === true) as ColumnComponent[];
            const columnField = item['filters'][0].field;
            const isHiddenColumn = this.hiddenColumns.find(k => k.field === columnField);
            if (isHiddenColumn) 
                isHiddenColumn.hidden = false;
          }
          this.setGridState(this.state);
          this.cdr.detectChanges();
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
    if(this.columnName=='homeAddress')
    {
      this.filter = {logic:'and',filters:[{
        "filters": [
            {
                "field": this.columnDroplist[this.selectedColumn],
                "operator": "contains",
                "value": event
            }
        ],
        "logic": "and"
    }]}
    }else{
      this.filter = {logic:'and',filters:[{
        "filters": [
            {
                "field": this.columnDroplist[this.selectedColumn] ?? "clientFullName",
                "operator": "contains",
                "value": event
            }
        ],
        "logic": "and"
    }]}
    }

  let stateData = this.state
  stateData.filter = this.filter
  this.dataStateChange(stateData, true);
    this.loadProfileCasesList();
}
  setToDefault()
  {
    this.pageSizes = this.caseFacade.gridPageSizes;
    this.sortValue  = this.caseFacade.sortValue;
    this.sortType  = this.caseFacade.sortType;
    this.sort  = this.caseFacade.sort;

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
    this.selectedStatus = '';
    this.selectedGroup = '';
    this.columnsReordered = false;
    this.defaultColumnState.forEach((item:any) => {
      if(this.defaultColumns.includes(item.field) || (item.field === "assignedCw" && this.selectedTab !== this.tabOptions.MY_CASES))
      {
        item.hidden = false;
      }
    });


    this.saveGridState();
    this.loadProfileCasesList();
  }

  onColumnReorder(event:any)
  {
    this.columnsReordered = true;
  }

  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x=> x.hidden).length
    const columnsAdded = event?.columns.filter(x=> x.hidden === false).length

  if (columnsAdded > 0) {
    this.addRemoveColumns = 'Columns Added';
  }
  else {
    this.addRemoveColumns = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  event.columns.forEach(column => {
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
      if (!column.hidden) {
        let columnData = column as ColumnComponent;
        this.columns[columnData.field] = columnData.title;
      }

    });
   
    this.defaultGridState();
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

    const filters = this.nullCheck(stateData.filter?.filters);

    for (let val of filters) {
      if (val.field === 'eilgibilityStartDate' || val.field === 'eligibilityEndDate') {
        this.intl.formatDate(val.value, this.dateFormat);
      }
    }
    const filterList = this.nullCheck(this.state?.filter?.filters);
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
    this.setSortValue();
    this.sort = stateData.sort;
    this.sortValue =this.nullCheck(stateData.sort[0]?.field);
    this.sortType = this.nullCheck(stateData.sort[0]?.dir);
    this.columnName = filterList.length > 0 ? filterList[0]?.filters[0]?.field : "";
    this.state = stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = "";
    this.setSortDir();
    if (this.filteredBy?.includes('Status')) {
      const eligibilityFilter = filters
        ?.flatMap((filter: any) => filter.filters)
        ?.find((filter: any) => filter.field === 'eligibilityStatusCode');
      
      if (eligibilityFilter) {
        const filterValue = eligibilityFilter.value;
        const obj = this.caseStatusTypes.find((x: any) => x.lovCode === filterValue);
        this.selectedStatus = obj;
      }
    }
    if(this.filteredBy?.includes('Health Insurance Type')){
      const insuranceTypeFilter = filters
        ?.flatMap((filter: any) => filter.filters)
        ?.find((filter: any) => filter.field === 'insuranceType');
      
      if (insuranceTypeFilter && this.healthinsuranceTypes.length > 0) {
        const filterValue = insuranceTypeFilter.value;
        const obj = this.healthinsuranceTypes.find((x: any) => x.lovCode === filterValue);
        this.selectedHealthInsuranceType = obj;
      }
    }
  }

  setSortDir(){
    if(this.sort[0]?.dir === 'asc'){
      this.sortDir = 'Ascending';
    }
    if(this.sort[0]?.dir === 'desc'){
      this.sortDir = 'Descending';
    }
  }

  setSortValue(){
    if(this.sortValue === "eligibilityStatusCode"){
      this.sortValue = "caseStatus";
    }
    if(this.sortValue === "insuranceType"){
      this.sortValue = "healthInsuranceType";
    }
  }
  nullCheck(value:any){
    if(value){
      return value;
    }
    else{
      return [];
    }
   }
}
