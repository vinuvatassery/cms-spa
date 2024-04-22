import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';



@Component({
  selector: 'common-clients-attachment',
  templateUrl: './clients-attachment.component.html',
})
export class ClientsAttachmentComponent implements OnInit{

  @Input() clientAttachmentForm!: FormGroup;
  @Input() clientDocumentList$!: any;
  @Input() floatingLabel:any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() clientAttachmentChangeEvent : EventEmitter<any> = new EventEmitter();

  clientAttachmentChange(event:any)
  {
    this.clientAttachmentChangeEvent.emit(event);
  }

  ngOnInit(): void {
    if(this.floatingLabel == undefined || this.floatingLabel == null || this.floatingLabel == ''){
      this.floatingLabel= "Client Documents";
    }
  }
}
