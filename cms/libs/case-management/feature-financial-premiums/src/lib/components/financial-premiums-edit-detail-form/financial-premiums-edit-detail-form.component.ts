import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-premiums-edit-detail-form',
  templateUrl: './financial-premiums-edit-detail-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsEditDetailFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() vendorId:any;
  @Input() clientId:any;
  @Input() premiumsType:any;
  isShownSearchLoader = false;
  premiumsListData$ = this.financialPremiumsFacade.premiumsListData$;
  sortValue = this.financialPremiumsFacade.sortValuePremiums;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortPremiumsList;
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
    private readonly financialPremiumsFacade: FinancialPremiumsFacade
  ) {}

  closeAddEditPremiumsFormModalClicked() {
    this.modalCloseEditPremiumsFormModal.emit(true);
  }

  loadPremiumsListGrid() {
    this.financialPremiumsFacade.loadPremiumsListGrid();
  }
}
