import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { DateInputSize, DateInputRounded, DateInputFillMode} from '@progress/kendo-angular-dateinputs';
import { ButtonSize, ButtonRounded, ButtonFillMode, ButtonThemeColor, ChipFillMode,  ChipThemeColor} from "@progress/kendo-angular-buttons";
import { InputSize,InputRounded, InputFillMode} from "@progress/kendo-angular-inputs";
import { DropDownSize, DropDownRounded, DropDownFillMode} from "@progress/kendo-angular-dropdowns";
 
export class UIFormStyle {
  dateInputFillMode : DateInputFillMode = 'outline';
  buttonFillMode :ButtonFillMode ="outline";
  inputFillMode :InputFillMode ="outline";
  dropDownFillMode :DropDownFillMode ="outline";
}
 