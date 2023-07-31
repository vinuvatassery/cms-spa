import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalClaimsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-medical-claims-detail-form',
  templateUrl: './medical-claims-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsDetailFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  claimsListData$ = this.financialMedicalClaimsFacade.claimsListData$;
  sortValue = this.financialMedicalClaimsFacade.sortValueClaims;
  sortType = this.financialMedicalClaimsFacade.sortType;
  pageSizes = this.financialMedicalClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialMedicalClaimsFacade.skipCount;
  sort = this.financialMedicalClaimsFacade.sortClaimsList;
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
    private readonly financialMedicalClaimsFacade: FinancialMedicalClaimsFacade
  ) {}

  closeAddEditClaimsFormModalClicked() {
    this.modalCloseAddEditClaimsFormModal.emit(true);
  }

  loadClaimsListGrid() {
    this.financialMedicalClaimsFacade.loadClaimsListGrid();
  }
}
