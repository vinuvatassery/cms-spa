/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
/** Internal Libraries **/
import { CommunicationEvents, ScreenType, CommunicationFacade } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
@Component({
  selector: 'case-management-send-text-message',
  templateUrl: './send-text-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendTextMessageComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;
  @Input() ddlMessageRecipients$!: Observable<any>;
  @Input() isContinueDraftClicked!: boolean;
  @Input() isNewNotificationClicked!: boolean;
  @Input() notificationDratId!: string;

  /** Output properties  **/
  @Output() closeSendMessageEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  /** Public properties **/ 
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any;
  isOpenSendMessageClicked!: boolean;
  isOpenMessageTemplate = false;
  isShowSendMessageConfirmPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  formUiStyle : UIFormStyle = new UIFormStyle();
  isShowToPhoneNumbersLoader$ = new BehaviorSubject<boolean>(false);
  phoneNumbersSubscription$ = new Subscription();
  phoneNumbers!:any[];
  isClearPhoneNumbers = false;
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateSendMessageFlag();
    this.loadDdlLetterTemplates();
    this.addPhoneNumbersSubscription();
  }
  ngOnDestroy(): void {
    this.phoneNumbersSubscription$.unsubscribe();
  }

  /** Private methods **/
  private addPhoneNumbersSubscription() {
    this.phoneNumbersSubscription$ = this.ddlMessageRecipients$
    .pipe(      
      map((ph) => ph.map((p:any) => ({...p, formattedPhoneNbr: this.formatPhoneNumber(p.phoneNbr)})))
    )
    .subscribe((phoneResp: any) => {
      if(this.isClearPhoneNumbers){
        this.phoneNumbers =[];
      }else{
      this.phoneNumbers = phoneResp.filter((phone: any) => phone.smsTextConsentFlag === StatusFlag.Yes);
      this.isShowToPhoneNumbersLoader$.next(false);
      }
      this.isClearPhoneNumbers = false;
    });
  }

  private formatPhoneNumber(phoneNumberString: string) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned?.match(/^(1)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return '';
  }

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
    this.isShowSaveForLaterPopupClicked = false;
    this.closeSendMessageEvent.emit(CommunicationEvents.Close);
  }

  onCloseSendMessageConfirmClicked() {
    this.isShowSendMessageConfirmPopupClicked = false;
    if (this.data === ScreenType.Authorization) {
      this.closeSendMessageEvent.emit(CommunicationEvents.Print);
    } else if (this.data === ScreenType.Case360PageSMS) {
      this.isShowSendMessageConfirmPopupClicked = false;
    }
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
  }

  /** External event methods **/
  handleDdlTextMessageValueChange() {
    this.isOpenMessageTemplate = true;  
    this.isClearPhoneNumbers = true;  
    this.isShowToPhoneNumbersLoader$.next(true);
    this.loadInitialData.emit();
  }
}
