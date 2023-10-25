import { ChangeDetectionStrategy, Output , EventEmitter, Component, Input } from '@angular/core'; 

@Component({
  selector: 'cms-pharmacy-claims-batch-claims',
  templateUrl: './pharmacy-claims-batch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchClaimsComponent {
  
  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();
  @Output() OnbatchClaimsClickedEvent = new EventEmitter();
  @Input() selectedProcessClaimsCount:any 
  
  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit(true);  
  }

  OnbatchClaimsClicked(){
    this.OnbatchClaimsClickedEvent.emit();
  }
}
