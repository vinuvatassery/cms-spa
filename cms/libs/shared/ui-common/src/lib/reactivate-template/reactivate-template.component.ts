import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'common-reactivate-template',
  templateUrl: './reactivate-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivateTemplateComponent {

  @Output() onCloseFormsDocumentReactivateClicked = new EventEmitter()
  @Output() reactivateTemplateStatus = new EventEmitter()
  @Input () isFolder : any;
  @Input() documentTemplateId : any
  @Input() SubtypeCode : any


  onCancelClick(){
    this.onCloseFormsDocumentReactivateClicked.emit(true);
  }
  onReactivateClicked(){
    const payload = {
      isActive :true,
      DocumentTemplateId: this.documentTemplateId,
      subTypeCode: this.isFolder ? "FOLDER" : "FILE"
    };
    this.reactivateTemplateStatus.emit(payload)
    this.onCloseFormsDocumentReactivateClicked.emit(true);
    }
}
