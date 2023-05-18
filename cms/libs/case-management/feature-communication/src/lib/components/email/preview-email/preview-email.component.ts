/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

/** Internal Libraries **/
import { CommunicationEvents } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-preview-email',
  templateUrl: './preview-email.component.html',
  styleUrls: ['./preview-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewEmailComponent {
  /** Input properties **/
  @Input() emailContent!: any;

    /** Lifecycle hooks **/
    ngOnInit(): void { 
    }
}
