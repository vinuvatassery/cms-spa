import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-medical-claims-delete-claims',
  templateUrl: './medical-claims-delete-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsDeleteClaimsComponent {
  @Output() isModalDeleteClaimsCloseClicked = new EventEmitter();

 
  closeDeleteClaimsClicked() {
    this.isModalDeleteClaimsCloseClicked.emit(true);
  }
}
