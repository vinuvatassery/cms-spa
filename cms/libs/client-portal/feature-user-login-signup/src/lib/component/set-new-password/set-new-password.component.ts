import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'client-portal-set-new-password',
  templateUrl: './set-new-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetNewPasswordComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isNewPasswordSaved = false;

  onCloseNewPasswordSavedClicked(){
    this.isNewPasswordSaved = false;
  }
  onOpenNewPasswordSavedClicked(){
    this.isNewPasswordSaved = true;
  }
}
