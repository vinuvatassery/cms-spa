/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;

  /** Output properties  **/
  @Output() closeSendEmailEvent = new EventEmitter<CommunicationEvents>();

  /** Public properties **/
  emailEditorValueEvent = new EventEmitter<any>();
  ddlEmails$ = this.communicationFacade.ddlEmails$;
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any = [];
  emailContentValue: any;
  isOpenSendEmailClicked!: boolean;
  isOpenDdlEmailDetails = false;
  isShowSaveForLaterPopupClicked = false;
  isShowPreviewEmailPopupClicked = false;
  isShowSendEmailConfirmationPopupClicked = false;
  public formUiStyle : UIFormStyle = new UIFormStyle()
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateOpenSendEmailFlag();
    this.loadDdlLetterTemplates();
    this.loadDdlEmails();
  }

  /** Private methods **/
  private updateOpenSendEmailFlag() {
    if (this.data) {
      this.isOpenSendEmailClicked = true;
    } else {
      this.isOpenSendEmailClicked = false;
    }
  }

  private loadDdlLetterTemplates() {
    this.communicationFacade.loadDdlLetterTemplates();
    this.ddlLetterTemplates$.subscribe({
      next: (ddlTemplates) => {
        this.ddlTemplates = ddlTemplates.filter((templates: any) => {
          return templates.screenName === this.data;
        });
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  private loadDdlEmails() {
    this.communicationFacade.loadDdlEmails();
  }

  /** Internal event methods **/
  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.onCloseSendEmailClicked();
  }

  OnEditEmailClicked() {
    this.isShowPreviewEmailPopupClicked = false;
    this.isShowSendEmailConfirmationPopupClicked = false;
    this.isOpenSendEmailClicked = true;
  }

  onSaveForLaterClicked() {
    this.isOpenSendEmailClicked = false;
    this.isShowSaveForLaterPopupClicked = true;
  }

  onPreviewEmailClicked() {
    this.isOpenSendEmailClicked = false;
    this.isShowPreviewEmailPopupClicked = true;
    this.emailEditorValueEvent.emit(true);
  }

  onSendEmailConfirmationDialogClicked(event: any) {
    this.isShowSendEmailConfirmationPopupClicked = false;
    if (CommunicationEvents.Print === event) {
      this.closeSendEmailEvent.emit(CommunicationEvents.Print);
    } else if (CommunicationEvents.Close === event) {
      this.closeSendEmailEvent.emit(CommunicationEvents.Close);
    }
  }

  onSendEmailConfirmationClicked() {
    this.isOpenSendEmailClicked = false;
    this.isShowPreviewEmailPopupClicked = false;
    this.isShowSendEmailConfirmationPopupClicked = true;
    this.emailEditorValueEvent.emit(true);
  }

  onCloseSendEmailClicked() {
    this.closeSendEmailEvent.emit(CommunicationEvents.Close);
  }

  /** External event methods **/
  handleDdlEmailValueChange() {
    this.isOpenDdlEmailDetails = true;
  }

  handleEmailEditor(event: any) {
    this.emailContentValue = event;
  }
}
