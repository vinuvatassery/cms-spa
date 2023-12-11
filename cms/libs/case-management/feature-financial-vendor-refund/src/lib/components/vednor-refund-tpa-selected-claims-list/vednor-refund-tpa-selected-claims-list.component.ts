import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { formatDate } from '@progress/kendo-angular-intl';
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
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
        if(!( x.refundedWarrantNumber && x.refundedAmount && !x.refundAmountExeedError)){
          this.isError = true
           x.refundWarantNumberError = !x.refundedWarrantNumber
           x.refundedAmountError = !x.refundedAmount

        }
      })
      if(this.isError)
      return;
      this.tpaPayload.emit( this.tpaRefundGridLists)
    })
  }

  onRefundNoteValueChange(event:any, type:any, item:any){
    switch (type) {

      case ColumnNames.RefundedWarrantNumber:
         item.refundWarantNumberError = event && event.length <=0
       break;
    case ColumnNames.RefundedAmount:
       item.refundedAmountError = event && event <=0
       item.refundAmountExeedError = item.totalAmount < event;
     break;
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
    return new Date(formatDate(new Date(value), 'MM-dd-yyyy'));
  }


}
