import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-pharmacy-claims-payment-details-form',
  templateUrl: './pharmacy-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()

  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();

 
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
}
