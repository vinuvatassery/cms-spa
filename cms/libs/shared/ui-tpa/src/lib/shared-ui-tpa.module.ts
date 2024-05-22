/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
/** External libraries **/
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
import { UploadsModule } from '@progress/kendo-angular-upload';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipsModule } from '@progress/kendo-angular-tooltip';
import { EditorModule } from '@progress/kendo-angular-editor';
import { IndicatorsModule } from "@progress/kendo-angular-indicators";
import {
  FloatingLabelModule,
  LabelModule,
} from '@progress/kendo-angular-label';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { NotificationModule } from '@progress/kendo-angular-notification';
import {UIFormStyle} from './kendo-uiform-style-config';
import {UploadFileRistrictionOptions, CurrencyFormat,IntlDateService, DataQuery} from './kendo-form-element-config';
import { SortableModule } from "@progress/kendo-angular-sortable";
import { ScrollViewModule } from "@progress/kendo-angular-scrollview";
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { ChartsModule } from "@progress/kendo-angular-charts";
import 'hammerjs';
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
  UploadsModule,
  TooltipsModule,
  EditorModule,
  NavigationModule,
  NotificationModule,
  IndicatorsModule,
  SortableModule, 
  ScrollViewModule,
  TreeListModule,
  TreeViewModule,
  ChartsModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
  providers: [
    UIFormStyle,
    UploadFileRistrictionOptions,
    CurrencyFormat,
    IntlDateService,
    DataQuery
  ]
})
export class SharedUiTpaModule {}
