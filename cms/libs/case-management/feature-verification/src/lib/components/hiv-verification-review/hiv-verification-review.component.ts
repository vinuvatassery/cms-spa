/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';   
@Component({
  selector: 'case-management-hiv-verification-review',
  templateUrl: './hiv-verification-review.component.html',
  styleUrls: ['./hiv-verification-review.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationReviewComponent {

  public formUiStyle : UIFormStyle = new UIFormStyle();
}
