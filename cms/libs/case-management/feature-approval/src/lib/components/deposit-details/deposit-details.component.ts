import { Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'productivity-tools-deposit-details',
  templateUrl: './deposit-details.component.html',
})
export class DepositDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
