/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa' 

@Component({
  selector: 'case-management-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailComponent {
 currentDate = new Date();
 
 public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() isAdd = true;
}
