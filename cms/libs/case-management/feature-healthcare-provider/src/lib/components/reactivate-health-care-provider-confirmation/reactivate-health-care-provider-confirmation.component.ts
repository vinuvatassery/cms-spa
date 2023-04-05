/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'case-management-health-care-provider-reactivate-confirmation',
  templateUrl: './reactivate-health-care-provider-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DectiveHealthCareProviderConfirmationComponent {
  /** Input properties **/
  @Input() prvId!: string;

  @Output() reactivateConfimEvent = new EventEmitter<boolean>();

  onReactivateConfirm(isDelete: boolean) {
    this.reactivateConfimEvent.emit(isDelete);
  }
}
