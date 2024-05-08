import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-add-folder',
  templateUrl: './add-folder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFolderComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
