import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { AddFolder } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-add-folder',
  templateUrl: './add-folder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFolderComponent implements OnInit {
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
          DocumentTemplateTypeCode: AddFolder.DocumentTemplateTypeCode,
          SequenceNbr: AddFolder.SequenceNbr,
          TemplateVersion: AddFolder.TemplateVersion,
          SystemCode: AddFolder.SystemCode,
          SubtypeCode: AddFolder.SubtypeCode,
          LanguageCode: AddFolder.LanguageCode,
          ChannelTypeCode: AddFolder.ChannelTypeCode
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
