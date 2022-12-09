import { Component, OnInit,Input , ChangeDetectorRef, ChangeDetectionStrategy,  OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import { YesNoFlag } from '@cms/case-management/domain';

@Component({
  selector: 'common-optionbutton-list',
  templateUrl: './optionbutton-list.component.html',
  styleUrls: ['./optionbutton-list.component.scss'],
})
export class OptionbuttonListComponent implements OnInit {
  @Input() appInfoForm: FormGroup;

  @Input() optionButtonValid!:boolean;
  @Input() textFieldDisable!:boolean;

  @Input() OptionControlerName:any;
  @Input() textControlerName:any;
  @Input() textFieldType:any;
  @Input() textFieldAfter:any;
  @Input() textFieldFloatingText:any;

  @Input() rdoInputlov :any;
  @Input() dropdownInutLov :any;
  materialList: any = [];
  yesMaterialList: any =[]; 

  public formUiStyle : UIFormStyle = new UIFormStyle();  
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade : LovFacade) {
      this.appInfoForm = this.formBuilder.group({Material: [''],});
    }

  ngOnInit(): void {
    this.textFieldDisable = true;
  }
  onMaterialsRdoClicked(event: any) {
    debugger;
    if( this.appInfoForm.controls[this.OptionControlerName].value.toUpperCase() ===YesNoFlag.Yes.toUpperCase()){
      this.textFieldDisable = false;
    }
    else{
      this.textFieldDisable = true;
    } 

    if(this.appInfoForm.controls[this.OptionControlerName].value.toUpperCase()  ===YesNoFlag.Yes.toUpperCase() && 
    (this.appInfoForm.controls[this.textControlerName].value === ''
    || this.appInfoForm.controls[this.textControlerName].value === null)){
      this.appInfoForm.controls[this.textControlerName].setValidators(Validators.required);
      this.appInfoForm.controls[this.textControlerName].updateValueAndValidity();
      this.appInfoForm.controls[this.OptionControlerName].removeValidators(Validators.required);
      this.appInfoForm.controls[this.OptionControlerName].updateValueAndValidity();
    }
    else{
      this.appInfoForm.controls[this.textControlerName].removeValidators(Validators.required);
      this.appInfoForm.controls[this.textControlerName].updateValueAndValidity();       
    }
}
}
