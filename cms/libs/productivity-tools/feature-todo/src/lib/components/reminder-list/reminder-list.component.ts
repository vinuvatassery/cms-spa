/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
/** Facades **/
import {ReminderFacade} from '@cms/productivity-tools/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderListComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isOpenDeleteTODOItem = false;
  isOpenTODOItemDetailsNoFeature= false;
  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  isShowReminderDetailsModal = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';

  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {
        this.onDoneClicked();
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
        this.clickOpenReminderToDoDetails();
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
        this.clickOpenDeleteToDo();
      },
    },
  ];

  /** Constructor **/
  constructor(
    private reminderFacade : ReminderFacade,
    private loaderService: LoaderService,
  ){}
  /** Internal event methods **/
  onDoneClicked() {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
   
  }

  onCloseReminderClicked() {
    this.isShowReminderDetailsModal = false;
  }

  onAddReminderClicked() {
    this.isShowReminderDetailsModal = true;
  }

  
  clickOpenReminderToDoDetails( ) {
    this.isOpenTODOItemDetailsNoFeature = true;
  
  }
  clickCloseReminderToDoDetails() {
    this.isOpenTODOItemDetailsNoFeature = false;
  }

  clickOpenDeleteToDo( ) {
    this.isOpenDeleteTODOItem = true;
  
  }
  clickCloseDeleteToDo() {
    this.isOpenDeleteTODOItem = false;
  }

  
}
