import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-dental-claims-batch-claims',
  templateUrl: './dental-claims-batch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsBatchClaimsComponent {
  
  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();

  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit(true);  
  }
}
