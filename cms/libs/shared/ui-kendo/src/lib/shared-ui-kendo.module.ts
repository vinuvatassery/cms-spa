import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';
import { IntlModule } from '@progress/kendo-angular-intl';
import { PopupModule } from '@progress/kendo-angular-popup';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ChartModule } from '@progress/kendo-angular-charts';
import {
  FloatingLabelModule,
  LabelModule,
} from '@progress/kendo-angular-label';

const MODULES = [
  InputsModule,
  DropDownsModule,
  GridModule,
  ButtonsModule,
  IntlModule,
  FloatingLabelModule,
  LabelModule,
  PopupModule,
  RippleModule,
  CommonModule,
  DialogModule,
  DateInputsModule,
  LayoutModule,
  ProgressBarModule,
  ChartModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class SharedUiKendoModule {}
