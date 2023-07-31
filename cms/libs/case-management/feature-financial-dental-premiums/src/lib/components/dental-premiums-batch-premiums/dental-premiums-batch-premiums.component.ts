import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-dental-premiums-batch-premiums',
  templateUrl: './dental-premiums-batch-premiums.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsBatchPremiumsComponent {
  
  @Output() modalBatchPremiumsCloseClicked = new EventEmitter();

  closeBatchPremiumsClicked(){
    this.modalBatchPremiumsCloseClicked.emit(true);  
  }
}
