import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-financial-claims-delete-claims',
  templateUrl: './financial-claims-delete-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsDeleteClaimsComponent {
  @Output() isModalDeleteClaimsCloseClicked = new EventEmitter();

 
  closeDeleteClaimsClicked() {
    this.isModalDeleteClaimsCloseClicked.emit(true);
  }
}
