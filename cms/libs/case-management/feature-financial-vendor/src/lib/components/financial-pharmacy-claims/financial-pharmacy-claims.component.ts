import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-pharmacy-claims',
  templateUrl: './financial-pharmacy-claims.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPharmacyClaimsComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false; 
  isFinancialDrugsReassignShow  = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  claimsGridLists = [
    {
      Batch: 'MMDDYYYY_XXX `',
      Item:'XX', 
      PharmacyName: 'Pharmacy Name #123',
      PaymentMethod: 'SPOTS',
      ClientName: 'Yes',
      PrimaryInsuranceCard: 'FName LName',
      MemberID: 'Member ID',
      By: 'By',
    },
  ];
 


}
