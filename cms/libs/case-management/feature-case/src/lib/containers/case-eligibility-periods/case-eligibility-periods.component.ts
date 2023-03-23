import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-case-eligibility-periods',
  templateUrl: './case-eligibility-periods.component.html',
  styleUrls: ['./case-eligibility-periods.component.scss']
})
export class CaseEligibilityPeriodsComponent implements OnInit {

  public formUiStyle : UIFormStyle = new UIFormStyle();

  @Input() eligibilityPeriodsList: any = [];
  @Input() valueField: string = "";
  @Input() displayField: string = "";
  @Input() selectedValue: any = {};
  @Output() onEligibilityPeriodChange = new EventEmitter<any>();

  ngOnInit() { }

  onPeriodChange(value: any) {
    this.selectedValue = value;
    this.onEligibilityPeriodChange.emit(this.selectedValue);
  }

}
