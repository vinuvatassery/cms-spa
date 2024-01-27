import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-claims-batch-claims',
  templateUrl: './financial-claims-batch-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchClaimsComponent {

  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();
  @Output() isModalBatchClaimsButtonClicked = new EventEmitter<string>();
  @Input() selectedProcessClaimsCount = 0;

  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit();
  }
  batchClaimsClicked(){
    this.isModalBatchClaimsButtonClicked.emit();
  }
}
