import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'productivity-tools-approvals-expectation-reason',
  templateUrl: './approvals-expectation-reason.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsExpectationReasonComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  exceptiontext: string = '';
  @Output() closeMakeExpectationDialogClickedEvent = new EventEmitter<any>();
  @Output() addAnExceptionEvent = new EventEmitter<any>();
  textMaxLength: number = 100;
  closeMakeExpectation() {
    this.closeMakeExpectationDialogClickedEvent.emit();
  }
  makeException(){
    this.addAnExceptionEvent.emit(this.exceptiontext);
  }
  serviceDescCharCount() {
    let serviceDescription = this.exceptiontext;
    if (serviceDescription) {
      return `${serviceDescription.length}/${this.textMaxLength}`;
    }
    return `0/${this.textMaxLength}`;
  }
}
