import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-premiums-payment-details-form',
  templateUrl: './financial-premiums-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()

  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();

 
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
}
