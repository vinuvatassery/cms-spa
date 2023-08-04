import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-financial-premiums-batch-premiums',
  templateUrl: './financial-premiums-batch-premiums.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchPremiumsComponent {
  
  @Output() modalBatchPremiumsCloseClicked = new EventEmitter();

  closeBatchPremiumsClicked(){
    this.modalBatchPremiumsCloseClicked.emit(true);  
  }
}
