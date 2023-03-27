import { Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-smoking-cessation-list',
  templateUrl: './smoking-cessation-list.component.html',
  styleUrls: ['./smoking-cessation-list.component.scss'],
})
export class SmokingCessationListComponent {
  isAddReferralSmokingCessationOpen = false;
  tareaCessationMaxLength = 300;
  tareaCessationCounter!: string;
  tareaCessationCharachtersCount!: number;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  onTareaCessationValueChange(event: any): void {
    this.tareaCessationCharachtersCount = event.length;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }
  openAddReferralSmokingCessationClicked(){
    this.isAddReferralSmokingCessationOpen = true;
  }

  CloseAddReferralSmokingCessationClicked(){
    this.isAddReferralSmokingCessationOpen = false;
  }
}
