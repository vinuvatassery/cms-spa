import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-pharmacy-claims-reverse-claims',
  templateUrl: './pharmacy-claims-reverse-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsReverseClaimsComponent { 
  @Output() reverseClaimsCloseClickedEvent = new EventEmitter();
  public formUiStyle: UIFormStyle = new UIFormStyle();
 
  closeReverseClicked() {
    this.reverseClaimsCloseClickedEvent.emit(true);
  }
}
