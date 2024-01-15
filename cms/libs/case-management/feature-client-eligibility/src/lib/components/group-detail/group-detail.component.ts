/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** External Libraries**/
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
/** Internal Libraries**/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { GroupCode, CaseFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-group-detail',
  templateUrl: './group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent implements OnInit {
  /** Input Properties **/
  @Input() currentGroup$!: Observable<any>;
  @Input() groupList: any;
  @Input() ddlGroups$!: Observable<any>;
  @Input() showDeleteOption!: boolean;
  /** Output Properties **/
  @Output() updateGroup = new EventEmitter<any>();
  @Output() cancelGroupChange = new EventEmitter();
  @Output() deleteGroupChange = new EventEmitter();
  @Output() deleteGroup = new EventEmitter<any>();
  @Output() checkIfSCheduled = new EventEmitter<boolean>();
  @Output() isModalGroupCloseClicked = new EventEmitter();
  /** Public properties **/
  currentDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());
  formUiStyle: UIFormStyle = new UIFormStyle();
  groupForm!: FormGroup;
  groupCodes!: any[];
  groupCodesSubscription = new Subscription();
  isScheduledGroupChange$ = new BehaviorSubject(false);
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  isScheduledGroup = false;
  isShowDelete = true;
  buttonText!: any;

  /** Constructor **/
  constructor(private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private readonly caseFacade: CaseFacade,
    private readonly notifySnackbarService: NotificationSnackbarService) { }

  /* Lifecycle events */
  ngOnInit(): void {
    this.buildForm();
    this.addCurrentGroupSubscription();
    this.setGroupCodes();
  }

  /* Private methods */
  private buildForm() {
    this.groupForm = new FormGroup({
      groupCodeId: new FormControl('', Validators.required),
      groupStartDate: new FormControl(this.currentDate, Validators.required)
    });
  }

  private addCurrentGroupSubscription() {
    this.currentGroup$.subscribe((group: any) => {
      if (group) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const groupDate = new Date(group.groupStartDate);
        groupDate.setHours(0, 0, 0, 0);

        const isScheduled = groupDate > today
        this.isScheduledGroup = isScheduled;
        this.isScheduledGroupChange$.next(isScheduled);
        this.checkIfSCheduled.emit(isScheduled);

        this.groupForm.patchValue({
          groupCodeId: group.groupCodeId,
          groupStartDate: groupDate > today ? new Date(group.groupStartDate) : this.currentDate
        });
        this.isDisableDelete();
      }
      if(this.isScheduledGroup){
        this.buttonText = 'Update';
      }else{
        this.buttonText = 'Change';
      }
    });
  }

  private setGroupCodes() {
    this.groupCodesSubscription = this.ddlGroups$
      .subscribe((groups: any) => {
        this.groupCodes = groups.filter((i: any) => i.groupCode !== GroupCode.BRIDGE);
      });
  }

  /* Internal events */
  onCancelGroupChange() {
    this.isModalGroupCloseClicked.emit(true);
    this.cancelGroupChange.emit();

  }

  onDeleteGroupChange() {
    this.deleteGroupChange.emit();
  }

  onUpdateGroup() {
    this.groupForm.markAllAsTouched();
    const bridgeGroupCodeId = this.groupCodes.find(i => i.groupCode === GroupCode.BRIDGE)?.groupCodeId;
    const isBridge = this.groupForm.controls['groupCodeId'].value === bridgeGroupCodeId;
    if (this.groupForm.valid) {
      if (isBridge) {
        this.notifySnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, 'Bridge cannot be selected.', NotificationSource.UI);
        return;
      }
      const groupChanged = {
        groupCodeId: this.groupForm.controls['groupCodeId'].value,
        groupStartDate: this.intl.formatDate(this.groupForm.controls['groupStartDate'].value, this.configProvider.appSettings.dateFormat)
      };

      this.updateGroup.emit(groupChanged);
    }
  }

  get groupFormControls(){
    return (this.groupForm)?.controls as any;
  }

  isDisableDelete()
  {
    if(this.groupList && this.groupList.length === 1 && this.isScheduledGroup)
    {
      this.isShowDelete = false;
      this.groupForm.controls['groupStartDate'].disable();
    }
    else{
      this.isShowDelete = true;
      this.groupForm.controls['groupStartDate'].enable();
    }
  }
}
