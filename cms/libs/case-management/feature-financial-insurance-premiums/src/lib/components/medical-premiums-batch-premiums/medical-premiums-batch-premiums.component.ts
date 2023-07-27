import { ChangeDetectionStrategy, Output , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-medical-premiums-batch-premiums',
  templateUrl: './medical-premiums-batch-premiums.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsBatchPremiumsComponent {
  
  @Output() modalBatchPremiumsCloseClicked = new EventEmitter();

  closeBatchPremiumsClicked(){
    this.modalBatchPremiumsCloseClicked.emit(true);  
  }
}
