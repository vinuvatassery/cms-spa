/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  OnInit,
  TemplateRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit, 
  AfterContentChecked,
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
export class SendLetterPageComponent implements OnInit , OnDestroy , AfterViewInit, AfterContentChecked  {
  /** Public properties **/
  getLetterEditorValue = new EventEmitter<boolean>();
  letterContentValue!: any;
  isOpenedPrint = false;
  isOpenedPrintPreview = false;
  isCERForm = false;
  title= "Send "
  customTitle=""
  printModelTitle = "";
  confirmTitle=" letter?"
  sendType=""
  printModelText = "";
  isDisenrollmentPage = false;
  sessionId! : string
  clientId: any;
  clientCaseEligibilityId: any
  private disenrollLaterDialog: any;
  private approvalLaterDialog: any;
  private saveForLaterValidationSubscription !: Subscription;
  @ViewChild('disenrollment_letter_later', { read: TemplateRef })  disenrollment_letter_later!: TemplateRef<any>;

  @ViewChild('approval_letter_later', { read: TemplateRef })  approval_letter_later!: TemplateRef<any>;
  paperless$ = this.contactFacade.paperless$;
  paperlessFlag = 'N'
 

    /** Constructor**/
    constructor(    
      private route: ActivatedRoute,
      private workflowFacade: WorkflowFacade,
      private dialogService: DialogService, 
      private readonly contactFacade: ContactFacade,
      private readonly cdr: ChangeDetectorRef
    ) {
    }

   ngOnInit(): void {   
     
    //NOSONAR this is a temporary title setting please work on it when the form is developed
    this.isCERForm = this.route.snapshot.queryParams['wtc'] === 'CA_CER';

    this.customTitle ="Approval"
    if(this.isCERForm)
    {
      this.customTitle = "Eligibility"   
      
      this.confirmTitle = this.customTitle + this.confirmTitle
      
     if(this.route.snapshot?.data?.["title"]?.toLowerCase().includes("disenrollment")){      
      this.customTitle = "Disenrollment"   
      this.isDisenrollmentPage = true;
      this.printModelTitle = "Send Disenrollment Letter to "
      this.printModelText = "This action cannot be undone, If applicable, the client will also automatically receive a notification via email, SMS text, and/or their online portal."
     }
    }    

    this.title =this.title + this.customTitle
    this.loadCase()   
    this.addSaveForLaterValidationsSubscription();
   }

   ngOnDestroy(): void {     
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  ngAfterViewInit() {   
    this.workflowFacade.enableSaveButton();     
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();     
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      
      if(this.isDisenrollmentPage)
      {
      this.disenrollLaterDialog = this.dialogService.open({
        title: "Send Disenrollment "+this.sendType+" later?",
        content: this.disenrollment_letter_later,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
     }
     else
     {
      this.approvalLaterDialog = this.dialogService.open({
        title: "Send "+this.customTitle+" "+this.sendType+" later?",
        content: this.approval_letter_later,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
     }
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

  closeApprovalLetterModal()
  {
    this.approvalLaterDialog.close();
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
          let pageType= this.isDisenrollmentPage === true? "Disenrollment" : this.customTitle
          this.paperlessFlag = emailData?.paperlessFlag;
          this.printModelTitle = this.printModelTitle + (this.paperlessFlag === 'Y' ? 'email?' : 'print?')
          this.confirmTitle =  (this.paperlessFlag === 'Y' ? "Send "+pageType+" Email?" : "Send "+pageType+" Letter to Print?")
          this.sendType =  this.paperlessFlag === 'Y' ? 'Email' : 'Letter'       
          this.cdr.detectChanges();     
        }
      });
  }

}
