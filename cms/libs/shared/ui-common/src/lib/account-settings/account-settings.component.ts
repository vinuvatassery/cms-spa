import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';   
@Component({
  selector: 'common-account-settings',
  templateUrl: './account-settings.component.html', 
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSettingsComponent {
  isScheduleOutOfOfficeSection = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public listItems = [
 {
  lovDesc: 'Monday',
  lovCode:"MO"
 },
 {
  lovDesc: 'Tuesday',
  lovCode:"TU"
 },
 {
  lovDesc: 'Wednesday',
  lovCode:"WE"
 },
 {
  lovDesc: 'Thursday',
  lovCode:"TH"
 },
 {
  lovDesc: 'Friday',
  lovCode:"FR"
 },
 {
  lovDesc: 'Saturday',
  lovCode:"SA"
 },
 {
  lovDesc: 'Sunday',
  lovCode:"SU"
 },
  ]; 
  public time: Date = new Date(2000, 2, 10, 13, 30, 0);

  showScheduleOutOfOfficeSection(){
this.isScheduleOutOfOfficeSection = !this.isScheduleOutOfOfficeSection
  }
}
