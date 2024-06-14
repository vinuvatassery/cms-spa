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
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { InsurancePremiumDetails, PaymentDetail, PaymentPanel } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-premiums-batch-list-detail-items',
  templateUrl: './financial-premiums-batch-list-detail-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchListDetailItemsComponent implements OnInit, OnChanges {

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('unbatchPremiumFromTemplate', { read: TemplateRef })
  unbatchPremiumFromTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumFromTemplate', { read: TemplateRef })
  removePremiumFromTemplate!: TemplateRef<any>;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogItemsGridLoaderShow = false;
  @Input() paymentPanelData$:any;
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchItemsGridLists$: any;
  @Input() itemsListGridLoader$!: Observable<boolean>;;
  @Input() vendorAddressId:any;
  @Input() batchId:any ;
  @Input() paymentDetails$!: Observable<PaymentDetail>;
  @Input() vendorProfile$ :any;
  @Input() updateProviderPanelSubject$:any
  @Input() ddlStates$ :any
  @Input() paymentMethodCode$ :any
  @Input() exportButtonShow$ : any
  @Input() vendorId :any
  @Input() paymentRequestId : any

  @Output() loadBatchItemsListEvent = new EventEmitter<any>();
  @Output() loadPaymentPanel = new EventEmitter<any>();
  @Output()  updatePaymentPanel  = new EventEmitter<PaymentPanel>();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Output() onEditProviderProfileEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Input() insurancePremium$!: Observable<InsurancePremiumDetails>;
  @Output() updatePremiumEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  sortColumnDesc = '';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn: null | string = 'ALL';
  gridDataResult!: GridDataResult;
  premiumPaymentDetails: any;
  providerDetailsDialog: any;
  paymentDetailsDialog: any;
  editPremiumsFormDialog: any;
  unBatchPremiumDialog: any;
  removePremiumDialog: any;
  isEditPremiumsOpened = false;
  unBatchPremiumsOpened = false;
  removePremiumsOpened = false;
  gridClaimsBatchLogItemsDataSubject = new Subject<any>();
  gridClaimsBatchLogItemsData$ = this.gridClaimsBatchLogItemsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  serviceGridColumnName = '';
  showExportLoader = false;
  private addClientRecentPremiumsDialog: any;
  clientName:any;
  clientId:any;
  gridColumns : {[key: string]: string} = {
    ALL: 'All Columns',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    paymentStatus: 'Payment Status',
    clientId: 'Client ID',
    planName: 'Plan Name',
    insuranceType: 'Insurance Type',
    coverageStartDate: 'Coverage Dates',
    premiumAmt: 'Premium Amount'
  };

  dropDowncolumns : any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'insuranceName',
      columnDesc: 'Name on Primary Insurance Card',
    },
    {
      columnCode: 'paymentStatus',
      columnDesc: 'Payment Status',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'planName',
      columnDesc: 'Plan Name',
    },
    {
      columnCode: 'insuranceType',
      columnDesc: 'Insurance Type',
    },
    {
      columnCode: 'coverageStartDate',
      columnDesc: 'Coverage Dates',
    },
    {
      columnCode: 'premiumAmt',
      columnDesc: 'Premium Amount',
    }
  ];

  public batchItemGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Premium',
      icon: 'edit',
      click: (data: any): void => {

        if (!this.isEditPremiumsOpened) {
          this.isEditPremiumsOpened = true;
          this.insurancePremiumId = data.insurancePremiumId;
          this.clientId=data.clientId;
          this.onClickOpenEditPremiumsFromModal(this.editPremiumsDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Premium',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.unBatchPremiumsOpened) {
          this.unBatchPremiumsOpened = true;
          this.onClickOpenUnbatchPremiumModal(this.unbatchPremiumFromTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premium',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.removePremiumsOpened) {
          this.removePremiumsOpened = true;
          this.onClickOpenRemovePremiumModal(this.removePremiumFromTemplate);
        }
      },
    },
  ];

  paymentStatusFilter = '';
  insurancePremiumId:any = '';
  @Output() loadPremiumEvent = new EventEmitter<string>();
  /** Constructor **/
  constructor(private route: Router,
    private dialogService: DialogService,
    public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.serviceGridColumnName = this.premiumsType.charAt(0).toUpperCase() + this.premiumsType.slice(1);
    this.gridColumns['serviceDesc'] = `${this.serviceGridColumnName} Service`;
    this.initializeGridState();
    this.loadBatchLogItemsListGrid();
    
  }
  ngOnChanges(): void {
    this.paymentPanelData$.subscribe((data: any)=>{
      this.premiumPaymentDetails = data;
      this.cd.detectChanges();
    });
    this.initializeGridState();
    this.loadPaymentPanel.emit(true);
  }

  private initializeGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'clientFullName', dir: 'desc' }],
    };
    this.sortColumnDesc = 'Client Name';
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
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadBatchItemsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }


  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'clientId' ||
      this.selectedColumn === 'premiumAmt'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'ALL',
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
    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.gridColumns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
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

  gridDataHandle() {
    this.batchItemsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsBatchLogItemsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isBatchLogItemsGridLoaderShow = false;
      }
    });
    this.isBatchLogItemsGridLoaderShow = false;
  }

  onClickedExport(){
    this.showExportLoader = true
    this.exportGridDataEvent.emit()

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

  backToBatchLog(event : any){
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType +'/batch'],
    { queryParams :{bid: batchId}} );
  }


  onViewProviderDetailClicked(): void {
    this.onProviderNameClickEvent.emit();
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
      this.paymentDetailsDialog.close();
    }
  }


  onClickOpenEditPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.editPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_premiums_modal',
    });
  }
  modalCloseEditPremiumsFormModal(result: any) {
    if (result) {
      this.isEditPremiumsOpened = false;
      this.editPremiumsFormDialog.close();
    }
  }


  onClickOpenUnbatchPremiumModal(template: TemplateRef<unknown>): void {
    this.unBatchPremiumDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  modalCloseUnbatchPremiumModal(result: any) {
    if (result) {
      this.unBatchPremiumsOpened = false;
      this.unBatchPremiumDialog.close();
    }
  }


  onClickOpenRemovePremiumModal(template: TemplateRef<unknown>): void {
    this.removePremiumDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  modalCloseRemovePremiumModal(result: any) {
    if (result) {
      this.removePremiumsOpened = false;
      this.removePremiumDialog.close();
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

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    dataItem: any
  ): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
     this.clientId=dataItem.clientId;
     this.clientName=dataItem.clientFullName;
  }

  closeRecentPremiumsModal(result: any){
    if (result) {
      this.addClientRecentPremiumsDialog.close();
    }
  }
  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentPremiumsModal(true);
  }
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event);
  }
  
  loadPremium(premiumId: string) {
    this.loadPremiumEvent.emit(premiumId);
  }

  updatePremium(data: any) {
    this.updatePremiumEvent.emit(data);
  }

}
