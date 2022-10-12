/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-hiv-verification',
  templateUrl: './hiv-verification.component.html',
  styleUrls: ['./hiv-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationComponent {
  /** Public properties **/
  rdoVerificationMethod!: string;
}
