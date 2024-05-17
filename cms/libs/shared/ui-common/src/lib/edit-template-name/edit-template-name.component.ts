import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'common-edit-template-name',
  templateUrl: './edit-template-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTemplateNameComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
 @Output() onCloseAddNewEditFolderClicked = new EventEmitter()
  Form:any
  isValidateForm= false;
  CustomDescription = '';
  @Output() updateTemplate = new EventEmitter<any>();
  @Input() templateDesc: any
  @Input() isFolder: any
  @Input() documentTemplateId : any
  CustomCharactersCount!: number;
  CustomCounter!: string;
  subTypeCode:any;
  folderRequired=false;
  CustomMaxLength = 50;
  isAddNewEditFolderPopup = true;
  constructor(public formBuilder: FormBuilder,
  ){
  }
  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      folderName: ['', Validators.required],
    });
    if(this.templateDesc){
      this.Form.controls['folderName'].setValue(this.templateDesc);
    }
  }
onCancelClick(){
  this.onCloseAddNewEditFolderClicked.emit(true);
}
updateTemplates() {
  const folderNameControl = this.Form.get('folderName');
  if (this.isFolder && folderNameControl.value.trim() === '') {
    folderNameControl.setErrors({ 'required': true });
  } else if (!this.isFolder && folderNameControl.value.trim() === '') {
    folderNameControl.setErrors({ 'required': true });
  } else {
    folderNameControl.setErrors(null);
    const payload = {
      TemplateDesc: folderNameControl.value,
      documentTemplateId: this.documentTemplateId,
      subTypeCode: this.isFolder ? "FOLDER" : "FILE"
    };
    this.updateTemplate.emit(payload);
    this.onCloseAddNewEditFolderClicked.emit(true);
  }
}
}