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
import { WorkflowFacade } from '@cms/case-management/domain';
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
  sessionId! : string
  clientId: any;
  private disenrollLaterDialog: any;
  private saveForLaterValidationSubscription !: Subscription;
  @ViewChild('disenrollment_letter_later', { read: TemplateRef })
  disenrollment_letter_later!: TemplateRef<any>;

    /** Constructor**/
    constructor(    
      private route: ActivatedRoute,
      private workflowFacade: WorkflowFacade,
      private dialogService: DialogService
    ) {
    }

   ngOnInit(): void {   
     
    //NOSONAR this is a temporary title setting please work on it when the form is developed
    this.isCERForm = this.route.snapshot.queryParams['wtc'] === 'CA_CER';
    if(this.isCERForm)
    {
     this.title =  this.route?.snapshot?.data['title']
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
  })
  }

  closeLetterModalEvent()
  {
    this.disenrollLaterDialog.close();
  }

}
