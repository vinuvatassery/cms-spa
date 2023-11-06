import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { PendingApprovalGeneralFacade, PendingApprovalPaymentTypeCode } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-exceptions',
  templateUrl: './approvals-general-list-detail-exceptions.component.html',
})
export class ApprovalsGeneralListDetailExceptionsComponent implements OnInit {
  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Input() exceptionId: any;
  @Input() approvalsExceptionCard$: any;
  @Output() onVendorClickedEvent = new EventEmitter<any>();
  vendorId: any;
  clientId: any;
  clientName: any;
  claimsType: any="";
  constructor(
    private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade
  ) {}
  
  ngOnInit(): any {
    this.pendingApprovalGeneralFacade.loadExceptionCard(this.exceptionId).subscribe({
      next: (response) => {
        this.approvalsExceptionCard$ = response;
        this.vendorId=this.approvalsExceptionCard$.vendorId
        this.clientId=this.approvalsExceptionCard$.clientId;
        this.clientName=this.approvalsExceptionCard$.clientName;        
        this.claimsType=this.getClaimType(this.approvalsExceptionCard$.serviceSubTypeCode);
      },
      error: (err) => {
        this.pendingApprovalGeneralFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }

  ifApproveOrDeny: any;
  isPanelExpanded = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  approveOrDeny(result: any) {
    this.ifApproveOrDeny = result;
  }

  onViewProviderDetailClicked(paymentRequestId: any) {
    this.onVendorClickedEvent.emit(paymentRequestId);
  }

  getClaimType(type: any) {
    if(type==PendingApprovalPaymentTypeCode.MedicalClaim || type==PendingApprovalPaymentTypeCode.MedicalPremium)
    {
        return 'medical';
    }
    else if(type==PendingApprovalPaymentTypeCode.DentalClaim || type==PendingApprovalPaymentTypeCode.DentalPremium)
    {
      return 'dental';
    }
    else
    {
      return 'pharmacy';
    }
  }
}
