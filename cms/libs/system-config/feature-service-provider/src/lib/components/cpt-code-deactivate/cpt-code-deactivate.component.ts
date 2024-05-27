import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'system-config-cpt-code-deactivate',
  templateUrl: './cpt-code-deactivate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeDeactivateComponent {

  @Output() close = new EventEmitter<any>();
  @Output() deactivateConfimEvent = new EventEmitter<any>();
  
  onCancelClick() {
    this.close.emit();
  }

  onDeactivateConfirm(status: boolean) {
    this.deactivateConfimEvent.emit(status);
  }
}
