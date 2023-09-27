/** Angular **/
import { Component,  ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { ApprovalFacade, PendingApprovalPaymentFacade } from '@cms/productivity-tools/domain';
import { ReminderNotificationSnackbarService, ReminderSnackBarNotificationType } from '@cms/shared/util-core';
import { NotificationService } from '@progress/kendo-angular-notification';
@Component({
  selector: 'productivity-tools-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalPageComponent  {
  /** Public properties **/

  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  commonReminderSnackbar$   = this.reminderNotificationSnackbarService.snackbar$
  sortType = this.approvalFacade.sortType;
  pageSizes = this.approvalFacade.gridPageSizes;
  gridSkipCount = this.approvalFacade.skipCount;

  sortValueGeneralAPproval = this.approvalFacade.sortValueGeneralAPproval;
  sortGeneralList = this.approvalFacade.sortGeneralList;
  sortApprovalPaymentsList = this.approvalFacade.sortApprovalPaymentsList;
  sortValueApprovalPaymentsAPproval = this.approvalFacade.sortValueApprovalPaymentsAPproval;
  sortImportedClaimsList = this.approvalFacade.sortImportedClaimsList;
  sortValueImportedClaimsAPproval = this.approvalFacade.sortValueImportedClaimsAPproval;

  state!: State;
  approvalsGeneralLists$ = this.approvalFacade.approvalsGeneralList$; 
  approvalsImportedClaimsLists$ = this.approvalFacade.approvalsImportedClaimsLists$;
  pendingApprovalCount$ = this.pendingApprovalPaymentFacade.pendingApprovalCount$;
  approvalsPaymentsLists$ = this.pendingApprovalPaymentFacade.pendingApprovalGrid$
  approvalsPaymentsMainLists$ = this.pendingApprovalPaymentFacade.pendingApprovalMainList$
  /** Constructor **/
  constructor(private readonly approvalFacade: ApprovalFacade, private notificationService: NotificationService,     
              private readonly reminderNotificationSnackbarService : ReminderNotificationSnackbarService,
              private pendingApprovalPaymentFacade: PendingApprovalPaymentFacade) {
                this.pendingApprovalPaymentFacade.getAllPendingApprovalPaymentCount()
              }

   loadApprovalsGeneralGrid(event: any): void {
    this.approvalFacade.loadApprovalsGeneral();
  }

  loadApprovalsPaymentsGrid(gridDataValue : any): void {
    if(!gridDataValue.selectedPaymentType || gridDataValue.selectedPaymentType.length == 0){
      return;
    }
    this.pendingApprovalPaymentFacade.getPendingApprovalPaymentGrid(gridDataValue , gridDataValue.selectedPaymentType)
  }
  loadImportedClaimsGrid(event: any): void {
    this.approvalFacade.loadImportedClaimsLists();
  }
  notificationTriger(){
    this.approvalFacade.NotifyShowHideSnackBar(ReminderSnackBarNotificationType.LIGHT, ' Generic reminder displays at 9AM on the day of the reminder Generic reminder displays at 9AM on the day of the reminder');
    
  }
  loadApprovalsPaymentsMain(gridDataValue : any): void {
    if(!gridDataValue.selectedPaymentType || gridDataValue.selectedPaymentType.length == 0){
      return;
    }
    this.pendingApprovalPaymentFacade.getPendingApprovalPaymentMainList(gridDataValue , gridDataValue.selectedPaymentType)
  }
  
}
