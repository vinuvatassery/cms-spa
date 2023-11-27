import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-vednor-refund-tpa-selected-claims-list',
  templateUrl: './vednor-refund-tpa-selected-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VednorRefundTpaSelectedClaimsListComponent implements OnInit {

  @Input() tpaAddRefundClick$!: any
  tpaRefundGridLists!: any[];
  @Input() tpaRefundInformation$: any
  @Output() tpaRefundInformationConfirmClicked = new EventEmitter<any>();
  @Input() isEdit = false
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() tpaPremiumPaymentReqIds: any[] = [];
  @Output() tpaPayload = new EventEmitter<any>()
  public constructor(private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef) {

  }
  ngOnInit(): void {

    console.log(this.tpaRefundGridLists)
    this.tpaRefundInformation$.subscribe((res: any) => {
      this.changeDetectorRef.markForCheck()
      this.tpaRefundGridLists = res.data
      console.log(this.tpaRefundGridLists)
    })
    if (!this.isEdit) {
      this.tpaRefundInformationConfirmClicked.emit(
        {
          paymentRequestIds: this.tpaPremiumPaymentReqIds
        }
      );
    }

    this.tpaAddRefundClick$.subscribe((res:any) =>{
      this.changeDetectorRef.markForCheck()
      this.tpaPayload.emit( this.tpaRefundGridLists)
    })
  }

  onDeleteClick(index:number){
    this.tpaRefundGridLists.splice(index,1)
  }
}
