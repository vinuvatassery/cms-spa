import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-financial-drugs',
  templateUrl: './financial-drugs.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsComponent {
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false; 
  isFinancialDrugsReassignShow  = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  drugsGridlists = [
    {
      NDC: 'XXXXXXXXXX `',
      brandName:'Very Nice Brand Name', 
      drugName: 'Drug Name',
      deliveryMethod: 'Tablet',
      includedInRebates: 'Yes',
      hivDrugs: 'Yes',
      hepDrugs: 'No',
      oiDrugs: 'No',
    },
  ];
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Drug',
      icon: 'edit',
      click: (address: any): void => {        
        console.log(address);
        this.clickOpenAddEditFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-assign Drug',
      icon: 'compare_arrows',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenReassignFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Drug',
      icon: 'block',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeactivateFinancialDrugsDetails();
      },
    },
  ];


  
  clickOpenAddEditFinancialDrugsDetails() {
    this.isFinancialDrugsDetailShow = true;
  }

  clickCloseAddEditFinancialDrugsDetails() {
    this.isFinancialDrugsDetailShow = false;
  }

  clickOpenDeactivateFinancialDrugsDetails() {
    this.isFinancialDrugsDeactivateShow = true;
  }
  clickCloseDeactivateFinancialDrugs() {
    this.isFinancialDrugsDeactivateShow = false;
  }
  clickOpenReassignFinancialDrugsDetails() {
    this.isFinancialDrugsReassignShow = true;
  }
  clickCloseReassignFinancialDrugs(){
    this.isFinancialDrugsReassignShow = false;
  }
}
