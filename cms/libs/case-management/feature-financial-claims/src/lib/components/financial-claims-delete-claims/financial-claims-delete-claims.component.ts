import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  Input,
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-financial-claims-delete-claims',
  templateUrl: './financial-claims-delete-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsDeleteClaimsComponent {
  @Output() isModalDeleteClaimsCloseClicked = new EventEmitter();
  @Output() isModalDeletedClaimsButtonClicked = new EventEmitter<boolean>();
  @Input() selectedProcessClaimsCount = 0;
  @Input() deletemodelbody = "";
  
  closeDeleteClaimsClicked() {
    this.isModalDeleteClaimsCloseClicked.emit(true);
  }
  deleteClaimsClicked(){
    this.isModalDeletedClaimsButtonClicked.emit(true);
  }
}
