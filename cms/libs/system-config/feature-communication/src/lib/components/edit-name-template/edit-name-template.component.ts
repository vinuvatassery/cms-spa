import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-edit-name-template',
  templateUrl: './edit-name-template.component.html',
})
export class EditNameTemplateComponent implements OnInit  {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() addFolder = new EventEmitter<any>();
  @Output () onCloseAddNewEditFolderClicked = new EventEmitter<any>();
  Form:any
  isValidateForm= false;
  CustomDescription = '';
  CustomCharactersCount!: number;
  CustomCounter!: string;
  CustomMaxLength = 50;
  isAddNewEditFolderPopup = true;
  constructor(public formBuilder: FormBuilder,){
      this.Form = this.formBuilder.group({})
  }
  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      folderName: ['', Validators.required],
    });
  }
  addNewFolder() {
    this.isValidateForm=true;
      if (this.Form.valid ) {
        const payload = {
          TemplateDesc: this.Form.controls['folderName'].value,
         // SubtypeCode: AddFolder.SubtypeCode,
        };
        this.addFolder.emit(payload);
        this.onCloseAddNewEditFolderClicked.emit(false);
      }
  }
onCustomValueChange(event: any): void {
  this.CustomCharactersCount = event.length;
  this.CustomCounter = `${this.CustomCharactersCount}/${this.CustomMaxLength}`;
 }
 onCloseAddNewFolderClicked() {
  this.onCloseAddNewEditFolderClicked.emit(false);
}
}
