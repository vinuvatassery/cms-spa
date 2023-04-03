import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-case-eligibility-periods',
  templateUrl: './case-eligibility-periods.component.html'
})
export class CaseEligibilityPeriodsComponent {

  public formUiStyle: UIFormStyle = new UIFormStyle();
  eligibilityPeriodsList: any = [];
  selectedValue: any = {};

  private caseEligibilityPeriodsData: any = [];
  @Input()
  get eligibilityPeriodsData(): any {
    return this.caseEligibilityPeriodsData;
  }
  set eligibilityPeriodsData(data: any) {
    if (data) {
      this.caseEligibilityPeriodsData = data;
      this.setDropdownValues();
    }
  }
  private eligibilityId: string = "";
  @Input()
  get caseEligibilityId(): string {
    return this.eligibilityId;
  }
  set caseEligibilityId(value: string) {
    this.eligibilityId = value;
    this.setDefaultSelection();
  }

  @Output() onEligibilityPeriodChange = new EventEmitter<any>();
 

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

  setDefaultSelection() {
    if (!!this.caseEligibilityId && this.eligibilityPeriodsList.length > 0) {
      this.selectedValue = this.eligibilityPeriodsList.filter((x: any) => x.id == this.caseEligibilityId)[0];
    }
  }

  onPeriodChange(value: any) {
    this.selectedValue = value;
    this.onEligibilityPeriodChange.emit(this.selectedValue);
  }

}
