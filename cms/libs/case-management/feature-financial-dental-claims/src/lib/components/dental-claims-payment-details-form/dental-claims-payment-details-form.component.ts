import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-dental-claims-payment-details-form',
  templateUrl: './dental-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()

  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();

 
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
}
