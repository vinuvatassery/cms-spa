import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'common-deactivate-template',
  templateUrl: './deactivate-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateTemplateComponent {
@Output() onCloseFormsDocumentDeactivateClicked = new EventEmitter()
@Input () isFolder :any;
@Input() documentTemplateId : any
@Input() SubtypeCode : any
@Output() deactivateTemplateStatus= new EventEmitter()
onCancelClick(){
  this.onCloseFormsDocumentDeactivateClicked.emit(true);
}
onDeactivateClicked(){
  const payload = {
    isActive :false,
    DocumentTemplateId: this.documentTemplateId,
    subTypeCode: this.isFolder ? "FOLDER" : "FILE"
  };
  this.deactivateTemplateStatus.emit(payload)
  this.onCloseFormsDocumentDeactivateClicked.emit(true)
  }
}

