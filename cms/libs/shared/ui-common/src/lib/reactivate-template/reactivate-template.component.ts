import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'common-reactivate-template',
  templateUrl: './reactivate-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivateTemplateComponent {

  @Output() onCloseFormsDocumentReactivateClicked = new EventEmitter()
  @Input () isFolder : any;



  onCancelClick(){
    this.onCloseFormsDocumentReactivateClicked.emit(true);
  }

}
