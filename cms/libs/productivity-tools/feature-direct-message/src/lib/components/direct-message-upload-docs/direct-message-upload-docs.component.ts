import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'productivity-tools-direct-message-upload-docs',
  templateUrl: './direct-message-upload-docs.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageUploadDocsComponent {
  @Input() uploadDocumentTypeDetails : any
  @Output() uploadDocumentsClosedDialog = new EventEmitter<any>();
  onUploadDocumentsClosed(){
    this.uploadDocumentsClosedDialog.emit();
  }
}
