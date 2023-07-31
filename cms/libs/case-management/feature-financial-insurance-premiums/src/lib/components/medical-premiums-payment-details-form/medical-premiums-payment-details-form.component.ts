import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-medical-premiums-payment-details-form',
  templateUrl: './medical-premiums-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()

  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();

 
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
}
