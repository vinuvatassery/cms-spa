/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** External Libraries**/
import { Observable } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
/** Internal Libraries**/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';

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

  /** Constructor **/
  constructor(private readonly intl: IntlService, private readonly configProvider: ConfigurationProvider,) { }

  /* Lifecycle events */
  ngOnInit(): void {
    this.buildForm();
    this.addCurrentGroupSubscription();
  }

  /* Private methods */
  private buildForm() {
    this.groupForm = new FormGroup({
      groupCodeId: new FormControl('', Validators.required),
      groupStartDate: new FormControl(null, Validators.required)
    });
  }

  private addCurrentGroupSubscription() {
    this.currentGroup$.subscribe((group: any) => {
      if (group) {
        this.groupForm.patchValue({
          groupCodeId: group.groupCodeId,
          groupStartDate: new Date(group.groupStartDate)
        });
      }
    });
  }

  /* Internal events */
  onCancelGroupChange() {
    this.cancelGroupChange.emit()
  }

  onUpdateGroup() {
    this.groupForm.markAllAsTouched();
    if (this.groupForm.valid) {
      const groupChanged = {
        groupCodeId: this.groupForm.controls['groupCodeId'].value,
        groupStartDate: this.intl.formatDate(this.groupForm.controls['groupStartDate'].value, this.configProvider.appSettings.dateFormat)
      };

      this.updateGroup.emit(groupChanged);
    }
  }
}
