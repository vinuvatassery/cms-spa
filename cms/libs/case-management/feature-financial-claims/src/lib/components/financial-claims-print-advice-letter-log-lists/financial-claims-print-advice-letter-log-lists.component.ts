import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';

@Component({
  selector: 'cms-financial-claims-print-advice-letter-log-lists',
  templateUrl:
    './financial-claims-print-advice-letter-log-lists.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPrintAdviceLetterLogListsComponent implements OnInit, OnChanges{ 


  @Input() batchLogGridLists$: any;
  @Input() claimsType: any;
  @Output() loadPrintAdviceLetterEvent = new EventEmitter<any>();
  @Output() selectUnSelectEvent = new EventEmitter<any>();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public state!: State;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  sortColumn = 'paymentNbr';
  sortDir = 'Ascending';
  sortColumnName = '';
  @Input() pageSizes: any;
  @Input() sort: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() loader$!: Observable<boolean>;
  @Output()  noOfRecordToPrintEvent = new EventEmitter();;
  batchLogPrintAdviceLetterPagedList:any;
  isBatchLogGridLoaderShow = false;
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  paymentMethods = ['CHECK', 'ACH', 'SPOTS'];
  paymentTypes = ['PAYMENT', 'REFUND', 'COPAYMENT', 'DEDUCTIBLE', 'FULL PAY'];
  paymentStatusList = ['SUBMITTED', 'PENDING_APPROVAL', 'DENIED', 'MANAGER_APPROVED', 'PAYMENT_REQUESTED', 'ONHOLD', 'FAILED', 'PAID'];
  paymentMethodFilter:string ='';
  paymentTypeFilter:string ='';
  paymentStatusFilter:string='';
  selectAll:boolean=false;
  unCheckedPaymentRequest:any=[];
  selectedDataIfSelectAllUnchecked:any=[];
  currentGridFilter:any;
  totalRecord:any;
  noOfRecordToPrint:any;
  gridColumns : {[key: string]: string} = {
    paymentNbr: 'Item #',
    invoiceNbr: 'Invoice ID',
    vendorName: 'Provider Name',
    tin: 'Tax ID',
    clientId: 'Member ID',
    clientFullName: 'Client Name',
    nameOnInsuranceCard:'Name on Primary Insurance Card',
    serviceCount: 'Service Count',
    serviceCost: 'Total Cost',
    amountDue: 'Total Due',
    paymentMethodCode:'Payment Method',
    paymentTypeCode:'Payment Type',
    paymentStatusCode:'Payment Status',
    clientMaximum:'Client Annual Total',
    balanceAmount:'Client Balance'
  };

  constructor(private route: Router,private dialogService: DialogService, public activeRoute: ActivatedRoute ) {}
  
  ngOnInit(): void {
    this.sortColumnName = 'Item #';
    this.loadBatchLogListGrid();
    this.batchLogGridLists$.subscribe((response:any) =>{
      this.totalRecord = response.total;
      this.markAsChecked(response.data);
      this.batchLogPrintAdviceLetterPagedList = response;
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
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

  selectionChange(dataItem:any,selected:boolean){
    if(!selected){
      this.noOfRecordToPrint = this.noOfRecordToPrint - 1;
      this.noOfRecordToPrintEvent.emit(this.noOfRecordToPrint);
      this.unCheckedPaymentRequest.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true});
      if(!this.selectAll){
      this.selectedDataIfSelectAllUnchecked = this.selectedDataIfSelectAllUnchecked.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);

      }
    }
    else{
      this.noOfRecordToPrint = this.noOfRecordToPrint + 1;
      this.noOfRecordToPrintEvent.emit(this.noOfRecordToPrint);
      this.unCheckedPaymentRequest = this.unCheckedPaymentRequest.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);
      if(!this.selectAll){
      this.selectedDataIfSelectAllUnchecked.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true});
      }          
    }
    let returnResult = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedPaymentRequest,
    'PrintAdviceLetterSelected':this.selectedDataIfSelectAllUnchecked,'print':true,
    'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'}
    this.selectUnSelectEvent.emit(returnResult); 
   
  }

  selectionAllChange(){
    this.unCheckedPaymentRequest=[];
    this.selectedDataIfSelectAllUnchecked=[];
    if(this.selectAll){
      this.markAsChecked(this.batchLogPrintAdviceLetterPagedList.data);
      this.noOfRecordToPrint = this.totalRecord;
      this.noOfRecordToPrintEvent.emit(this.noOfRecordToPrint);
    }
    else{
      this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList.data);
      this.noOfRecordToPrint = 0;
      this.noOfRecordToPrintEvent.emit(this.noOfRecordToPrint);
    }
    let returnResult = {'selectAll':this.selectAll,'PrintAdviceLetterUnSelected':this.unCheckedPaymentRequest,
    'PrintAdviceLetterSelected':this.selectedDataIfSelectAllUnchecked,'print':true,
    'batchId':null,'currentPrintAdviceLetterGridFilter':null,'requestFlow':'print'}
    this.selectUnSelectEvent.emit(returnResult);
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
        let itemMarkedAsUnChecked=   this.unCheckedPaymentRequest.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        if(itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined){
          element.selected = false;    
        }
        let itemMarkedAsChecked = this.selectedDataIfSelectAllUnchecked.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
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
  private loadBatchLogListGrid(): void {
    this.loadBatchLog(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadBatchLog(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: this.sortColumn ?? 'paymentNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.filter
    };  
    this.loadPrintAdviceLetterEvent.emit(gridDataRefinerValue);
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field
    this.sortColumnName = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    this.loadBatchLogListGrid();
  }

  paymentClickHandler(paymentRequestId: string){
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([this.route.url.split('?')[0] , 'items'], {
      queryParams: { bid: batchId, pid: paymentRequestId}
    }); 
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    if(field === 'paymentMethodCode'){
      this.paymentMethodFilter = value;
    }
    else if(field === 'paymentTypeCode'){
      this.paymentTypeFilter = value;
    }
    else if(field === 'paymentStatusCode'){
      this.paymentStatusFilter = value;
    }

    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value
      }],
        logic: "or"
    });
  }


}
