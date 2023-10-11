import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-pharmacy-claims-payment-details-form',
  templateUrl: './pharmacy-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()
  @Input() paymentRequestId :any
  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();

 
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(this.paymentRequestId)
  }
}
