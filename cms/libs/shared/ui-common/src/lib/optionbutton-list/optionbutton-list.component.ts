import { Component, OnInit,Input  } from '@angular/core';
import {  FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import { YesNoFlag } from '../enums/yes-no-flag-enum';

@Component({
  selector: 'common-optionbutton-list',
  templateUrl: './optionbutton-list.component.html',
  styleUrls: ['./optionbutton-list.component.scss'],
})
export class OptionbuttonListComponent implements OnInit {

     /** Output properties **/
  @Input() appInfoForm: FormGroup;

     /** Input properties **/
  @Input() optionButtonValid!:boolean;
  @Input() textFieldDisable!:boolean;
  @Input() OptionControlerName:any;
  @Input() textControlerName:any;
  @Input() textFieldType:any;
  @Input() textFieldAfter:any;
  @Input() textFieldFloatingText:any;
  @Input() textPlaceholderText:any;
  @Input() textValidationMessage:any;
  @Input() textFieldMaxLimit:any;
  @Input() rdoInputlov :any;
  @Input() dropdownInutLov :any;

     /** Public properties **/
  public autoCorrect = true;
  public formUiStyle : UIFormStyle = new UIFormStyle();  
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

     /** Constructor **/
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade : LovFacade) {
      this.appInfoForm = this.formBuilder.group({Material: [''],});
    }

      /** Lifecycle hooks **/
  ngOnInit(): void {
    this.textFieldDisable = true;
  }

    /** Public methods **/
  onMaterialsRdoClicked(event: any) {
    if( this.appInfoForm.controls[this.OptionControlerName].value.toUpperCase() ===YesNoFlag.Yes.toUpperCase()){
      this.textFieldDisable = false;
    }
    else{
      this.textFieldDisable = true;
    } 

    if(this.appInfoForm.controls[this.OptionControlerName].value.toUpperCase()  ===YesNoFlag.Yes.toUpperCase() && 
    (this.appInfoForm.controls[this.textControlerName] !== undefined && 
      (this.appInfoForm.controls[this.textControlerName].value === ''
    || this.appInfoForm.controls[this.textControlerName].value === null))){
      this.appInfoForm.controls[this.textControlerName].setValidators(Validators.required);
      this.appInfoForm.controls[this.textControlerName].updateValueAndValidity();
      this.appInfoForm.controls[this.OptionControlerName].removeValidators(Validators.required);
      this.appInfoForm.controls[this.OptionControlerName].updateValueAndValidity();
    }
    else{
          if(this.appInfoForm.controls[this.textControlerName] !== undefined){
            this.appInfoForm.controls[this.textControlerName].removeValidators(Validators.required);
            this.appInfoForm.controls[this.textControlerName].updateValueAndValidity();  
          }     
    }
}
}
