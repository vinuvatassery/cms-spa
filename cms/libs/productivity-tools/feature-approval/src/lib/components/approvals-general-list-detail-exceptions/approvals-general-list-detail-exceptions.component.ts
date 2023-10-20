import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PanelBarCollapseEvent, PanelBarExpandEvent } from '@progress/kendo-angular-layout';
import { UIFormStyle } from '@cms/shared/ui-tpa';


@Component({
  selector: 'productivity-tools-approvals-general-list-detail-exceptions',
  templateUrl: './approvals-general-list-detail-exceptions.component.html',
})
export class ApprovalsGeneralListDetailExceptionsComponent implements OnInit{
  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Input() exceptionId: any;
  @Input() approvalsExceedMaxBenefitCard$:any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() gridSkipCount:any;
  @Input() invoiceData$:any;
  @Input() isInvoiceLoading$:any;
  @Output() loadApprovalsExceedMaxBenefitCardEvent = new EventEmitter<any>();
  @Output() loadApprovalsExceedMaxBenefitInvoiceEvent = new EventEmitter<any>();
  @Output() onVendorClickedEvent = new EventEmitter<any>();
  
  ngOnInit(): void {
    this.loadApprovalsExceedMaxBenefitCard();
  }

  loadApprovalsExceedMaxBenefitCard()
  {
    this.loadApprovalsExceedMaxBenefitCardEvent.emit(this.exceptionId);
  }

  ifApproveOrDeny: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  approveOrDeny(result:any){
    this.ifApproveOrDeny = result;
  }

  public onPanelCollapse(event: PanelBarCollapseEvent): void {
    this.isPanelExpanded = false;
  }

  public onPanelExpand(event: PanelBarExpandEvent): void {
    this.isPanelExpanded = true;
  }

  loadApprovalsExceedMaxBenefitInvoice($event:any)
  {
    this.loadApprovalsExceedMaxBenefitInvoiceEvent.emit($event);
  }

  onViewProviderDetailClicked(paymentRequestId:any) {  
    this.onVendorClickedEvent.emit(paymentRequestId);
  }
}
