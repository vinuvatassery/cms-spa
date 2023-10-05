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
  ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { PaymentDetail, PaymentPanel } from '@cms/case-management/domain';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
@Component({
  selector: 'cms-financial-claims-batch-list-detail-items',
  templateUrl: './financial-claims-batch-list-detail-items.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchListDetailItemsComponent implements OnInit, OnChanges {
 
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
  @Input() vendorProfile$ :any;
  @Input() updateProviderPanelSubject$:any
  @Input() ddlStates$ :any
  @Input() paymentMethodCode$ :any
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

  gridColumns : {[key: string]: string} = {
            clientFullName: 'Client Name',
            nameOnInsuranceCard: 'Name on Primary Insurance Card',
            paymentStatus: 'Payment Status',
            clientId: 'Member ID',
            serviceStartDate: 'Service Date',
            cptCode: 'CPT Code',
            serviceDesc:'',
            serviceCost: 'Service Cost',
            amountDue: 'Client Co-Pay',
            creationTime: 'Entry Date',
            invoiceNbr:'Invoice ID'
          };
    
  paymentStatusList = ['SUBMITTED', 'PENDING_APPROVAL', 'DENIED', 'MANAGER_APPROVED', 'PAYMENT_REQUESTED', 'ONHOLD', 'FAILED', 'PAID'];
  paymentStatusFilter = '';
  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService, 
    public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef) {
    
    }
  
  ngOnInit(): void { 
    this.serviceGridColumnName = this.claimsType.charAt(0).toUpperCase() + this.claimsType.slice(1);
    this.gridColumns['serviceDesc'] = `${this.serviceGridColumnName} Service`;
    this.initializeGridState();
    this.loadBatchLogItemsListGrid();   
   
  }
  ngOnChanges(): void {
    this.paymentPanelData$.subscribe((data: any)=>{
      this.paymentPanelDetails = data;
      this.cd.detectChanges();
    })

    this.initializeGridState();
    this.loadPaymentPanel.emit(true);
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
    debugger
    this.getProviderPanelEvent.emit(event)
  }

  updateProviderProfile(event:any){
    debugger
    this.updateProviderProfileEvent.emit(event)
  }

  OnEditProviderProfileClick(){
    debugger
   this.onEditProviderProfileEvent.emit()
  }

  private initializeGridState(){
    debugger
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'creationTime', dir: 'desc' }],
    };
    this.sortColumnDesc = 'Entry Date';
  }
}
