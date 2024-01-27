import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
} from '@angular/core';
@Component({
  selector: 'cms-pharmacy-claims-delete-claims',
  templateUrl: './pharmacy-claims-delete-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsDeleteClaimsComponent {
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
