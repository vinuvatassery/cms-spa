/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

/** External Libraries **/
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailComponent implements OnInit, OnDestroy {
  /** Input properties **/
  @Input() data!: any;
  @Input() ddlEmails$!: Observable<any>;

  /** Output properties  **/
  @Output() closeSendEmailEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() cerEmailContentEvent = new EventEmitter<any>(); 
  @Output() emailEditorValueEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();

  /** Public properties **/
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any = [];
  emailContentValue: any;
  isOpenSendEmailClicked!: boolean;
  isOpenDdlEmailDetails = false;
  isShowSaveForLaterPopupClicked = false;
  isShowPreviewEmailPopupClicked = false;
  isShowSendEmailConfirmationPopupClicked = false;
  isShowToEmailLoader$ = new BehaviorSubject<boolean>(false);
  emailSubscription$ = new Subscription();
  formUiStyle: UIFormStyle = new UIFormStyle();
  isClearEmails=false;
  selectedTemplate!: string;
  templateData:any = [];
  templateName: any = [];
  currentEmailData:any;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateOpenSendEmailFlag();
    //this.loadDdlLetterTemplates();
    this.loadDdlEmails();
    this.loadEmailTemplates();
    //this.addEmailSubscription();
  }

  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
  }
  /** Private methods **/
  // private addEmailSubscription() {
  //   this.emailSubscription$ = this.ddlEmails$.subscribe(() => {
  //     if(!this.isClearEmails){
  //       this.isShowToEmailLoader$.next(false);
  //     }
  //     this.isClearEmails =false;
  //   });
  // }

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

  private loadEmailTemplates() {
    this.loaderService.show();
    this.communicationFacade.loadEmailTemplates(this.selectedTemplate ?? '')
        .subscribe((data: any) => {
          if (data) {
            this.templateData = data
            this.ddlTemplates = data;
          }
          this.loaderService.hide();
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
  handleDdlEmailValueChange(event: any) {
    this.isClearEmails =true;
    this.isShowToEmailLoader$.next(true);
    this.isOpenDdlEmailDetails = true;
    this.selectedTemplate = event;
    this.editorValue.emit(event);
    this.emailContentValue = event.templateContent;
    this.handleEmailEditor(event);
  }

  handleEmailEditor(emailData: any) {
    // this.editorValue.emit(emailData);
    this.currentEmailData = emailData;
    this.editorValue.emit(emailData);
  }
}
