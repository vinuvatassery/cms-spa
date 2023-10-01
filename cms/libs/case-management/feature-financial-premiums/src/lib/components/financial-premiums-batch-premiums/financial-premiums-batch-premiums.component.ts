import { ChangeDetectionStrategy, Output , EventEmitter, Component, Input } from '@angular/core'; 

@Component({
  selector: 'cms-financial-premiums-batch-premiums',
  templateUrl: './financial-premiums-batch-premiums.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchPremiumsComponent {
  
  @Output() modalBatchPremiumsCloseClicked = new EventEmitter();
  @Output() OnbatchClaimsClickedEvent = new EventEmitter();
  @Input() selectedProcessClaimsCount:any 
  
  closeBatchPremiumsClicked(){
    this.modalBatchPremiumsCloseClicked.emit(true);  
  }

  OnbatchClaimsClicked(){
    this.OnbatchClaimsClickedEvent.emit();
  }
}
