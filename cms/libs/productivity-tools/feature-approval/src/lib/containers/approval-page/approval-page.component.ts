/** Angular **/
import { Component,  ChangeDetectionStrategy, OnInit } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { ApprovalFacade, PendingApprovalGeneralFacade, PendingApprovalPaymentFacade, UserRoleType } from '@cms/productivity-tools/domain';
import { ReminderNotificationSnackbarService, ReminderSnackBarNotificationType, DocumentFacade, ApiType } from '@cms/shared/util-core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NavigationMenuFacade, UserManagementFacade, UserDataService } from '@cms/system-config/domain';
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
  sortApprovalPaymentsList = this.pendingApprovalPaymentFacade.sortApprovalPaymentsList;
  sortValueApprovalPaymentsApproval = this.pendingApprovalPaymentFacade.sortValueApprovalPaymentsApproval;
  sortImportedClaimsList = this.approvalFacade.sortImportedClaimsList;
  sortValueImportedClaimsAPproval = this.approvalFacade.sortValueImportedClaimsAPproval;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  pendingApprovalPaymentsCount$ = this.pendingApprovalPaymentFacade.pendingApprovalPaymentsCount$;

  userLevel = 1;

  state!: State;
  approvalsGeneralLists$ = this.pendingApprovalGeneralFacade.approvalsGeneralList$;
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
              private documentFacade :  DocumentFacade,  private readonly userDataService: UserDataService,
              private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade) {
              }
  ngOnInit(): void {
    this.getUserRole();
    this.pendingApprovalPaymentsCount$.subscribe((response:any)=>{
      if(response){
        this.navigationMenuFacade.getAllPendingApprovalPaymentCount(this.userLevel);
      }
    })
  }

   loadApprovalsGeneralGrid(event: any): void {
    this.pendingApprovalGeneralFacade.loadApprovalsGeneral();
  }

  getUserRole(){
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
        if(this.userManagementFacade.hasRole(UserRoleType.Level2)){
          this.userLevel = 2;
        }
        else if(this.userManagementFacade.hasRole(UserRoleType.Level1)){
          this.userLevel = 1;
        }
        this.navigationMenuFacade.getAllPendingApprovalPaymentCount(this.userLevel);
      }
    })
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
        SkipCount : data?.gridDataRefinerValue.skipcount,
        MaxResultCount : data?.gridDataRefinerValue.maxResultCount,
        Filter : filter
      }
     let fileName = (data.selectedPaymentType[0].toUpperCase() + data.selectedPaymentType.substr(1).toLowerCase()) +'_approvals';

      this.documentFacade.getExportFile(approvalPageAndSortedRequest,`payment-batches?serviceType=${data.selectedPaymentType}&level=${this.userLevel}` , fileName, ApiType.ProductivityToolsApi);
    }
  }
}
