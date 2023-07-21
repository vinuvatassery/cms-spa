/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  OnInit,
  TemplateRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactFacade, WorkflowFacade } from '@cms/case-management/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'case-management-send-letter-page',
  templateUrl: './send-letter-page.component.html',
  styleUrls: ['./send-letter-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterPageComponent implements OnInit , OnDestroy{
  /** Public properties **/
  getLetterEditorValue = new EventEmitter<boolean>();
  letterContentValue!: any;
  isOpenedPrint = false;
  isOpenedPrintPreview = false;
  isCERForm = false;
  title= "Send Approval Letter"
  printModelTitle = "Print approval letter?";
  printModelText = "";
  isDisenrollmentPage = false;
  sessionId! : string
  clientId: any;
  clientCaseEligibilityId: any
  private disenrollLaterDialog: any;
  private saveForLaterValidationSubscription !: Subscription;
  @ViewChild('disenrollment_letter_later', { read: TemplateRef })
  disenrollment_letter_later!: TemplateRef<any>;
  paperless$ = this.contactFacade.paperless$;
  paperlessFlag = 'N'

    /** Constructor**/
    constructor(    
      private route: ActivatedRoute,
      private workflowFacade: WorkflowFacade,
      private dialogService: DialogService, 
      private readonly contactFacade: ContactFacade,
    ) {
    }

   ngOnInit(): void {   
     
    //NOSONAR this is a temporary title setting please work on it when the form is developed
    this.isCERForm = this.route.snapshot.queryParams['wtc'] === 'CA_CER';
    if(this.isCERForm)
    {
     this.title =  this.route?.snapshot?.data['title']
     if(this.title.toLowerCase().includes("disenrollment")){
      this.isDisenrollmentPage = true;
      this.printModelTitle = "Send Disenrollment Letter to print?"
      this.printModelText = "This action cannot be undone, If applicable, the client will also automatically receive a notification via email, SMS text, and/or their online portal."
     }
    }
    this.loadCase()   
    this.addSaveForLaterValidationsSubscription();
   }

   ngOnDestroy(): void {     
    this.saveForLaterValidationSubscription.unsubscribe();
  }



  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      this.disenrollLaterDialog = this.dialogService.open({
        title: 'Send Disenrollment Letter later?',
        content: this.disenrollment_letter_later,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
    });
  }

  /** Internal event methods **/
  onClosePrintClicked() {
    this.isOpenedPrint = false;
  }

  onClosePrintPreviewClicked() {
    this.isOpenedPrintPreview = false;
  }

  onOpenPrintClicked() {
    this.isOpenedPrint = true;
    this.isOpenedPrintPreview = false;
    this.getLetterEditorValue.emit(true);
  }

  onOpenPrintPreviewClicked() {
    this.isOpenedPrintPreview = true;
    this.getLetterEditorValue.emit(true);
  }

  /** External event methods **/
  handleLetterEditor(event: any) {
    this.letterContentValue = event;
  }

  loadCase() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.workflowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {      
        this.clientId = JSON.parse(session.sessionData).clientId;       
        this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
         
        if(this.clientId && this.clientCaseEligibilityId )
        {
        this.loadClientPaperLessStatusHandle()
        }
  })
  }

  closeLetterModalEvent()
  {
    this.disenrollLaterDialog.close();
  }

  loadClientPaperLessStatusHandle(): void {
    this.contactFacade.loadClientPaperLessStatus(
      this.clientId,
      this.clientCaseEligibilityId
    );
   this.loadPeperLessStatus();
  }
  
  loadPeperLessStatus() {    
    this.paperless$
      ?.pipe(first((emailData: any) => emailData?.paperlessFlag != null))
      .subscribe((emailData: any) => {
        if (emailData?.paperlessFlag) {
          this.paperlessFlag = emailData?.paperlessFlag;
        }
      });
  }

}
