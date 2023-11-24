/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cms-reset-filter-confirmation',
  templateUrl: './reset-filter-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class filterResetConfirmationComponent  {
  @Output() isModalfilterResetsCloseClicked = new EventEmitter();
  @Output() isModalfilterResetButtonClicked = new EventEmitter<boolean>();



  closefilterResetClicked() {
    this.isModalfilterResetsCloseClicked.emit(true);
  }

  resetClicked(){
    this.isModalfilterResetButtonClicked.emit(true);
  }
}
