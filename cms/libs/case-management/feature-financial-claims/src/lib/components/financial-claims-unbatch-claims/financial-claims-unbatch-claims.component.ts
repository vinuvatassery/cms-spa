import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-financial-claims-unbatch-claims',
  templateUrl: './financial-claims-unbatch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsUnbatchClaimsComponent { 
  @Output() UnBatchCloseClickedEvent = new EventEmitter();

 
  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
