/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Enums **/
import { CommunicationEvents, ScreenType } from '@cms/case-management/domain';
/** Facades **/
import { CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-case360-page',
  templateUrl: './case360-page.component.html',
  styleUrls: ['./case360-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360PageComponent implements OnInit {
  /** Private properties **/
  private selectedCase = new BehaviorSubject<any>({});

  /** Public properties **/
  public formUiStyle : UIFormStyle = new UIFormStyle();
  ddlIncomeEP$ = this.caseFacade.ddlIncomeEP$;
  ddlFamilyAndDependentEP$ = this.caseFacade.ddlFamilyAndDependentEP$;
  ddlEmploymentEP$ = this.caseFacade.ddlEmploymentEP$;
  selectedCase$ = this.selectedCase.asObservable();
  screenName = ScreenType.Case360Page;
  isVerificationReviewPopupOpened = false;
  isTodoDetailsOpened = false;
  isNewReminderOpened = false;
  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public SendActions = [
    {
      buttonType: "btn-h-primary",
      text: "New Letter", 
      icon: "markunread_mailbox",
      click: (): void => {
        this.onSendNewLetterClicked();
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "New Email",
      icon: "mail_outline",
      click: (): void => {
       this.onSendNewEmailClicked()
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "New SMS Text",
      icon: "comment",
      click: (): void => {
       this.onNewSMSTextClicked()
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "New ID Card",
      icon: "call_to_action", 
      click: (): void => {
       this.onIdCardClicked()
      },
    },
 
  ];
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly route: ActivatedRoute
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseSelection();
    this.loadDdlFamilyAndDependentEP();
    this.loadDdlEPEmployments();
  }

  /** Private methods **/
  private caseSelection() {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.selectedCase.next(params.get('case_id'));
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  private loadDdlFamilyAndDependentEP(): void {
    this.caseFacade.loadDdlFamilyAndDependentEP();
  }

  private loadDdlEPEmployments(): void {
    this.caseFacade.loadDdlEPEmployments();
  }

  /** Internal event methods **/
  onTodoDetailsClosed() {
    this.isTodoDetailsOpened = false;
  }

  onTodoDetailsClicked() {
    this.isTodoDetailsOpened = true;
  }

  onNewReminderClosed() {
    this.isNewReminderOpened = false;
  }

  onNewReminderClicked() {
    this.isNewReminderOpened = true;
  }

  onIdCardClicked() {
    this.isIdCardOpened = true;
  }

  onSendNewLetterClicked() {
    this.isSendNewLetterOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailOpened = true;
  }

  onNewSMSTextClicked() {
    this.isNewSMSTextOpened = true;
  }

  onVerificationReviewClosed() {
    this.isVerificationReviewPopupOpened = false;
  }

  onVerificationReviewClicked() {
    this.isVerificationReviewPopupOpened = true;
  }

  onIdCardClosed() {
    this.isIdCardOpened = false;
  }

  /** External event methods **/
  handleSendNewEmailClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewEmailOpened = false;
    }
  }

  handleNewSMSTextClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isNewSMSTextOpened = false;
    }
  }

  handleSendNewLetterClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewLetterOpened = false;
    }
  }

  handleIdCardClosed() {
    this.isIdCardOpened = false;
  }
}
