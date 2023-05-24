/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef
} from '@angular/core';


/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-send-letter',
  templateUrl: './send-letter.component.html',
  styleUrls: ['./send-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;
  @Input() mailingAddress$!: Observable<any>;

  /** Output properties  **/
  @Output() closeSendLetterEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() openDdlLetterEvent = new EventEmitter();
  @Output() emailEditorValueEvent = new EventEmitter<any>();

  private currentSessionSubscription !: Subscription;
   /** Constructor **/
   constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly ref: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly workflowFacade: WorkflowFacade,) { }

  /** Public properties **/
  public formUiStyle : UIFormStyle = new UIFormStyle();
  letterEditorValueEvent = new EventEmitter<boolean>();
  letterContentValue!: any;
  isNewLetterClicked!: any;
  isOpenLetterTemplate = false;
  isShowPreviewLetterPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  isShowSendLetterToPrintPopupClicked = false;
  currentLetterData:any;
  currentLetterPreviewData:any;
  prevClientCaseEligibilityId!: string;
  selectedTemplate!: any;
  dataValue: Array<any> = [
    {
      text: '',
    },
  ];
  popupClass = 'app-c-split-button';
  ddlTemplates: any;

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if (this.data) {
      this.isNewLetterClicked = true;
    } else {
      this.isNewLetterClicked = false;
    }
    this.loadDropdownLetterTemplates(); 
    this.loadCurrentSession();   
  }

  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.loaderService.show();
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$.subscribe((resp) => {
      if (resp) {
        this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
        }
        this.loaderService.hide();
      }
    });
  }

  /** Internal event methods **/
  onSendNewLetterClicked() {
    this.isNewLetterClicked = true;
    this.isShowPreviewLetterPopupClicked = false;
    this.isShowSendLetterToPrintPopupClicked = false;
    this.isShowSaveForLaterPopupClicked = false;
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.onCloseNewLetterClicked();
  }

  onSaveForLaterClicked() {
    this.isNewLetterClicked = false;
    this.isShowSaveForLaterPopupClicked = true;
  }

  onSendLetterToPrintDialogClicked(event: any) {
    this.isShowSendLetterToPrintPopupClicked = false;
    if (event === CommunicationEvents.Print) {
      this.closeSendLetterEvent.emit(CommunicationEvents.Print);
    } else if (event === CommunicationEvents.Close) {
      this.closeSendLetterEvent.emit(CommunicationEvents.Close);
    }
  }

  onPreviewLetterClicked() {
    this.isShowPreviewLetterPopupClicked = true;
    this.emailEditorValueEvent.emit(this.currentLetterData);
    this.selectedTemplate.templateContent = this.currentLetterData.templateContent;
    this.generateText(this.selectedTemplate);
  }
  private generateText(emailData: any){
    this.loaderService.show();
    const clientId = this.workflowFacade.clientId ?? 0;
    const caseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    this.communicationFacade.generateTextTemplate(clientId ?? 0, caseEligibilityId ?? '', emailData ?? '')
        .subscribe({
          next: (data: any) =>{
            this.loaderService.hide();
          if (data) {
            this.currentLetterPreviewData = data;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
        },
      });
  }

  onSendLetterToPrintClicked() {
    this.isNewLetterClicked = false;
    this.isShowSendLetterToPrintPopupClicked = true;
    this.isShowPreviewLetterPopupClicked = false;
    this.letterEditorValueEvent.emit(true);
  }

  onCloseNewLetterClicked() {
    this.closeSendLetterEvent.emit(CommunicationEvents.Close);
  }

  /** External event methods **/
  handleLetterEditor(event: any) {
    this.currentLetterData = event;
  }

  handleOpenTemplateClicked() { 
    this.isOpenLetterTemplate = true;
    this.loadInitialData.emit();
  }
  onClosePreview(){
    this.isShowPreviewLetterPopupClicked = false;
  }

  private loadDropdownLetterTemplates() {
    this.loaderService.show();
    const channelTypeCode = 'LETTER';
    this.communicationFacade.loadEmailTemplates('CER_AUTHORIZATION_LETTER', channelTypeCode)
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.ddlTemplates = data;
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
    },
  });
  }
  handleDdlLetterValueChange(event: any) {
    this.isOpenLetterTemplate=true;
    this.selectedTemplate = event;
    this.handleLetterEditor(event);
    this.ref.detectChanges();
    this.openDdlLetterEvent.emit();
  }
}
