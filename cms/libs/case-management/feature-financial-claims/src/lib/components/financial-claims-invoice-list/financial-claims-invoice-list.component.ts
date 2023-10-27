/** Angular **/
import {ChangeDetectionStrategy, Component, EventEmitter, Input,OnChanges, Output} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subject, take } from 'rxjs';


  @Component({
    selector: 'cms-financial-claims-invoice-list',
    templateUrl: './financial-claims-invoice-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FinancialClaimsInvoiceListComponent implements OnChanges {
   @Input() paymentRequestId : any
   @Input() financialInvoiceList$ : any
   @Input() sort : any
   @Input() claimsType: any;
   @Output() loadFinancialClaimsInvoiceListEvent = new EventEmitter<any>();
   gridFinancialClaimsInvoiceSubject = new Subject<any>();
   gridFinancialClaimsInvoice$ =  this.gridFinancialClaimsInvoiceSubject.asObservable();
   serviceTitle = ''
   isFinancialClaimsInvoiceGridLoaderShow = false
   public state!: State;
   sortType ="asc"
   gridDataResult!: GridDataResult;
   public formUiStyle: UIFormStyle = new UIFormStyle();

      ngOnChanges(): void {
        this.state = {
          skip: 0,
          take: 5,
          sort: this.sort,
        };
       this.serviceTitle = this.claimsType+' Service'
        this.loadFinancialInvoiceListGrid();
      }


      loadClaimsInvoices(
        paymentRequestId : string,
        skipCountValue: number,
        maxResultCountValue: number,
        sortValue: string,
        sortTypeValue: string
      ) {
        this.isFinancialClaimsInvoiceGridLoaderShow = true;
        const gridDataRefinerValue = {
          paymentRequestId : paymentRequestId,
          skipCount: skipCountValue,
          pagesize: maxResultCountValue,
          sortColumn: sortValue,
          sortType: sortTypeValue
        };
        this.loadFinancialClaimsInvoiceListEvent.emit(gridDataRefinerValue);
        this.gridDataHandle();
      }

      gridDataHandle() {
        this.financialInvoiceList$.pipe(take(1)).subscribe((data: GridDataResult) => {
          this.gridDataResult = data;
          this.gridFinancialClaimsInvoiceSubject.next(this.gridDataResult);
          if (data?.total >= 0 || data?.total === -1) {
            this.isFinancialClaimsInvoiceGridLoaderShow = false;
          }
        });

      }

      loadFinancialInvoiceListGrid()
      {
        this.loadClaimsInvoices(
            this.paymentRequestId,
            this.state?.skip ?? 0,
            this.state?.take ?? 0,
            this.sort,
            this.sortType
          );
      }
  }


