import { DateInputFillMode} from '@progress/kendo-angular-dateinputs';
import { ButtonFillMode} from "@progress/kendo-angular-buttons";
import { InputFillMode} from "@progress/kendo-angular-inputs";
import { DropDownFillMode} from "@progress/kendo-angular-dropdowns";
import { TabStripScrollButtonsVisibility } from "@progress/kendo-angular-layout";
export class UIFormStyle {
  dateInputFillMode : DateInputFillMode = 'outline';
  buttonFillMode :ButtonFillMode ="outline";
  inputFillMode :InputFillMode ="outline";
  dropDownFillMode :DropDownFillMode ="outline";
}

export class UITabStripScroll {
  tabStripScroll : TabStripScrollButtonsVisibility = 'auto';
}