 
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-financial-funding-sources-remove',
  templateUrl: './financial-funding-sources-remove.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialFundingSourcesRemoveComponent {
  @Input() fundingSourceId!: string;
  @Input() fundingSourceCode!:string;
  @Output() isModalRemoveFundingSourcesCloseClicked = new EventEmitter();
  @Output() removeConfirmEvent = new EventEmitter<any>();

 
  closeRemoveFundingSourcesClicked() {
    this.isModalRemoveFundingSourcesCloseClicked.emit(true);
  }
  onRemoveOrCancelClick(isDelete : boolean)
  {  
    const deleteFundingSourceConfirmParams =
    {
      isDelete : isDelete ,
      fundingSourceId : this.fundingSourceId
    }
    this.removeConfirmEvent.emit(deleteFundingSourceConfirmParams);
  }
}