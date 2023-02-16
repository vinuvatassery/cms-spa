import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-ps-mfr-zip-detail',
  templateUrl: './ps-mfr-zip-detail.component.html',
  styleUrls: ['./ps-mfr-zip-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsMfrZipDetailComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
