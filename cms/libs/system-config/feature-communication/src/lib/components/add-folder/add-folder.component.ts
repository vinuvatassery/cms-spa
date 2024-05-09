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
  Form:any
  isValidateForm= false;
  CustomDescription = '';
  CustomCharactersCount!: number;
  CustomCounter!: string;
  CustomMaxLength = 50;
  constructor(public formBuilder: FormBuilder,){
      this.Form = this.formBuilder.group({})
  }
  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      folderName: ['', Validators.required],
    });
  }
addFormDocument(){
  this.isValidateForm=true;
  if(!this.Form.Invalid)
    {
      const  payload={
        TemplateDesc:  this.Form.controls['folderName'].value,
        DocumentTypeCode : AddFolder.DocumentTypeCode,
        SequenceNbr :  AddFolder.SequenceNbr,
        TemplateVersion : AddFolder.TemplateVersion,
        SystemCode :AddFolder.SubtypeCode,
        SubtypeCode  :AddFolder.SubtypeCode,
        LanguageCode:AddFolder.LanguageCode,
        ChannelTypeCode :  AddFolder.ChannelTypeCode
      }

      this.addFolder.emit(payload);
    }
}
onCustomValueChange(event: any): void {
  this.CustomCharactersCount = event.length;
  this.CustomCounter = `${this.CustomCharactersCount}/${this.CustomMaxLength}`;
 }
}
