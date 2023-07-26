import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalPremiumsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-medical-premiums-detail-form',
  templateUrl: './medical-premiums-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsDetailFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  premiumsListData$ = this.financialMedicalPremiumsFacade.premiumsListData$;
  sortValue = this.financialMedicalPremiumsFacade.sortValuePremiums;
  sortType = this.financialMedicalPremiumsFacade.sortType;
  pageSizes = this.financialMedicalPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialMedicalPremiumsFacade.skipCount;
  sort = this.financialMedicalPremiumsFacade.sortPremiumsList;
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

  @Output() modalCloseAddEditPremiumsFormModal = new EventEmitter();

  constructor(
    private readonly financialMedicalPremiumsFacade: FinancialMedicalPremiumsFacade
  ) {}

  closeAddEditPremiumsFormModalClicked() {
    this.modalCloseAddEditPremiumsFormModal.emit(true);
  }

  loadPremiumsListGrid() {
    this.financialMedicalPremiumsFacade.loadPremiumsListGrid();
  }
}
