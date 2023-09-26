/** Angular **/
import {
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {  State,} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-financial-premiums-batches-log-invoice-lists',
  templateUrl: './financial-premiums-batches-log-invoices-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesLogInvoiceListsComponent  implements OnChanges
{ 
   @Input() paymentRequestId : any
   @Input() batchLogServicesData$ : any
   @Input() pageSizes : any
   @Output() loadFinancialPremiumBatchInvoiceListEvent = new EventEmitter<any>();
   gridFinancialPremiumInvoiceSubject = new Subject<any>();
   gridFinancialPremiumInvoice$ =  this.gridFinancialPremiumInvoiceSubject.asObservable();

   isFinancialPremiumInvoiceGridLoaderShow = false
   public state!: State;  
   sortType ="asc"
   sort = 'clientFullName'
   gridDataResult!: GridDataResult;
   public formUiStyle: UIFormStyle = new UIFormStyle();

      ngOnChanges(): void {            
        this.state = {
          skip: 0,
          take: 5,
          sort:  [
            {
              field: 'clientFullName',
            },
          ]
        };    
        this.loadFinancialInvoiceListGrid();
      }


      loadPremiumBatchesInvoices(
        paymentRequestId : string,
        skipCountValue: number,
        maxResultCountValue: number,
        sortValue: string,
        sortTypeValue: string
      ) {
        this.isFinancialPremiumInvoiceGridLoaderShow = true;
        const gridDataRefinerValue = {
          paymentRequestId : paymentRequestId,
          skipCount: skipCountValue,
          pagesize: maxResultCountValue,
          sortColumn: sortValue,
          sortType: sortTypeValue    
        };
        this.loadFinancialPremiumBatchInvoiceListEvent.emit(gridDataRefinerValue);
        this.gridDataHandle();
      }

      gridDataHandle() {
        this.batchLogServicesData$.subscribe((data: GridDataResult) => {      
          this.gridDataResult = data;    
          this.gridFinancialPremiumInvoiceSubject.next(this.gridDataResult);
          if (data?.total >= 0 || data?.total === -1) {
            this.isFinancialPremiumInvoiceGridLoaderShow = false;
          }
        });
      
      }
    
      loadFinancialInvoiceListGrid()
      {
        this.loadPremiumBatchesInvoices(
            this.paymentRequestId,
            this.state?.skip ?? 0,
            this.state?.take ?? 0,
            this.sort,
            this.sortType
          );
      }

      pageSelectionchange(data : any)
      {
        this.state.take = data.value;
        this.state.skip = data?.skip;
        this.loadFinancialInvoiceListGrid();
      }

      dataStateChange(stateData : any)
      {     
        this.state = stateData;       
        this.loadFinancialInvoiceListGrid();
      }
}
