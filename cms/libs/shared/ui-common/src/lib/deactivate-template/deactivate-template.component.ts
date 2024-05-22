import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'common-deactivate-template',
  templateUrl: './deactivate-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateTemplateComponent {
@Output() onCloseFormsDocumentDeactivateClicked = new EventEmitter()
@Input () isFolder :any;


onCancelClick(){
  debugger
  this.onCloseFormsDocumentDeactivateClicked.emit(true);
}
}
