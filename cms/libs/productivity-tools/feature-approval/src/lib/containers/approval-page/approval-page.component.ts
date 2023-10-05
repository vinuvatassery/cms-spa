/** Angular **/
import { Component,  ChangeDetectionStrategy, OnInit } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { ApprovalFacade, PendingApprovalPaymentFacade } from '@cms/productivity-tools/domain';
import { ReminderNotificationSnackbarService, ReminderSnackBarNotificationType, DocumentFacade } from '@cms/shared/util-core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NavigationMenuFacade, UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'productivity-tools-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalPageComponent implements OnInit {
  /** Public properties **/

  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  commonReminderSnackbar$   = this.reminderNotificationSnackbarService.snackbar$
  sortType = this.approvalFacade.sortType;
  pageSizes = this.approvalFacade.gridPageSizes;
  gridSkipCount = this.approvalFacade.skipCount;
  dataExportParameters! : any;

  sortValueGeneralAPproval = this.approvalFacade.sortValueGeneralAPproval;
  sortGeneralList = this.approvalFacade.sortGeneralList;
  sortApprovalPaymentsList = this.approvalFacade.sortApprovalPaymentsList;
  sortValueApprovalPaymentsAPproval = this.approvalFacade.sortValueApprovalPaymentsAPproval;
  sortImportedClaimsList = this.approvalFacade.sortImportedClaimsList;
  sortValueImportedClaimsAPproval = this.approvalFacade.sortValueImportedClaimsAPproval;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;

  userLevel = 1;

  state!: State;
  approvalsGeneralLists$ = this.approvalFacade.approvalsGeneralList$; 
  approvalsImportedClaimsLists$ = this.approvalFacade.approvalsImportedClaimsLists$;
  pendingApprovalCount$ = this.navigationMenuFacade.pendingApprovalCount$;
  approvalsPaymentsLists$ = this.pendingApprovalPaymentFacade.pendingApprovalGrid$;
  approvalsPaymentsMainLists$ = this.pendingApprovalPaymentFacade.pendingApprovalMainList$;
  pendingApprovalSubmittedSummary$ = this.pendingApprovalPaymentFacade.pendingApprovalSubmittedSummary$;
  pendingApprovalSubmit$ = this.pendingApprovalPaymentFacade.pendingApprovalSubmit$;
  batchDetailPaymentsList$ = this.pendingApprovalPaymentFacade.pendingApprovalBatchDetailPaymentsGrid$;
  batchDetailPaymentsCount$ = this.pendingApprovalPaymentFacade.pendingApprovalBatchDetailPaymentsCount$;
  /** Constructor **/
  constructor(private readonly approvalFacade: ApprovalFacade, private notificationService: NotificationService,     
              private readonly reminderNotificationSnackbarService : ReminderNotificationSnackbarService,
              private pendingApprovalPaymentFacade: PendingApprovalPaymentFacade,
              private userManagementFacade: UserManagementFacade,
              private navigationMenuFacade: NavigationMenuFacade,
              private documentFacade :  DocumentFacade) {                
              }
  ngOnInit(): void {
    this.getUserRole();
    this.navigationMenuFacade.getAllPendingApprovalPaymentCount(this.userLevel);
  }

   loadApprovalsGeneralGrid(event: any): void {
    this.approvalFacade.loadApprovalsGeneral();
  }

  getUserRole(){
    if(this.userManagementFacade.hasRole("FM1")){
      this.userLevel = 1;
      return;
    }
    if(this.userManagementFacade.hasRole("FM2")){
      this.userLevel = 2;
    }
  }

  loadApprovalsPaymentsGrid(gridDataValue : any): void {
    if(!gridDataValue.selectedPaymentType || gridDataValue.selectedPaymentType.length == 0){
      return;
    }
    this.dataExportParameters = gridDataValue;
    this.pendingApprovalPaymentFacade.getPendingApprovalPaymentGrid(gridDataValue , gridDataValue.selectedPaymentType, this.userLevel)
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
    this.pendingApprovalPaymentFacade.getPendingApprovalPaymentMainList(gridDataValue , gridDataValue.selectedPaymentType, this.userLevel)
  }

  loadBatchDetailPaymentsGrid(gridDataValue : any): void {
    if(!gridDataValue.batchId || gridDataValue.batchId.length == 0){
      return;
    }
    this.pendingApprovalPaymentFacade.getPendingApprovalBatchDetailPaymentsGrid(gridDataValue, gridDataValue.batchId, gridDataValue.selectedPaymentType)
  }
  
  loadSubmittedSummary(events:any): void {
    this.pendingApprovalPaymentFacade.loadSubmittedSummary(events);
  }
  submitData(events:any)
  {
    this.pendingApprovalPaymentFacade.submitForApproval(events);
  }

  exportPendingApprovalGridData(){
    const data = this.dataExportParameters;
    if(data){
    const  filter = JSON.stringify(data?.gridDataRefinerValue.filter);

      const approvalPageAndSortedRequest =
      {
        SortType : data?.gridDataRefinerValue.sortType,
        Sorting : data?.gridDataRefinerValue.sortColumn,
        SkipCount : data?.gridDataRefinerValue.skipCount,
        MaxResultCount : data?.gridDataRefinerValue.maxResultCount,
        Filter : filter
      }
     let fileName = (data.selectedPaymentType[0].toUpperCase() + data.selectedPaymentType.substr(1).toLowerCase()) +' Batches';

      this.documentFacade.getExportFile(approvalPageAndSortedRequest,`batches/${data.selectedPaymentType}` , fileName);
    }
  }
}
