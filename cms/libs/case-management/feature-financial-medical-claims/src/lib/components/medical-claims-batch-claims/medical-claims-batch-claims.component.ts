import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-medical-claims-batch-claims',
  templateUrl: './medical-claims-batch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchClaimsComponent {
  
  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();

  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit(true);  
  }
}
