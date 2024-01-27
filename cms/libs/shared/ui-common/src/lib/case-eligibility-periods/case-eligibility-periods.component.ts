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

  @Input() currentClientCaseEligibilityId: string = "";
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
  @Output() updateHistoryStatus = new EventEmitter<boolean>();

  setDropdownValues() {
    this.eligibilityPeriodsList = [];
    this.eligibilityPeriodsData.forEach((x: any) => {
      let period = {
        id: x.clientCaseEligibilityId,
        label: new Date(x.eligibilityStartDate).toLocaleDateString("en-US")
          + ' - ' + new Date(x.eligibilityEndDate).toLocaleDateString("en-US")
      };
      this.eligibilityPeriodsList.push(period);
    });
    this.setDefaultSelection();
  }

  setDefaultSelection() {
    if (!!this.caseEligibilityId && this.eligibilityPeriodsList.length > 0) {
      this.selectedValue = this.eligibilityPeriodsList.filter((x: any) => x.id == this.caseEligibilityId)[0];
    }
  }

  onPeriodChange(value: any) {
    this.selectedValue = value;
    this.onEligibilityPeriodChange.emit(this.selectedValue);
    if (!!this.currentClientCaseEligibilityId) {
      this.checkHistoryStatus();
    }
  }

  checkHistoryStatus() {
    let historyData = this.eligibilityPeriodsData.filter((x: any) => x.clientCaseEligibilityId == this.currentClientCaseEligibilityId);
    let selectedData = this.eligibilityPeriodsData.filter((x: any) => x.clientCaseEligibilityId == this.selectedValue.id);
    if (historyData[0].eligibilityStartDate == selectedData[0].eligibilityStartDate
      && historyData[0].eligibilityEndDate == selectedData[0].eligibilityEndDate) {
      this.updateHistoryStatus.emit(false);
    }
    else {

      this.updateHistoryStatus.emit(this.isPreviousEligibilityPeriod(historyData[0], selectedData[0]));
    }
  }

  isPreviousEligibilityPeriod(historyData : any, selectedData : any)
  {
    const historyDataStartDate = new Date(historyData.eligibilityStartDate);
    const selectedDataStartDate = new Date(selectedData.eligibilityStartDate);
    const selectedDataEndDate = new Date(selectedData.eligibilityEndDate);

    if(historyDataStartDate > selectedDataEndDate && historyDataStartDate > selectedDataStartDate)
    {
      return true;
    }
    return false;
  }

}
