
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import {  ColumnVisibilityChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, Subscription, debounceTime, first } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { LoadTypes, GridFilterParam, VendorFacade, FinancialVendorFacade, FinancialPharmacyClaimsFacade, DrugsFacade, PaymentStatusCode } from '@cms/case-management/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';

@Component({
  selector: 'cms-pharmacy-claims-all-payments-list',
  templateUrl: './pharmacy-claims-all-payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsAllPaymentsListComponent implements OnInit, OnChanges{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialog', { read: TemplateRef })
  deleteClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('addEditClaimsDialog', { read: TemplateRef })
  addEditClaimsDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPharmacyClaimsAllPaymentsGridLoaderShow = false;

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pharmacyClaimsAllPaymentsGridLists$: any;
  @Input() pharmacyClaimsAllPaymentsGridLoader$!: Observable<boolean>;
  @Input() exportLoader$!: Observable<boolean>;
  @Input() letterContentList$ :any;
  @Input() letterContentLoader$ :any;
  @Input() addPharmacyClaim$: any;
  @Input() editPharmacyClaim$: any;
  @Input() getPharmacyClaim$: any;
  @Input() searchPharmacies$: any;
  @Input() searchClients$: any;
  @Input() searchDrugs$: any;
  @Input() searchPharmaciesLoader$: any;
  @Input() searchClientLoader$: any;
  @Input() searchDrugsLoader$: any;
  @Input() paymentRequestType$ : any
  @Input() deliveryMethodLov$ :any

  @Output() exportGridEvent$ = new EventEmitter<any>();
  @Output() loadPharmacyClaimsAllPaymentsListEvent = new EventEmitter<any>();
  @Output() loadTemplateEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();
  @Input() pharmacyClaimnsAllPaymentsProfilePhoto$!: any;
  @Output() unBatchClaimsEvent = new EventEmitter<any>();
  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  public state!: State;
  @Input() unbatchClaim$ :any
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  addClientRecentClaimsDialog:any;
  providerDetailsDialog: any;
  gridPharmacyClaimsAllPaymentsDataSubject = new Subject<any>();
  gridPharmacyClaimsAllPaymentsData$ = this.gridPharmacyClaimsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  isRequestPaymentClicked = false;
  isPrintAuthorizationClicked = false;
  isAddEditClaimMoreClose = false;
  isDeleteBatchMoreOptionClosed = false;
  addEditClaimsFormDialog: any;
  deleteClaimsDialog: any;
  showExportLoader = false;
 sortDir = 'Ascending';
 sortColumnDesc = 'Batch #';
 filteredByColumnDesc = '';
 columnChangeDesc = 'Default Columns';
 isColumnsReordered = false;
 searchText = '';
 selectedSearchColumn = 'ALL';
 private searchSubject = new Subject<string>();
 paymentMethodType$ = this.lovFacade.paymentMethodType$;
 paymentStatus$ = this.lovFacade.paymentStatus$;
 paymentMethodFilter = '';
 paymentTypeFilter = '';
 paymentStatusFilter = '';
 selectAll:boolean=false;
 unCheckedPaymentRequest:any=[];
 selectedDataIfSelectAllUnchecked:any=[];
 pharmacyClaimsAllPaymentsGridLists: any = [];
 currentPageRecords: any = [];
 selectedAllPaymentsList!: any;
 isBulkUnBatchOpened =false;
 isPageCountChanged: boolean = false;
 isPageChanged: boolean = false;
 unCheckedProcessRequest:any=[];
 checkedAndUncheckedRecordsFromSelectAll:any=[];
 recordCountWhenSelectallClicked: number = 0;
 totalGridRecordsCount: number = 0;
 sendReportCount: number = 0;
 allPaymentsListSubscription!: Subscription;
 vendorId: any;
 clientId: any;
 claimsType: any;
 clientName: any;
 UnBatchDialog: any;
 gridLoaderSubject = new BehaviorSubject(false);
 allPaymentsPrintAdviceLetterPagedList: any;
 manufacturersLov$ = this.financialVendorFacade.manufacturerList$;
 sortValueRecentClaimList = this.financialPharmacyClaimsFacade.sortValueRecentClaimList;
 sortRecentClaimList = this.financialPharmacyClaimsFacade.sortRecentClaimList;
 gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
 recentClaimsGridLists$ = this.financialPharmacyClaimsFacade.recentClaimsGridLists$;
 pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;
 addDrug$ = this.drugsFacade.addDrug$
 fromDrugPurchased:any = false;
 gridColumns: { [key: string]: string } = {
  ALL: 'All Columns',
  itemNbr:'Item #',
  batchName: 'Batch #',
  pharmacyName: 'Pharmacy Name',
  paymentMethodCode: 'Payment Method',
  paymentMethodDesc: 'Payment Method',
  clientFullName: 'Client Name',
  insuranceName: 'Name on Primary Insurance Card',
  clientId: 'Client ID',
  amountPaid: 'Amount Paid',
  amountDue: 'Total Amount Paid',
  indexCode: 'Index Code',
  pcaCode: 'PCA Code',
  objectCode:'Object Code',
  paymentStatus: 'Payment Status',
  warrantNumber: 'Warrant Number',
  creationTime: 'Entry Date'
};
selected: any;
isUnBatchClaimsClosed = false;
searchColumnList: { columnName: string, columnDesc: string }[] = [
  { columnName: 'ALL', columnDesc: 'All Columns' },
  { columnName: 'batchName', columnDesc: 'Batch #' },
  { columnName: 'pharmacyName', columnDesc: 'Pharmacy Name' },
  { columnName: 'clientFullName', columnDesc: 'Client Name' },
  { columnName: 'clientId', columnDesc: 'Client ID' },
  { columnName: 'warrantNumber', columnDesc: 'Warrant Number' },
];

  public allPaymentsGridActions(dataItem:any) {
   return [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Claim',
      disabled: ![PaymentStatusCode.Denied].includes(dataItem.paymentStatusCode),
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isAddEditClaimMoreClose) {
          this.isAddEditClaimMoreClose = true;
          this.onClickOpenAddEditClaimsFromModal(this.addEditClaimsDialog, data.paymentRequestId);
        }
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Claim',
      icon: 'undo',
      disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(dataItem.paymentStatusCode),
      click: (data: any): void => {
        if(![PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(data.paymentStatusCode))
        {
        if (!this.isUnBatchClaimsClosed) {
          this.isUnBatchClaimsClosed = true;
          this.selected = data;
          this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
        }
      }
    }
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchMoreOptionClosed) {
          this.isDeleteBatchMoreOptionClosed = true;
          this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialog);
        }
      },
    },
  ];
  }

  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'RECONCILE PAYMENTS',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'PRINT VISA AUTHORIZATIONS',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAuthorizationClicked = true;

        },
    },
  ];

  constructor(private route: Router,
    private dialogService: DialogService,
    private readonly lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private readonly vendorFacade : VendorFacade,
    private readonly financialVendorFacade : FinancialVendorFacade,
    private readonly financialPharmacyClaimsFacade : FinancialPharmacyClaimsFacade,
    private readonly drugsFacade: DrugsFacade,
    private readonly userManagementFacade: UserManagementFacade,) {}

  ngOnInit(): void {
    this.sortType = 'asc';
    this.addSearchSubjectSubscription();
    this.pharmacyClaimsAllPaymentsSubscription();
    this.vendorFacade.loadAllVendors(FinancialVendorTypeCode.Manufacturers).subscribe({
      next: (data: any) => {
        this.financialVendorFacade.manufacturerListSubject.next(data);
      }      
    });
  }

  pharmacyClaimsAllPaymentsSubscription() {
    this.pharmacyClaimsAllPaymentsGridLists$.subscribe((response:any) =>{
      this.totalGridRecordsCount = response?.spotsPaymentsQueryCount;
      if(this.selectAll){
      this.markAsChecked(response.data);
      }
      this.allPaymentsPrintAdviceLetterPagedList= response;
    })
  }

  updatePharmacyClaim(data: any) {
    this.updatePharmacyClaimEvent.emit(data);
    this.editPharmacyClaim$.pipe(first((editResponse: any ) => editResponse != null))
    .subscribe((editResponse: any) =>
    {
      if(editResponse)
      {
        this.loadPharmacyClaimsAllPaymentsListGrid();
        this.modalCloseAddEditClaimsFormModal(true)
      }
  
    })
  }

  searchPharmacies(searchText: any) {
    this.searchPharmaciesEvent.emit(searchText);
  }
  searchClients(searchText: any) {
    this.searchClientsEvent.emit(searchText);
  }
  searchDrug(searchText: string) {
    this.searchDrugEvent.emit(searchText);
  }

  getCoPaymentRequestTypeLov() {
    this.getCoPaymentRequestTypeLovEvent.emit();
  }
  getDrugUnitTypeLov() {
    this.getDrugUnitTypeLovEvent.emit();
  }
  addDrugEventHandler(event: any) {
    this.drugsFacade.addDrugData(event);
  }
  searchClientsDataEventHandler(client: any) {
    this.financialPharmacyClaimsFacade.searchClientsDataSubject.next(client);
  }
  searchPharmacyDataEventHandler(vendor: any) {
    this.financialPharmacyClaimsFacade.searchPharmaciesDataSubject.next(vendor)
  }
  loadManufacturerEvent(event: any) {
    this.vendorFacade.loadAllVendors(FinancialVendorTypeCode.Manufacturers).subscribe({
      next: (data: any) => {
        this.financialVendorFacade.manufacturerListSubject.next(data);
      }
    });
  }

  ngOnChanges(): void {
    this.sortType = 'asc';
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }


  resetGrid(){
    this.defaultGridState();
    this.sortValue = 'batchName';
    this.sortType = 'asc';
    this.sortDir = this.sortType === 'desc' ? 'Descending' : "Ascending";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  onExportClaims() {
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.filter)
    };

    this.exportGridEvent$.emit(params);
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
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
          const filteredColumns = f.filters?.filter((fld: any) => fld.value)?.map((fld: any) =>
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

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performSearch(searchValue);
      });
  }

  performSearch(data: any) {
    this.defaultGridState();
    let operator = 'contains'
    const isClientId = (['clientId']).includes(this.selectedSearchColumn);
    const isEntryDate = (['creationTime']).includes(this.selectedSearchColumn);
    if(isClientId){
      operator = 'contains';
    }else if(isEntryDate){
      operator = 'eq';
      data = this.isValidDate(data) ? this.intl.formatDate(
        new Date(data),
        this.configProvider?.appSettings?.dateFormat
      ): '01/01/0001';
    }
    const isDateSearch = data.includes('/');
    if(isDateSearch)
    {
      data = this.isValidDate(data) ? this.intl.formatDate(
        new Date(data),
        this.configProvider?.appSettings?.dateFormat
      ): '01/01/0001';
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ALL',
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
  private isValidDate = (searchValue: any) =>
  isNaN(searchValue) && !isNaN(Date.parse(searchValue));
  private loadPharmacyClaimsAllPaymentsListGrid(): void {
    const params = new GridFilterParam(this.state.skip, this.state.take, this.sortValue, this.sortType, JSON.stringify(this.filter))
    this.loadPharmacyClaimsAllPaymentsListEvent.emit(params);
  }
  loadClaimsAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPharmacyClaimsAllPaymentsGridLoaderShow = true;
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

  dataStateChange(stateData: any): void {
    this.isPageCountChanged = false;
    this.isPageChanged = true;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadPharmacyClaimsAllPaymentsListGrid();
    if(this.isPrintAuthorizationClicked){
      this.handleAllPaymentsGridData();
    }
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmacyClaimsAllPaymentsListGrid();
    if(this.isPrintAuthorizationClicked){
      this.handleAllPaymentsGridData();
    }
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  navToReconcilePayments(event : any){
    this.route.navigate(['/financial-management/pharmacy-claims/payments/reconcile-payments'],
     { queryParams :{loadType: LoadTypes.allPayments}});
  }


  public onPreviewSubmitPaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.PreviewSubmitPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) {
      this.PreviewSubmitPaymentDialog.close();
    }
  }

  onBulkOptionCancelClicked(){
    this.isRequestPaymentClicked = false;
    this.isPrintAuthorizationClicked = false;
    this.markAsUnChecked(this.allPaymentsPrintAdviceLetterPagedList?.data);
    this.markAsUnChecked(this.selectedAllPaymentsList?.PrintAdviceLetterSelected);
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
    this.selectedAllPaymentsList.PrintAdviceLetterUnSelected = [];
    this.selectAll = false;
    this.recordCountWhenSelectallClicked = 0;
    this.sendReportCount = 0;
    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full pharmacy_print_auth',
    });
  }


  onPrintAuthorizationCloseClicked(result: any) {
    if (result) {
      this.printAuthorizationDialog.close();
    }
  }
  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.addClientRecentClaimsDialog.close();
  }


  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown> ,data:any
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
    this.clientName=data.clientFullName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }


  onViewProviderDetailClicked(template: TemplateRef<unknown>): void {
    this.providerDetailsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }


  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.isDeleteBatchMoreOptionClosed = false;
      this.deleteClaimsDialog.close();
    }
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>, paymentRequestId: any): void {
    if(paymentRequestId !== '00000000-0000-0000-0000-000000000000')
    {
    this.getPharmacyClaimEvent.emit(paymentRequestId);
    }
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.isAddEditClaimMoreClose = false;
      this.addEditClaimsFormDialog.close();
    }
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentStatus') {
      this.paymentStatusFilter = value;
    }
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

  onColumnReorder($event: any) {
    this.isColumnsReordered = true;
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  selectionChange(dataItem:any, selected:boolean){
    if(!selected){
      this.onRecordSelectionChecked(dataItem);
    }
    else{
      this.onRecordSelectionUnChecked(dataItem);
    }
      this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedProcessRequest,
      'PrintAdviceLetterSelected':this.checkedAndUncheckedRecordsFromSelectAll,'print':true,
      'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'};
    if(this.selectAll){
      if(this.unCheckedProcessRequest?.length > 0){
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      }else{
      this.recordCountWhenSelectallClicked = selected ? this.recordCountWhenSelectallClicked + 1 : this.recordCountWhenSelectallClicked - 1;
      this.sendReportCount = this.recordCountWhenSelectallClicked;
      }
    }else{
      this.sendReportCount = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.filter((item: any) => item.selected).length;
   }
    this.cdr.detectChanges();
}

  onRecordSelectionUnChecked(dataItem: any) {
    this.unCheckedProcessRequest = this.unCheckedProcessRequest.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);
      this.currentPageRecords?.forEach((element: any) => {
        if (element.paymentRequestId === dataItem.paymentRequestId) {
          element.selected = true;
        }
      });
      const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
      if (exist === 0) {
        this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true, 'batchId': dataItem.batchId });
      }else{
        const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
        if (recordIndex !== -1) {
          this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
        }
      }
  }

  onRecordSelectionChecked(dataItem: any) {
    this.unCheckedProcessRequest.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true});
        this.currentPageRecords?.forEach((element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        });
        const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
        if (exist === 0) {
          this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': false, 'batchId': dataItem.batchId });
        }else{
          const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
          if (recordIndex !== -1) {
            this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
          }
        }
  }

  selectionAllChange(){
    this.unCheckedProcessRequest=[];
    this.checkedAndUncheckedRecordsFromSelectAll=[];
    if(this.selectAll){
      this.markAsChecked(this.allPaymentsPrintAdviceLetterPagedList?.data);
    }
    else{
      this.markAsUnChecked(this.allPaymentsPrintAdviceLetterPagedList?.data);
    }
    this.selectedAllPaymentsList = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedProcessRequest,
    'PrintAdviceLetterSelected':this.checkedAndUncheckedRecordsFromSelectAll,'print':true,
    'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'};
    this.cdr.detectChanges();
    if(this.selectAll){
      if(this.unCheckedProcessRequest?.length > 0){
        this.sendReportCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.sendReportCount;
      }else{
        this.sendReportCount = this.totalGridRecordsCount;
      }
    }else{
    this.getSelectedReportCount(this.selectedAllPaymentsList?.PrintAdviceLetterSelected);
  }
  }

  markAsChecked(data:any){
    data.forEach((element:any) => {
      if(this.selectAll){
        element.selected = true;
      }
      else{
        element.selected = false;
      }
      if(this.unCheckedPaymentRequest.length>0 || this.selectedDataIfSelectAllUnchecked.length >0)   {
        const itemMarkedAsUnChecked=   this.unCheckedPaymentRequest.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        if(itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined){
          element.selected = false;
        }
        const itemMarkedAsChecked = this.selectedDataIfSelectAllUnchecked.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        if(itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined){
          element.selected = true;
        }
      }

    });

  }

  markAsUnChecked(data:any){
    data.forEach((element:any) => {
      element.selected = false;
  });
  }

  getSelectedReportCount(selectedSendReportList : []){
    this.sendReportCount = selectedSendReportList?.length;
  }

    loadEachLetterTemplate(event:any){
      this.loadTemplateEvent.emit(event);
    }

    onbatchNumberClick(dataItem: any) {
        this.route.navigate(
            [`/financial-management/pharmacy-claims/batch`],
            { queryParams: { bid: dataItem?.batchId } }
        );
    }

    handleAllPaymentsGridData() {
      this.pharmacyClaimsAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        if (data?.total >= 0 || data?.total === -1) {
          this.gridLoaderSubject.next(false);
        }
        this.pharmacyClaimsAllPaymentsGridLists = this.gridDataResult?.data;
        if(this.recordCountWhenSelectallClicked == 0){
          this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
          this.totalGridRecordsCount = this.gridDataResult?.total;
        }
        if(!this.selectAll)
        {
        this.pharmacyClaimsAllPaymentsGridLists.forEach((item1: any) => {
          const matchingGridItem = this.selectedAllPaymentsList?.PrintAdviceLetterSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
          if (matchingGridItem) {
            item1.selected = true;
          } else {
            item1.selected = false;
          }
        });
      }
      this.currentPageRecords = this.pharmacyClaimsAllPaymentsGridLists;
      //If the user is selecting the individual check boxes and changing the page count
      this.handlePageCountSelectionChange();
      //If the user click on select all header and either changing the page number or page count
      this.pageNumberAndCountChangedInSelectAll();
      this.gridLoaderSubject.next(false);
      });
    }

    handlePageCountSelectionChange() {
      if(!this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
        // Extract the payment request ids from grid data
        const idsToKeep: number[] = this.checkedAndUncheckedRecordsFromSelectAll.map((item: any) => item.paymentRequestId);
        // Remove items from selected records based on the IDs from grid data
        for (let i = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.length - 1; i >= 0; i--) {
          if (!idsToKeep.includes(this.selectedAllPaymentsList?.PrintAdviceLetterSelected[i].paymentRequestId)) {
            this.selectedAllPaymentsList?.PrintAdviceLetterSelected.splice(i, 1); // Remove the item at index i
          }
        }
        this.getSelectedReportCount(this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.filter((item:any) => item.selected));
      }
  }

  pageNumberAndCountChangedInSelectAll() {
    //If selecte all header checked and either the page count or the page number changed
    if(this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
      this.selectedAllPaymentsList = [];
      this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
      for (const item of this.pharmacyClaimsAllPaymentsGridLists) {
        // Check if the item is in the second list.
        const isItemInSecondList = this.unCheckedProcessRequest.find((item2 :any) => item2.paymentRequestId === item.paymentRequestId);
        // If the item is in the second list, mark it as selected true.
        if (isItemInSecondList) {
          item.selected = false;
        }else{
          item.selected = true;
        }
      }
    }
  }
  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }

  loadRecentClaimListEventHandler(data: any) {
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
  }

    onUnBatchPaymentCloseClicked(result: any) {
      if (result) {
          this.handleUnbatchClaims();
          this.unBatchClaimsEvent.emit({
            paymentId : this.selected.paymentRequestId,
          })
      }
      this.isBulkUnBatchOpened = false;
      this.isUnBatchClaimsClosed = false;
      this.UnBatchDialog.close();
    }

    handleUnbatchClaims() {
      this.unbatchClaim$
        .pipe(first((unbatchResponse: any) => unbatchResponse != null))
        .subscribe((unbatchResponse: any) => {
          if (unbatchResponse ?? false) {
            this.loadPharmacyClaimsAllPaymentsListGrid();
          }
        });
    }
}
