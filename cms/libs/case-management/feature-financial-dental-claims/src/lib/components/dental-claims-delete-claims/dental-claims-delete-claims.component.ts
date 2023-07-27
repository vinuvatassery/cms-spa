import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-dental-claims-delete-claims',
  templateUrl: './dental-claims-delete-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsDeleteClaimsComponent {
  @Output() isModalDeleteClaimsCloseClicked = new EventEmitter();

 
  closeDeleteClaimsClicked() {
    this.isModalDeleteClaimsCloseClicked.emit(true);
  }
}
