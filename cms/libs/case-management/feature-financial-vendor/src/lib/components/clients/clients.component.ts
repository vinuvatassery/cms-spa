import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InsuranceProviderFacade, GridFilterParam } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import {
  CompositeFilterDescriptor
} from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { FilterService, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { Subject, debounceTime } from 'rxjs';
import { ConfigurationProvider, DocumentFacade } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'cms-clients',
  templateUrl: './clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isclientsGridLoaderShow = false;
  public sortValue = this.insuranceProviderFacade.clientsSortValue;
  public sortType = this.insuranceProviderFacade.sortType;
  public pageSizes = this.insuranceProviderFacade.gridPageSizes;
  public gridSkipCount = this.insuranceProviderFacade.skipCount;
  public sort = this.insuranceProviderFacade.clientSort;

  caseStatusType$ = this.lovFacade.caseStatusType$;
  groupLov$ = this.lovFacade.groupLov$;
  @Input() exportButtonShow$ =    this.documentFacade.exportButtonShow$
  caseStatusCodes:any=["CANCELED","REVIEW","NEW"];
  caseStatusTypes:any=[];
  public state!:any;
  providerClientGridView$ = this.insuranceProviderFacade.providerClientsData$;
  @Input() providerId:any;
  addressGridView = [];
  @Input() vendorTypeCode: any;
  @Input() vendorName :any
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filter!: any;
  groupValue = null;
  statusValue = null;
  columnsReordered = false;
  public gridFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  sortColumn = 'clientName';
  sortDir = 'Ascending';
  sortColumnDesc = 'Client Name';
  showExportLoader = false;
  @Output() loadVendorClients = new EventEmitter<any>();
  showDateSearchWarning = false
  showNumberSearchWarning = false
  numberSearchColumnName =''
  searchColumnList : { columnName: string, columnDesc: string }[] = [
    {
      columnName: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnName: 'clientName',
      columnDesc: 'Client Name'
    },
    {
      columnName: "clientId",
      columnDesc: "Client ID"
    }
  ]
  selectedSearchColumn='ALL';
  filteredByColumnDesc ='';
  columnChangeDesc = 'Default Columns'
  gridColumns: { [key: string]: string }  = {
    ALL: 'All Columns',
    clientName: 'Client Name',
    pronouns: "Pronouns",
    clientId: "ID",
    urn: "URN",
    preferredContact: "Preferred Contact",
    status:"Status",
    group:"Group",
    eilgibilityStartDate:"Eligibility Start Date",
    eligibilityEndDate:"Eligibility End Date"
  };
  searchText = '';
  private searchSubject = new Subject<string>();
  isFiltered=false;
  filteredBy='';

  /** Constructor **/
  constructor(private readonly insuranceProviderFacade: InsuranceProviderFacade,private readonly router: Router,
    private readonly lovFacade: LovFacade, private readonly  cdr :ChangeDetectorRef,private documentFacade:DocumentFacade,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService) {}

  ngOnInit(): void {
    this.lovFacade.getGroupLovs();
    this.lovFacade.getCaseStatusLovs();
    this.getCaseStatusLovs();
    this.initializeClientPage()
    this.loadClientsListGrid();
    this.addSearchSubjectSubscription();
    this.insuranceProviderFacade.gridLoaderVisibility$.subscribe(response=>{
      this.isclientsGridLoaderShow = response;
    });
  }

  initializeClientPage() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'clientName', dir: 'asc' }]
    };
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performClientSearch(searchValue);
      });
  }

  performClientSearch(data: any) {
    this.defaultGridState();
    const operator = (['eilgibilityStartDate', 'eligibilityEndDate']).includes(this.selectedSearchColumn) ? 'eq' : 'startswith';

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ClientName',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  searchColumnChangeHandler(value: string) {
    this.showNumberSearchWarning = (['clientId']).includes(value);
    this.showDateSearchWarning =   (['eilgibilityStartDate','eligibilityEndDate']).includes(value);

    if(this.showNumberSearchWarning){
      this.numberSearchColumnName = this.gridColumns[value]
    }
    this.filter = [];
    if (this.searchText) {
      this.onClientSearch(this.searchText);
    }
  }

  onClientSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    if(this.selectedSearchColumn === 'preferredContact'  && !this.selectedSearchColumn?.includes('@'))
    {
      searchValue = this.removeExtraCharactersFromPhone(searchValue);
    }
    this.searchSubject.next(searchValue);
    this.cdr.detectChanges();
  }

  defaultGridState() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters: { logic: 'and', filters: [] },
      selectedColumn: '',
      columnName: '',
      searchValue: '',
    };
  }


  ngOnChanges(): void {
    this.initializeClientPage()
    this.loadClientsListGrid();
  }


  resetClientGrid() {
    this.sortValue = 'clientName';
    this.sortType = 'asc';
    this.initializeClientPage();
    this.sortColumn = 'clientName';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadClientsListGrid();
  }
  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.insuranceProviderFacade.clientsSortValue;
    this.sortType = stateData.sort[0]?.dir ?? this.insuranceProviderFacade.sortType;
      this.state = stateData;

    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;

    this.setFilterBy(true, '', this.filter);
    this.loadClientsListGrid();
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld:any)=> fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });

        this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
        this.filter.forEach((element : any) => {
          const preferredContact = element.filters.find((x : any) => x.field === 'preferredContact')
          if(preferredContact && !preferredContact?.value.includes('@'))
          {
            preferredContact.value = this.removeExtraCharactersFromPhone(preferredContact.value);
          }
        });
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.searchColumnList?.find(i => i.columnName === this.selectedSearchColumn)?.columnDesc ?? '';
    }
  }

  removeExtraCharactersFromPhone(value : any)
  {
    value = value.replaceAll("(", "");
    value = value.replaceAll(")", "");
    value = value.replaceAll(" ", "");
    value = value.replaceAll("-","");
    return value;
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientsListGrid();
  }
  loadClientsListGrid()
  {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
      this.insuranceProviderFacade.loadProviderClientsListGrid(this.providerId,this.vendorTypeCode,param);

  }
  onClientClicked(clientId: any) {
    this.router.navigate([`/case-management/cases/case360/${clientId}`]);

  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
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
    if(field == "status"){
      this.statusValue = value;
    }
  }
  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x=> x.hidden).length
    const columnsAdded = event?.columns.filter(x=> x.hidden === false).length

  if (columnsAdded > 0) {
    this.columnChangeDesc = 'Columns Added';
  }
  else {
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }
    this.cdr.detectChanges();
  }

  onClickedExport(){
    this.showExportLoader = true
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    const vendorCleintPageAndSortedRequest =
    {
      SortType : param?.sortType,
      Sorting : param?.sorting,
      SkipCount : param?.skipCount,
      MaxResultCount : param?.maxResultCount,
      Filter : param?.filter,
      vendorId :this.providerId,
      vendorTypeCode:this.vendorTypeCode
    }
   let fileName = this.vendorTypeCode+' '+(this.vendorName[0].toUpperCase() + this.vendorName.substr(1).toLowerCase())+' Clients'
    this.documentFacade.getExportFile(vendorCleintPageAndSortedRequest, `vendors/${this.providerId}/clients`,fileName)
    this.exportButtonShow$
    .subscribe((response: any) =>
    {
      if(response)
      {
        this.showExportLoader = false
        this.cdr.detectChanges()
      }
    })
  }


  private isValidDate = (searchValue: any) => isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(new Date(searchValue), this.configProvider?.appSettings?.dateFormat);
      }
      else {
        return '';
      }
    }

    return searchValue;
  }
}
