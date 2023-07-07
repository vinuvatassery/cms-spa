import { Component, Input } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'productivity-tools-approvals-payments-list',
  templateUrl: './approvals-payments-list.component.html',
  styleUrls: ['./approvals-payments-list.component.scss'],
})
export class ApprovalsPaymentsListComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  approvalPayments = [
    {
      id: 1,
      Attention: 'Attention',
      viewPmtsInBatch: 'Attention',
      batch: 'MMDDYYYY_009',
      totalAMount: 'xxxx',
      pmtCount: 'xxxx',
      providerCount: 'xxx',
      dateApprovalRequest: 'xx/xx/xxxx',
      serviceDate: '12/2019',
      Schedule: 'Immediate',
      category: 'Expense',
      expenseType: 'Rent Deposit',
      typeOfUtility: 'Electric',
      amount: '(572.00)',
      fundingSource: 'Formula',
      paymentMethod: 'Check',
      frequency: 'One Time',
      serviceProvider: 'Post Centennial Park',
      status: 'Submitted',
      URN: '102456',
      clientNumber: '00000543',
      name: 'Sarah Phillips (Josh)',
      pcaCode: 'Code X',
      glAccount: '00000000',
      sendBackNotes: ' ',
    },
  ];
}
