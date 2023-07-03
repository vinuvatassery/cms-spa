import { Component, OnInit, ChangeDetectionStrategy , Output, EventEmitter} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain'; 
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
  styleUrls: ['./refund-new-form-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundNewFormDetailsComponent{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  claimsListData$ =
    this.financialVendorRefundFacade.claimsListData$;
    sortValue = this.financialVendorRefundFacade.sortValueRefundProcess;
    sortType = this.financialVendorRefundFacade.sortType;
    pageSizes = this.financialVendorRefundFacade.gridPageSizes;
    gridSkipCount = this.financialVendorRefundFacade.skipCount;
    sort = this.financialVendorRefundFacade.sortProcessList;
    state!: State;
  clientsearchresult =[

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
  selectedPremium =[
    {
    coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
    warrant:'XXXXXXXXX', 
    amountPaid:'XXXXXXXXX', 
    groupID:'XXXXXXXXX', 
    paymentID:'XXXXXXXXX', 
    pmtMethod:'ACH', 
    pmtStatus:'Recon', 
    PCA:'XXXXXX', 
    mailCode:'XXXX',   
    by: 'by',
  },

];
  @Output() modalCloseAddEditRefundFormModal = new EventEmitter();

  constructor(  private readonly financialVendorRefundFacade: FinancialVendorRefundFacade) {}

  closeAddEditRefundFormModalClicked(){
    this.modalCloseAddEditRefundFormModal.emit(true);  
  }


  loadClaimsListGrid() {
 
    this.financialVendorRefundFacade.loadClaimsListGrid();
  }
}
