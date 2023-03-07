/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-hiv-verification',
  templateUrl: './hiv-verification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationComponent {
  /** Public properties **/
  rdoVerificationMethod!: string;
}
