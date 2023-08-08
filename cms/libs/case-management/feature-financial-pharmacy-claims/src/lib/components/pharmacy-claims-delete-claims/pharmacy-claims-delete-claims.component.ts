import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-pharmacy-claims-delete-claims',
  templateUrl: './pharmacy-claims-delete-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsDeleteClaimsComponent {
  @Output() isModalDeleteClaimsCloseClicked = new EventEmitter();

 
  closeDeleteClaimsClicked() {
    this.isModalDeleteClaimsCloseClicked.emit(true);
  }
}
