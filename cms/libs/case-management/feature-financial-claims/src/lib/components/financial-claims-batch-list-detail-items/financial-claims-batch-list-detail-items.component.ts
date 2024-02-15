/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Observable, Subject, Subscription, debounceTime, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FinancialClaimsFacade, GridFilterParam, PaymentDetail, PaymentPanel, PaymentStatusCode } from '@cms/case-management/domain';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-claims-batch-list-detail-items',
  templateUrl: './financial-claims-batch-list-detail-items.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchListDetailItemsComponent implements OnInit, OnChanges, OnDestroy {
 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogItemsGridLoaderShow = false;
  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchItemsGridLists$: any;
  @Input() paymentPanelData$:any;
  @Input() vendorAddressId:any;
  @Input() batchId:any;
  @Input() itemsListGridLoader$!: Observable<boolean>;
  @Input() paymentDetails$!: Observable<PaymentDetail>;
  @Output() loadBatchItemsListEvent = new EventEmitter<any>();
  @Output() loadPaymentPanel = new EventEmitter<any>();
  @Output()  updatePaymentPanel  = new EventEmitter<PaymentPanel>();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Output() onEditProviderProfileEvent = new EventEmitter<any>();
  @Output() onExportClickedEvent = new EventEmitter<any>();
  @Input() vendorProfile$ :any;
  @Input() updateProviderPanelSubject$:any
  @Input() ddlStates$ :any
  @Input() paymentMethodCode$ :any
  @Input() claimsServiceProfile$!: any;
  paymentPanelDetails:any;
  public state!: State;
  sortColumn: string='creationTime';
  sortDir = 'Ascending';
  sortColumnDesc:string = 'Entry Date';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  providerDetailsDialog: any;
  paymentDetailsDialog: any;
  gridClaimsBatchLogItemsDataSubject = new Subject<any>();
  gridClaimsBatchLogItemsData$ = this.gridClaimsBatchLogItemsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  serviceGridColumnName = ''; 
  @Input() exportButtonShow$:any
  columnChangeDesc = 'Default Columns'
  selectedSearchColumn='ALL';
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
  addClientRecentClaimsDialog: any;
  vendorId: any;
  clientId: any;
  clientName: any;
  UnBatchDialog: any;
  deleteClaimsDialog:any
  public options:any[] =[]

  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialogTemplate', { read: TemplateRef })
  deleteClaimsConfirmationDialogTemplate!: TemplateRef<any>;
  isDeleteClaimClosed = false
  gridColumns : {[key: string]: string} = {
            ALL: 'All Columns',
            clientFullName: 'Client Name',
            nameOnInsuranceCard: 'Name on Primary Insurance Card',
            paymentStatus: 'Payment Status',
            clientId: 'Client ID',
            serviceStartDate: 'Service Date',
            cptCode: 'CPT Code',
            serviceDesc:'',
            serviceCost: 'Service Cost',
            amountDue: 'Client Co-Pay',
            creationTime: 'Entry Date',
            invoiceNbr:'Invoice ID'
          };
searchText =''
private searchSubject = new Subject<string>();
deletemodelbody =
'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  searchColumnList : { columnName: string, columnDesc: string }[] 
  
  isUnBatchClaimsClosed = false;
  paymentStatusLov$ = this.lovFacade.paymentStatus$;
  paymentStatusFilter = '';
  showExportLoader=false;
  filteredByColumnDesc='';
  showDateSearchWarning =false
  showNumberSearchWarning =false
  numberSearchColumnName =""
  paymentRequestId: any;
  selected: any;
  claimsServiceProfileSubject = new Subject();
  batchItemsGridListSubjecription = new Subscription();
  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService, 
    public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef,
    private lovFacade :  LovFacade,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly userManagementFacade: UserManagementFacade) {
      this.searchColumnList = []
    }
  
  ngOnInit(): void { 
    this.serviceGridColumnName = this.claimsType.charAt(0).toUpperCase() + this.claimsType.slice(1);
    this.gridColumns['serviceDesc'] = `${this.serviceGridColumnName} Service`;
    this.searchColumnList = [
      { columnName: 'ALL', columnDesc: 'All Columns' },
      { columnName: "clientId",columnDesc: "Client ID" },
      { columnName: 'clientFullName',  columnDesc: 'Client Name'},
    ]
    this.initializeGridState();
    this.loadBatchLogItemsListGrid(); 
    this.lovFacade.getPaymentStatusLov();
    this.addSearchSubjectSubscription();
    this.paymentDetails$.subscribe((res :any) =>{
      this.paymentRequestId = res.paymentRequestId
      this.options = [
        {
          buttonType: 'btn-h-primary',
          text: 'UNBATCH CLAIM',
          icon: 'undo',
          disabled: [
            PaymentStatusCode.Paid,
            PaymentStatusCode.PaymentRequested,
            PaymentStatusCode.ManagerApproved,
          ].includes(res.paymentStatusLovCode),
          click: (data: any): void => {
              if (!this.isUnBatchClaimsClosed) {
                this.isUnBatchClaimsClosed = true;
                this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
              }

        }
      },
        {
          buttonType: 'btn-h-primary',
          text: 'DELETE CLAIM',
          icon: 'delete',
          disabled: [
            PaymentStatusCode.Paid,
            PaymentStatusCode.PaymentRequested,
            PaymentStatusCode.ManagerApproved,
          ].includes(res.paymentStatusLovCode),
          click: (data: any): void => {
            if(!this.isDeleteClaimClosed){
            this.isDeleteClaimClosed = true;
            this.onSingleClaimDelete(this.paymentRequestId);
            this.onDeleteClaimsOpenClicked(
              this.deleteClaimsConfirmationDialogTemplate
            );
            }
        },
      }
      ];
    })

    this.batchItemsGridLists$.subscribe((res :any) =>{
      if(res.total <=0){
        this.backToBatchLog(null);
      }
    })
    this.addPaymentServiceListSubscription();
  }

  addPaymentServiceListSubscription() {
    this.batchItemsGridListSubjecription = this.batchItemsGridLists$.subscribe((service: any)=>{
      if(service?.data){
        
      }
    });
  }

  ngOnDestroy(): void {
    this.batchItemsGridListSubjecription.unsubscribe();
  }
  
  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onSingleClaimDelete(selection: any) {
    this.selected = selection;
  }
  
  ngOnChanges(): void {
    this.paymentPanelData$.subscribe((data: any)=>{
      this.paymentPanelDetails = data;
      this.cd.detectChanges();
    })

    this.initializeGridState();
    this.loadPaymentPanel.emit(true);
  }

  
  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performSearch(searchValue);
      });
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  performSearch(data: any) {
    this.defaultGridState();
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'all',
              operator: 'contains',
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
    this.loadBatchLogItemsListGrid();
  }

  private loadBatchLogItemsListGrid(): void {
    this.loadBatchLogItems(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadBatchLogItems(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogItemsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.filter
    };
    this.loadBatchItemsListEvent.emit(gridDataRefinerValue);
  }
 
  
  searchColumnChangeHandler(value: string) {
    this.showNumberSearchWarning = (['clientId','invoiceNbr','serviceCost','amountDue']).includes(value);
    this.showDateSearchWarning =   (['serviceStartDate','creationTime']).includes(value);

    if(this.showNumberSearchWarning){
      this.numberSearchColumnName = this.gridColumns[value]
    }
    this.filter = [];
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  resetGrid(){
    this.sortValue = 'creationTime';
    this.sortType = 'asc';
    this.sortColumn = 'clientName';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : "";
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = '';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadBatchLogItemsListGrid()
  }
  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
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


  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
              operator: 'startswith',
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

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field;
    this.sortColumnDesc = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    this.loadBatchLogItemsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogItemsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    this.paymentStatusFilter = value;
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value
      }],
        logic: "or"
    });
  }

  backToBatchLog(event : any){  
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([`/financial-management/claims/${this.claimsType}/batch`],
    { queryParams :{bid: batchId}});
  }

  onViewProviderDetailClicked(  template: TemplateRef<unknown>): void {  
    this.providerDetailsDialog = this.dialogService.open({
      content: template,
      animation:{
        direction: 'left',
        type: 'slide',  
      }, 
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any){
    if(result){
      this.providerDetailsDialog.close();
    }
  }


  onPaymentDetailFormClicked(  template: TemplateRef<unknown>): void {   
    this.paymentDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-sm',
    });
  }

  onClosePaymentDetailFormClicked(result: any){
    if(result){
      this.loadPaymentPanel.emit(true);
      this.paymentDetailsDialog.close();
    }
  }
  updatePaymentPanelRecord(paymentPanel:PaymentPanel){
    this.updatePaymentPanel.emit(paymentPanel);
  }
  
  getProviderPanel(event:any){
    this.getProviderPanelEvent.emit(event)
  }

  updateProviderProfile(event:any){
    this.updateProviderProfileEvent.emit(event)
  }

  OnEditProviderProfileClick(){
   this.onEditProviderProfileEvent.emit()
  }

  private initializeGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'creationTime', dir: 'desc' }],
    };
    this.sortColumnDesc = 'Entry Date';
  }

  onClickedExport(){
    this.showExportLoader = true
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filter);

    const PagingAndSortedRequest =
    {
      SortType : param?.sortType,
      Sorting : param?.sorting,
      SkipCount : param?.skipCount,
      MaxResultCount : param?.maxResultCount,
      Filter : param?.filter
    }
    this.onExportClickedEvent.emit(PagingAndSortedRequest);

    this.exportButtonShow$
    .subscribe((response: any) =>
    {
      if(response)
      {
        this.showExportLoader = false
       this.cd.detectChanges()
      }
    })
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientFullName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }

  onUnBatchCloseClicked(result: any) {
    if (result) {
        this.handleUnbatchClaims();
        this.financialClaimsFacade.unbatchClaims(
          [this.paymentRequestId],
          this.claimsType
        );
      }
    this.isUnBatchClaimsClosed = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchClaims() {
    this.financialClaimsFacade.unbatchClaims$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        this.route.navigateByUrl(
          `financial-management/claims/${this.claimsType}?tab=2`
        );
      });
  }

  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.isDeleteClaimClosed = false;
      this.deleteClaimsDialog.close();
    }
  }

  onModalBatchDeletingClaimsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteClaims();
      this.financialClaimsFacade.deleteClaims([this.paymentRequestId], this.claimsType);
    }
  }

  handleDeleteClaims() {
    this.financialClaimsFacade.deleteClaims$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse != null) {
          this.isDeleteClaimClosed = false;
          this.deleteClaimsDialog.close();
          this.loadBatchLogItemsListGrid();
        }
      });
  }

}
