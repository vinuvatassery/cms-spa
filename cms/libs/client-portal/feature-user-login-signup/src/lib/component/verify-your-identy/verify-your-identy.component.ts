import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'client-portal-verify-your-identy',
  templateUrl: './verify-your-identy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyYourIdentyComponent { 
  
 
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isShowEmailAddress = false;
}
