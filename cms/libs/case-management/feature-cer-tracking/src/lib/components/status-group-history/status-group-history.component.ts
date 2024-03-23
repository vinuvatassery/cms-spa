
import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CaseFacade, StatusPeriodFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { Subject } from 'rxjs/internal/Subject';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-status-group-history',
  templateUrl: './status-group-history.component.html',
})
export class StatusGroupHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;
  currentGroup$ = this.caseFacade.currentGroup$;
  groupDeleted$ = this.caseFacade.groupDeleted$;
  ddlGroups$ = this.caseFacade.ddlGroups$;
  statusGroupHistorySubject: any = new Subject<any>();
  statusGroupHistory$ = this.statusGroupHistorySubject.asObservable()
  groupList: any;
  isGroupDetailOpened: boolean = false;
  isGroupDeleteModalOpened: boolean = false;
  selectedGroupId!: string;
  loader: boolean = false;
  private statusGroupDialog: any;
  private deleteStatusGroupDialog: any;
  statusFplHistoryPhotoSubject = new Subject();
  constructor(
    private statusPeriodFacade: StatusPeriodFacade,
    private caseFacade: CaseFacade,
    private dialogService: DialogService,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadGroupHistory();
  }

  /* Private methods */
  private loadGroupHistory() {
    this.loader = true;
    this.statusPeriodFacade.loadStatusGroupHistory(this.eligibilityId).subscribe({
      next: (data) => {
        this.statusGroupHistorySubject.next(data);
        this.groupList = data;
        this.loader = false;
        if(data){
          this.loadDistinctUserIdsAndProfilePhoto(data);
        }
      },
      error: (err) => {
        this.loader = false;
        this.statusPeriodFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.statusFplHistoryPhotoSubject.next(data);
          }
        },
      });
      this.cdr.detectChanges();
    }
  } 

  loadEligibilityChangeModal(event: any, template: TemplateRef<unknown>): void{
    this.caseFacade.loadEligibilityChangeGroups(this.eligibilityId);
    this.isGroupDetailOpened = true;
    this.selectedGroupId = event.groupId;
    this.statusGroupDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onGroupDetailClosed(result: any) {
    this.isGroupDetailOpened = false;
    this.statusGroupDialog.close();
    if (result) {
      this.statusGroupDialog.close();
    }
    this.selectedGroupId = "";

  }

  onGroupChangeUpdateClicked(group: any) {
    let newGroup = {
      eligibilityId: this.eligibilityId,
      groupCodeId: group.groupCodeId,
      groupStartDate: group.groupStartDate
    };
    this.caseFacade.updateEligibilityGroup(newGroup);
    this.isGroupDetailOpened = false;
    this.statusGroupDialog.close();
    this.selectedGroupId = "";
  }

  onGroupChangeCancelClicked(event: any) {
    this.isGroupDetailOpened = false;
    this.statusGroupDialog.close();
    this.selectedGroupId = "";
  }

  onDeleteGroupClicked(event: any, template: TemplateRef<unknown>): void{
    this.statusGroupDialog.close();
    this.deleteStatusGroupDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.isGroupDeleteModalOpened = true;
  }

  onConfirmGroupDelete() {
    if (this.selectedGroupId) {
      this.caseFacade.deleteEligibilityGroup(this.selectedGroupId);
      this.groupDeleted$.subscribe((res)=>{
        if(res){
          this.loadGroupHistory();
        }
      });
      this.isGroupDeleteModalOpened = false;
      this.isGroupDetailOpened = false;
      this.deleteStatusGroupDialog.close();
      this.statusGroupDialog.close();
    }
  }

  onCancelDelete() {
    this.deleteStatusGroupDialog.close();
    this.isGroupDeleteModalOpened = false;
    this.selectedGroupId = "";
  }

}
