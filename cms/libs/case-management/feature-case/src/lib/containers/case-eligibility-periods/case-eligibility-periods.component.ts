import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-case-eligibility-periods',
  templateUrl: './case-eligibility-periods.component.html',
  styleUrls: ['./case-eligibility-periods.component.scss']
})
export class CaseEligibilityPeriodsComponent implements OnInit {

  public formUiStyle: UIFormStyle = new UIFormStyle();
  eligibilityPeriodsList: any = [];

  private _eligibilityPeriodsData: any = [];
  @Input()
  get eligibilityPeriodsData(): any {
    return this._eligibilityPeriodsData;
  }
  set eligibilityPeriodsData(data: any) {
    if (data) {
      this._eligibilityPeriodsData = data;
      this.setDropdownValues();
    }
  }

  @Input() valueField: string = "";
  @Input() displayField: string = "";
  @Input() selectedValue: any = {};
  @Output() onEligibilityPeriodChange = new EventEmitter<any>();

  ngOnInit() { }

  setDropdownValues() {
    this.eligibilityPeriodsData.forEach((x: any) => {
      let period = {
        id: x.clientCaseEligibilityId,
        label: new Date(x.eilgibilityStartDate).toLocaleDateString()
          + ' - ' + new Date(x.eligibilityEndDate).toLocaleDateString()
      };
      this.eligibilityPeriodsList.push(period);
    });
  }

  onPeriodChange(value: any) {
    this.selectedValue = value;
    this.onEligibilityPeriodChange.emit(this.selectedValue);
  }

}
