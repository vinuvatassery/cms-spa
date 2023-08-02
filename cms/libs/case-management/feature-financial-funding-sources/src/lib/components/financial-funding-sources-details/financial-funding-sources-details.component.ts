
 
import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-funding-sources-details',
  templateUrl: './financial-funding-sources-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialFundingSourcesDetailsComponent {
  isAdd = true;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() isModalDetailsFundingSourcesCloseClicked = new EventEmitter();

  closeDetailsFundingSourcesClicked() {
    this.isModalDetailsFundingSourcesCloseClicked.emit(true);
  }
}