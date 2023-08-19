/** Angular **/
import { Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'case-management-preview-email',
  templateUrl: './preview-email.component.html',
  styleUrls: ['./preview-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewEmailComponent {
  /** Input properties **/
  @Input() emailContent!: any;
  @Input() paperlessFlag! : any
}
