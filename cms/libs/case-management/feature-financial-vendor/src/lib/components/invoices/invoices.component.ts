import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-invoices',
  templateUrl: './invoices.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
   
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  invoiceGridLists = [
    {
      Batch: 'XXXXXXXXXX `',
      InvoiceID:'1', 
      ClientName: 'Donna Summer',
      NameOnPrimaryInsuranceCard: 'Donna Summer',
      MemberID: 'XX/XX/XXXX',
      ServiceCount: '5',
      TotalCost: '9000',
      by: 'No',
    },
  ];
  ClientGridLists = [
    {
      ServiceStart: 'MMDDYYYY_XXX `',
      ServiceEnd:'MMDDYYYY_XXX', 
      CPTCode: 'XXXXXXX',
      MedicalService: 'LIPID Testing',
      ServiceCost: '500.000',
      AmountDue: '20.00',
      PaymentType: 'Regular Pay', 
      ClientAnnualTotal: '5,600.00', 
      ClientBalance: '2,000.00', 
    },
  ];
   
}
