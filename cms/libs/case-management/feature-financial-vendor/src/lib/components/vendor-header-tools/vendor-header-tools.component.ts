import { ChangeDetectionStrategy, Component ,Input, TemplateRef,} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CommunicationEvents } from 'libs/case-management/domain/src/lib/enums/communication-event.enum';
@Component({
  selector: 'cms-vendor-header-tools',
  templateUrl: './vendor-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorHeaderToolsComponent {
  SpecialHandlingLength = 100; 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() vendorProfile$:any;

  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  private isSendNewLetterDialog : any;
  private isSendNewEmailOpenedDialog : any;
  private isNewSMSTextOpenedDialog : any;
  private isIdCardOpenedDialog : any;  
  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      id: 'new_letter',
      click: (templatename: any): void => {
        this.onSendNewLetterClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      id: 'new_email',
      isVisible: false,
      click: (templatename: any): void => {
        this.onSendNewEmailClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      id: 'new_sms_text',
      isVisible: false,
      click: (templatename: any): void => {
        this.onNewSMSTextClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New ID Card',
      icon: 'call_to_action',
      id:'new_id_card',
      isVisible: true,
      click: (templatename: any): void => {
        this.onIdCardClicked(templatename);
      },
    },
  ];

  constructor(
    private dialogService: DialogService) {
  }

  onSendNewLetterClicked(template: TemplateRef<unknown>): void {
    this.isSendNewLetterDialog = this.dialogService.open({ 
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
    }); 
  }
  handleSendNewLetterClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewLetterDialog.close(value);
      this.isSendNewLetterOpened = false;
    }
  }
  onSendNewEmailClicked(template: TemplateRef<unknown>): void {
    this.isSendNewEmailOpenedDialog = this.dialogService.open({
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    }); 
  }
  handleSendNewEmailClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewEmailOpened = false;
      this.isSendNewEmailOpenedDialog.close();
    }
  }

  onNewSMSTextClicked(template: TemplateRef<unknown>): void {
    this.isNewSMSTextOpenedDialog = this.dialogService.open({
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    }); 
  }
  handleNewSMSTextClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isNewSMSTextOpenedDialog.close();
      this.isNewSMSTextOpened = false;
    }
  }
  onIdCardClicked(template: TemplateRef<unknown>): void {
    this.isIdCardOpenedDialog = this.dialogService.open({
      title: 'Send New ID Card',
      content: template, 
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    }); 
  }
  handleIdCardClosed(result: any) {
    if(result){
      this.isIdCardOpened = false;
      this.isIdCardOpenedDialog.close();
    }
  }
  
  onTodoDetailsClosed(result: any) {
    if(result){ 
      this.todoDetailsDialog.close();
    }
  }

  onTodoDetailsClicked( template: TemplateRef<unknown>): void {
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    }); 
  }
  onNewReminderClosed(result: any) {
    if(result){
      this.newReminderDetailsDialog.close()
    }}

    onNewReminderClicked(template: TemplateRef<unknown>): void {
      this.newReminderDetailsDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      }); 
    }
}
