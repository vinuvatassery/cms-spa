/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';

import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-deactivate-pharmacy',
  templateUrl: './deactivate-pharmacy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivatePharmacyComponent {
  @Output() closeDeactivatePharmacies = new EventEmitter();
  @Input() clientPharmacyDetails!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  onCloseDeactivatePharmaciesClicked() {
    this.closeDeactivatePharmacies.emit();
  }
}
