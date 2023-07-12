import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';



@Component({
  selector: 'common-clients-attachment',
  templateUrl: './clients-attachment.component.html',
  styleUrls: ['./clients-attachment.component.scss'],
})
export class ClientsAttachmentComponent {

  @Input() clientAttachmentForm!: FormGroup;
  @Input() clientDocumentList$!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() clientAttachmentChangeEvent : EventEmitter<any> = new EventEmitter();

  clientAttachmentChange(event:any)
  {
    this.clientAttachmentChangeEvent.emit(event);
  }
}
