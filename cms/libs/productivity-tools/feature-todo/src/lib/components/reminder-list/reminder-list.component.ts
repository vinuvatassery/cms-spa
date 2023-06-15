/** Angular **/
import { Component, ChangeDetectionStrategy , ElementRef, TemplateRef} from '@angular/core';
/** External libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
/** Facades **/
import {ReminderFacade} from '@cms/productivity-tools/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
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
  private newReminderDetailsDialog : any;
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
    private dialogService: DialogService
  ){}
  /** Internal event methods **/
  onDoneClicked() {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
   
  }

 

  onNewReminderClosed(result: any) {
    if(result){
      this.newReminderDetailsDialog.close()
    }}

    onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    }); 
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
