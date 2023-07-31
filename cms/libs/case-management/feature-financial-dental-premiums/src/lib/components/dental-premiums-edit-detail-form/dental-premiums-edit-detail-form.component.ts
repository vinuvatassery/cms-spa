import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalPremiumsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-dental-premiums-edit-detail-form',
  templateUrl: './dental-premiums-edit-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsEditDetailFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  premiumsListData$ = this.financialDentalPremiumsFacade.premiumsListData$;
  sortValue = this.financialDentalPremiumsFacade.sortValuePremiums;
  sortType = this.financialDentalPremiumsFacade.sortType;
  pageSizes = this.financialDentalPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialDentalPremiumsFacade.skipCount;
  sort = this.financialDentalPremiumsFacade.sortPremiumsList;
  state!: State;
  clientSearchResult = [
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
  ];
  providerSearchResult = [
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
  ];

  @Output() modalCloseEditPremiumsFormModal = new EventEmitter();

  constructor(
    private readonly financialDentalPremiumsFacade: FinancialDentalPremiumsFacade
  ) {}

  closeAddEditPremiumsFormModalClicked() {
    this.modalCloseEditPremiumsFormModal.emit(true);
  }

  loadPremiumsListGrid() {
    this.financialDentalPremiumsFacade.loadPremiumsListGrid();
  }
}
