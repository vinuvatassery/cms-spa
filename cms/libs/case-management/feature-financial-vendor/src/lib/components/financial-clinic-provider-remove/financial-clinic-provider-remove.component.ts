import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'cms-financial-clinic-provider-remove',
  templateUrl: './financial-clinic-provider-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderRemoveComponent {
  @Input() vendorId = '';
  @Output() closeRemoveProviderEvent = new EventEmitter();
  @Output() removeConfirmEvent = new EventEmitter<any>();
  removeproviderEvent() {
     this.removeConfirmEvent.emit(this.vendorId);
  }
  closeRemovePopup(){
    this.closeRemoveProviderEvent.emit(true);
  }
}
