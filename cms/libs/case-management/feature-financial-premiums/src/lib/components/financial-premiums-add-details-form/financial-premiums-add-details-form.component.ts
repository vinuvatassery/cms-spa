import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-premiums-add-details-form',
  templateUrl: './financial-premiums-add-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsAddDetailsFormComponent {
  
  @Output() modalCloseAddPremiumsFormModal = new EventEmitter();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  addPremiumGridLists$: any;
  providerSearchResult = [
    {
      clientId: '12',
      fullName: 'Fname Lname',
      dob: 'MM/DD/YYYY',
      status: 'Accept',
      ssn: '123123213213'
    },
    {
      clientId: '12',
      fullName: 'Fname Lname',
      dob: 'MM/DD/YYYY',
      status: 'Accept',
      ssn: '123123213213'
    },
    {
      clientId: '12',
      fullName: 'Fname Lname',
      dob: 'MM/DD/YYYY',
      status: 'Accept',
      ssn: '123123213213' 
    },
    {
      clientId: '12',
      fullName: 'Fname Lname',
      dob: 'MM/DD/YYYY',
      status: 'Accept',
      ssn: '123123213213'
    },
  ];

  closeAddPremiumClicked() {
    this.modalCloseAddPremiumsFormModal.emit(true);
  }
}
