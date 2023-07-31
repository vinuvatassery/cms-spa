import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalClaimsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-dental-claims-detail-form',
  templateUrl: './dental-claims-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsDetailFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  claimsListData$ = this.financialDentalClaimsFacade.claimsListData$;
  sortValue = this.financialDentalClaimsFacade.sortValueClaims;
  sortType = this.financialDentalClaimsFacade.sortType;
  pageSizes = this.financialDentalClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialDentalClaimsFacade.skipCount;
  sort = this.financialDentalClaimsFacade.sortClaimsList;
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

  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();

  constructor(
    private readonly financialDentalClaimsFacade: FinancialDentalClaimsFacade
  ) {}

  closeAddEditClaimsFormModalClicked() {
    this.modalCloseAddEditClaimsFormModal.emit(true);
  }

  loadClaimsListGrid() {
    this.financialDentalClaimsFacade.loadClaimsListGrid();
  }
}
