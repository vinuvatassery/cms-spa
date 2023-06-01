import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-insurance-provider',
  templateUrl: './financial-insurance-provider.component.html',
  styleUrls: ['./financial-insurance-provider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInsuranceProviderComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false; 
  isFinancialDrugsReassignShow  = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  providerGridLists = [
    {
      ProviderName: 'A Provider Name',
      ActivePlans:'XX', 
      ActiveClients: 'XX', 
      By: 'No',
    },
  ];
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Provider',
      icon: 'edit',
      click: (data: any): void => {        
        console.log(data);
         
      },
    },
 
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
       
      },
    },
  ]
}
