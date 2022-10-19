/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
/** Enums **/
import { CommunicationEvents, ScreenType } from '@cms/case-management/domain';
/** Facades **/
import { CommunicationFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-send-text-message',
  templateUrl: './send-text-message.component.html',
  styleUrls: ['./send-text-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendTextMessageComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;

  /** Output properties  **/
  @Output() closeSendMessageEvent = new EventEmitter<CommunicationEvents>();

  /** Public properties **/
  ddlMessageRecipients$ = this.communicationFacade.ddlMessageRecipients$;
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any;
  isOpenSendMessageClicked!: boolean;
  isOpenMessageTemplate = false;
  isShowSendMessageConfirmPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateSendMessageFlag();
    this.loadDdlMessageRecipients();
    this.loadDdlLetterTemplates();
  }

  /** Private methods **/
  private loadDdlLetterTemplates() {
    this.communicationFacade.loadDdlLetterTemplates();
    this.ddlLetterTemplates$.subscribe({
      next: (ddlTemplates) => {
        this.ddlTemplates = ddlTemplates.filter((templates: any) => {
          return templates.screenName === this.data;
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  private loadDdlMessageRecipients() {
    this.communicationFacade.loadDdlMessageRecipients();
  }

  private updateSendMessageFlag() {
    if (this.data) {
      this.isOpenSendMessageClicked = true;
    } else {
      this.isOpenSendMessageClicked = false;
    }
  }

  /** Internal event methods **/
  onSaveForLaterClicked() {
    this.isOpenSendMessageClicked = false;
    this.isShowSaveForLaterPopupClicked = true;
  }

  onEditMessagesClicked() {
    this.isShowSendMessageConfirmPopupClicked = false;
    this.isOpenSendMessageClicked = true;
  }

  onSendMessageConfirmClicked() {
    this.isOpenSendMessageClicked = false;
    this.isShowSendMessageConfirmPopupClicked = true;
  }

  onCloseSendMessageClicked() {
    this.closeSendMessageEvent.emit(CommunicationEvents.Close);
  }

  onCloseSendMessageConfirmClicked() {
    this.isShowSendMessageConfirmPopupClicked = false;
    if (this.data === ScreenType.Authorization) {
      this.closeSendMessageEvent.emit(CommunicationEvents.Print);
    } else if (this.data === ScreenType.Case360Page) {
      this.closeSendMessageEvent.emit(CommunicationEvents.Close);
    }
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.closeSendMessageEvent.emit(CommunicationEvents.Close);
  }

  /** External event methods **/
  handleDdlTextMessageValueChange() {
    this.isOpenMessageTemplate = true;
  }
}
