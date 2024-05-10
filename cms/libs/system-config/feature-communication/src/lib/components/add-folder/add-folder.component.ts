import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-add-folder',
  templateUrl: './add-folder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFolderComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
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
}
onCustomValueChange(event: any): void {
  this.CustomCharactersCount = event.length;
  this.CustomCounter = `${this.CustomCharactersCount}/${this.CustomMaxLength}`;
 }
}
