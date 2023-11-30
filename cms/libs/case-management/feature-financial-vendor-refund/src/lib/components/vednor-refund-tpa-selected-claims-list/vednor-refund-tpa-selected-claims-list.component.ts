import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { formatDate } from '@progress/kendo-angular-intl';
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { forkJoin, map } from 'rxjs';
import {ColumnNames } from '@cms/case-management/domain'


@Component({
  selector: 'cms-vednor-refund-tpa-selected-claims-list',
  templateUrl: './vednor-refund-tpa-selected-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VednorRefundTpaSelectedClaimsListComponent implements OnInit{

  @Input() tpaAddRefundClick$!: any
  @Input() tpaRefundGridLists: any[]=[];
  @Input() tpaRefundInformation$: any
  
  @Output() tpaRefundInformationConfirmClicked = new EventEmitter<any>();
  @Output() onTpaClaimsDeleteEvent = new EventEmitter<any>()
  @Input() isEdit = false
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() tpaPremiumPaymentReqIds: any[] = [];
  @Output() tpaPayload = new EventEmitter<any>()
  isError =false;
  public format: FormatSettings = {
    displayFormat: "dd/MM/yyyy",
    inputFormat: "yyyy-MM-dd'T'HH:mm:ss",
  };
  
   Datevalue: Date = new Date(2000, 2, 10);
  public constructor(private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef) {

  }
  ngOnInit(): void {
  
  
    if (!this.isEdit) {
      this.tpaRefundInformationConfirmClicked.emit(
        {
          paymentRequestIds: this.tpaPremiumPaymentReqIds
        }
      );
      }

    this.tpaAddRefundClick$.subscribe((res:any) =>{
      this.changeDetectorRef.markForCheck()
      this.isError = false
      this.tpaRefundGridLists.forEach(x=>{
        if(!(x.voucherPayableNbr && x.refundedWarrantNumber && x.creditNbr && x.refundedAmount)){
          this.isError = true
           x.voucherPayableNbrError = !x.voucherPayableNbr
           x.refundWarantNumberError = !x.refundedWarrantNumber
           x.refundedAmountError = !x.refundedAmount
           x.creditNbrError = !x.creditNbr
           
        }
      })
      if(this.isError)
      return;
      this.tpaPayload.emit( this.tpaRefundGridLists)
    })
  }

  onRefundNoteValueChange(event:any, type:any, item:any){
    switch (type) {
      case ColumnNames.VoucherPayableNbr: {
         if(event && event.length >0){
          item.voucherPayableNbrError = false
         }else{
          item.voucherPayableNbrError = true
         }
        break;
      }
        case ColumnNames.CreditNbr: {
          if(event && event.length >0){
           item.creditNbrError = false
          }else{
           item.creditNbrError = true
          }
         break;
      }
      case ColumnNames.RefundedWarrantNumber: {
        if(event && event.length >0){
         item.refundWarantNumberError = false
        }else{
         item.refundWarantNumberError = true
        }
       break;
    }
    case ColumnNames.RefundedAmount: {
      if(event && event >0){
       item.refundedAmountError = false
      }else{
       item.refundedAmountError = true
      }
     break;
  }
    }
  }
 

  onDeleteClick(index:number){
    this.tpaRefundGridLists.splice(index,1)
    if(this.tpaRefundGridLists.length >0){
     this.onTpaClaimsDeleteEvent.emit([this.tpaRefundGridLists.map(x=> x.paymentRequestId).join(',')])  
    }else{
      this.onTpaClaimsDeleteEvent.emit([])
    } 
  }

  getDate(value:any){
   
    console.log( formatDate(new Date(value), 'MM-dd-yyyy'))
    return new Date(formatDate(new Date(value), 'MM-dd-yyyy'));
  }


}
