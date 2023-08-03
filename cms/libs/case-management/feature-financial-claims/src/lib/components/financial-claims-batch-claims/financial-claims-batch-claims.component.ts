import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-financial-claims-batch-claims',
  templateUrl: './financial-claims-batch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchClaimsComponent {
  
  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();

  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit(true);  
  }
}
