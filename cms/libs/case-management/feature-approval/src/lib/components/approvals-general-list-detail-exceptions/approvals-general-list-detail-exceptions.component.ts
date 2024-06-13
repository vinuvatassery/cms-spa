import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FinancialClaimsFacade, PendingApprovalGeneralFacade, PendingApprovalPaymentTypeCode } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-exceptions',
  templateUrl: './approvals-general-list-detail-exceptions.component.html',
})
export class ApprovalsGeneralListDetailExceptionsComponent implements OnInit {
  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Input() exceptionId: any;
  approvalsExceptionCard$: any;
  @Output() onVendorClickedEvent = new EventEmitter<any>();
  private addClientRecentClaimsDialog: any;
  vendorId: any;
  clientId: any;
  clientName: any;
  claimsType: any="";
  clientBalance$ = this.financialClaimsFacade.clientBalance$;
  constructor(
    private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade,
    private dialogService: DialogService,
    private readonly route: Router,
    private readonly financialClaimsFacade: FinancialClaimsFacade
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


  onProviderNameClick(paymentRequestId: any) {
    this.onVendorClickedEvent.emit(paymentRequestId);
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
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
