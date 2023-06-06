import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-contacts-details',
  templateUrl: './contacts-details.component.html',
  styleUrls: ['./contacts-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
