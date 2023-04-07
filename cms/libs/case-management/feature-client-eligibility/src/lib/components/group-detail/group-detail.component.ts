/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** External Libraries**/
import { Observable, Subscription } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
/** Internal Libraries**/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { GroupCode } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-group-detail',
  templateUrl: './group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent implements OnInit {
  /** Input Properties **/
  @Input() currentGroup$!: Observable<any>;
  @Input() ddlGroups$!: Observable<any>;
  /** Output Properties **/
  @Output() updateGroup = new EventEmitter<any>();
  @Output() cancelGroupChange = new EventEmitter();
  /** Public properties **/
  currentDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());
  formUiStyle: UIFormStyle = new UIFormStyle();
  groupForm!: FormGroup;
  groupCodes!: any[];
  groupCodesSubscription = new Subscription();
  /** Constructor **/
  constructor(private readonly intl: IntlService, 
    private readonly configProvider: ConfigurationProvider, 
    private readonly notifySnackbarService: NotificationSnackbarService  ) { }

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
        this.groupForm.patchValue({
          groupCodeId: group.groupCodeId,
          //groupStartDate: new Date(group.groupStartDate)
        });
      }
    });
  }

  private setGroupCodes() {
    this.groupCodesSubscription = this.ddlGroups$.subscribe((groups: any) => {
      this.groupCodes = groups;
    });
  }

  /* Internal events */
  onCancelGroupChange() {
    this.cancelGroupChange.emit()
  }

  onUpdateGroup() {
    this.groupForm.markAllAsTouched();
    const bridgeGroupCodeId = this.groupCodes.find(i => i.groupCode === GroupCode.BRIDGE)?.groupCodeId;
    const isBridge = this.groupForm.controls['groupCodeId'].value === bridgeGroupCodeId;
    if (this.groupForm.valid) {
      if(isBridge){
        this.notifySnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,'Bridge cannot be selected.', NotificationSource.UI);
        return;
      }
      const groupChanged = {
        groupCodeId: this.groupForm.controls['groupCodeId'].value,
        groupStartDate: this.intl.formatDate(this.groupForm.controls['groupStartDate'].value, this.configProvider.appSettings.dateFormat)
      };

      this.updateGroup.emit(groupChanged);
    }
  }
}
