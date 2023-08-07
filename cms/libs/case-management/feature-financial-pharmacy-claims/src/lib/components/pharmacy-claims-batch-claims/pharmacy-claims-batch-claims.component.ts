import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-pharmacy-claims-batch-claims',
  templateUrl: './pharmacy-claims-batch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchClaimsComponent {
  
  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();

  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit(true);  
  }
}
