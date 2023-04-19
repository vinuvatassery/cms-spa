/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'case-management-health-care-provider-deactivate-confirmation',
  templateUrl: './deactivate-health-care-provider-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DectiveHealthCareProviderConfirmationComponent {
  /** Input properties **/
  @Input() prvId!: string;

  @Output() deactivateConfimEvent = new EventEmitter<boolean>();

  onDeactivateConfirm(isDelete: boolean) {
    this.deactivateConfimEvent.emit(isDelete);
  }
}
