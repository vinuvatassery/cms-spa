/** Angular libraries **/
import { ChangeDetectionStrategy, Component, Input, ViewChild, OnInit, OnDestroy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';

/** External libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject, Subscription, debounceTime } from 'rxjs';

/** Facade **/
import { FinancialVendorProviderTabCode, GridFilterParam, InvoiceFacade } from '@cms/case-management/domain';
import { FilterService, GridComponent } from '@progress/kendo-angular-grid';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider, DocumentFacade } from '@cms/shared/util-core';

@Component({
  selector: 'cms-invoices',
  templateUrl: './invoices.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicesComponent implements OnInit, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  public sortValue = this.invoiceFacade.sortValue;
  public sortType = this.invoiceFacade.sortType;
  public pageSizes = this.invoiceFacade.gridPageSizes;
  public gridSkipCount = this.invoiceFacade.skipCount;
  public sort = this.invoiceFacade.sort;
  public state!: any;
  invoiceGridView$ = this.invoiceFacade.invoiceData$;
  providerId:any;
  isInvoiceLoading$=  this.invoiceFacade.isInvoiceLoading$
  claimStatus$ = this.lovFacade.paymentStatus$
  isInvoiceLoadingSubscription!:Subscription;
  @Input() tabCode: any;
  @Input() vendorId: any;
  @Input() serviceGridView$ :any;
  @Input() isInvoiceServiceLoading$: any;
  @Input() vendorTypeCode: any;
  @Input() vendorName :any
  @Output() loadInvoiceServiceEvent = new EventEmitter<any>();
  @Output() loadInvoiceEvent = new EventEmitter<any>();
  @ViewChild(GridComponent)
  invoiceGrid!: GridComponent;
  claimsType: any = 'dental';
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  claimStatus:any;
  paymentStatusLovSubscription!:Subscription;
  paymentStatusDesc=null;

  searchColumnList : { columnName: string, columnDesc: string }[] = [
    { columnName: 'batchName', 
    columnDesc: 'Batch #'
   },
    {
      columnName: "invoiceNbr",
      columnDesc: "Invoice ID"   
    },
    {
      columnName: "clientName",
      columnDesc: "Client Name"   
    },
    {
      columnName: "insuranceCardName",
      columnDesc: "Name On Primary Insurance Card"   
    },
    {
      columnName: "clientId",
      columnDesc: "Client ID"   
    },
    {
      columnName: "serviceCount",
      columnDesc: "Service Count"   
    },
    {
      columnName: "totalCost",
      columnDesc: "Total Cost"   
    },
    {
      columnName: "totalDue",
      columnDesc: "Total Due"   
    },
    {
      columnName: "amountSpent",
      columnDesc: "Client Annual Total"   
    },
    {
      columnName: "balanceAmount",
      columnDesc: "Client Balance"   
    },
    {
      columnName: "paymentStatusDesc",
      columnDesc: "Payment Status"   
    },
    {
      columnName: "checkReconcileDate",
      columnDesc: "Date Reconciled"   
    },
    {
      columnName: "warrant",
      columnDesc: "Warrant#"   
    },
    {
      columnName: "entryDate",
      columnDesc: "Entry Date"   
    },
  ]
  selectedSearchColumn='';
  private searchSubject = new Subject<string>();
  @Input() exportButtonShow$ =    this.documentFacade.exportButtonShow$
  invoiceListSubject = new Subject();
  invoiceListSubscription = new Subscription();
  invoiceListProfilePhoto$ = this.invoiceFacade.invoiceListProfilePhotoSubject;

   /** Constructor **/
   constructor(private readonly invoiceFacade: InvoiceFacade,private readonly router: Router,
    private readonly lovFacade: LovFacade,
    private documentFacade:DocumentFacade,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,) {}

  ngOnInit(): void {
    this.claimStatusSubscription();
    this.addSearchSubjectSubscription();
    this.lovFacade.getPaymentStatusLov();
    if(this.tabCode === FinancialVendorProviderTabCode.MedicalProvider){
      this.claimsType = 'medical';
    } 
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      filter : this.filter === undefined?null:this.filter
    };
    
    this.loadInvoiceListGrid();
    this.isInvoiceLoadingSubscription = this.isInvoiceLoading$.subscribe((data:boolean)=>{
      this.isInvoiceGridLoaderShow = data;
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter : this.filter === undefined?null:this.filter
    };
  }

  ngOnDestroy(): void {
    this.isInvoiceLoadingSubscription.unsubscribe();
    this.paymentStatusLovSubscription.unsubscribe();
    this.invoiceListSubscription?.unsubscribe();
  }

  claimStatusSubscription(){
    this.paymentStatusLovSubscription = this.claimStatus$.subscribe(data=>{
      this.claimStatus = data;
    });
  }
  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovCode
      }],
        logic: "or"
    });

    if(field == "paymentStatusCode"){
      this.paymentStatusDesc = value;
    }
  }
  
  public dataStateChange(stateData: any): void {
    
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.filter = stateData?.filter?.filters;
    this.loadInvoiceListGrid();
  }

  collapseAll(rowCount:any){
    for(let i=0; i<rowCount;i++){
      this.invoiceGrid.collapseRow(i)
    }
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInvoiceListGrid();
  }

  loadInvoiceListGrid() {
    this.invoiceFacade.loadInvoiceListGrid(this.vendorId,this.state,this.tabCode,this.sortValue,this.sortType);
  }

  onClientClicked(clientId: any) {
      this.router.navigate([`/case-management/cases/case360/${clientId}`]);
      
  }

  onBatchClicked(batchId : any) {
    this.router.navigate([`/financial-management/claims/${this.claimsType}/batch`],
    { queryParams :{bid: batchId}});
  } 

  loadInvoiceServices(event:any){
    this.loadInvoiceServiceEvent.emit(event); 
  } 
  showExportLoader = false;
  showDateSearchWarning = false
  showNumberSearchWarning = false
  numberSearchColumnName ='';
  sortColumn = 'clientName';
  sortDir = 'Ascending';
  sortColumnDesc = 'Client Name';
  filteredByColumnDesc ='';
  columnChangeDesc = 'Default Columns';
  columnsReordered = false;
  searchText = '';
  gridColumns: { [key: string]: string }  = {
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
  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }
  onClientSearch(searchValue: any) {
    
    const isDateSearch = searchValue.includes('/');
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }
  private addSearchSubjectSubscription() {
    
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        
        this.performClientSearch(searchValue);
      });
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
  performClientSearch(data: any) {
    
    this.defaultGridState();  
    const operator = (['entryDate', 'checkReconcileDate']).includes(this.selectedSearchColumn) ? 'eq' : 'startswith';

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
    this.loadInvoiceListGrid();
  }
  resetClientGrid() {
    this.sortValue = 'clientName';
    this.sortType = 'asc';
    this.loadInvoiceListGrid();
    this.sortColumn = 'clientName';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = '';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadInvoiceListGrid();
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
      vendorId :this.vendorId,
     
    }
    let fileName = this.vendorTypeCode+' '+(this.vendorName[0].toUpperCase() + this.vendorName.substr(1).toLowerCase())+' invoices'
   
    this.documentFacade.getExportFile(vendorCleintPageAndSortedRequest, `vendors/${this.vendorId}/invoices`,fileName)
    this.exportButtonShow$
    .subscribe((response: any) =>
    {
      if(response)
      {
        this.showExportLoader = false
      
      }
    })
  }
  searchColumnChangeHandler(value: string) {
    
    this.showNumberSearchWarning = (['balanceAmount','amountSpent','totalDue','totalCost','serviceCount','clientId','batchName','invoiceNbr']).includes(value);
    this.showDateSearchWarning =   (['entryDate','checkReconcileDate']).includes(value);

    if(this.showNumberSearchWarning){
      this.numberSearchColumnName = this.gridColumns[value]
    }
    this.filter = [];
    if (this.searchText) {
      this.onClientSearch(this.searchText);
    }
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
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.searchColumnList?.find(i => i.columnName === this.selectedSearchColumn)?.columnDesc ?? '';
    }
  }
}
