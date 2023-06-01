import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-financial-payments',
  templateUrl: './financial-payments.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPaymentComponent {
 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  PaymentsGridLists = [
    {
      Batch: 'XXXXXXXXXX `',
      Item:'1', 
      ItemCount: '3',
      TotalAmount: '1,000.00',
      DatePmtRequested: 'XX/XX/XXXX',
      DatePmtSent: 'Yes',
      PmtStatus: 'Pending',
      Warrant: 'No',
      PCA: 'XXXXX',
      by: 'No',
    },
  ];
  ClientGridLists = [
    {
      ClientName: 'FName LName `',
      PrimaryInsuranceCard:'FName LName', 
      PremiumAmount: '500.00',
      MemberID: 'XXXXXX',
      PolicyID: 'XXXXXX',
      GroupID: 'XXXXXX',
      PaymentID: 'XXXXXX', 
    },
  ];
   


}
