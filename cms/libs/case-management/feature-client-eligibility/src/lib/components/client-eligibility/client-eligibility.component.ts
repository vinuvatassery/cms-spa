/** Angular **/
import { Component,OnInit, ChangeDetectionStrategy ,ChangeDetectorRef,Input,Output,EventEmitter} from '@angular/core';
import { first,Observable } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { WorkflowFacade,ClientDocumentFacade,ClientEligibilityFacade,ClientDocumnetEntityType,EligibilityChecklistAnswerFacade } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType} from '@cms/shared/util-core';
import {FormGroup,FormBuilder} from '@angular/forms';
@Component({
  selector: 'case-management-client-eligibility',
  templateUrl: './client-eligibility.component.html',
  styleUrls: ['./client-eligibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientEligibilityComponent implements OnInit {
  @Input() eligibilityForm: FormGroup;
  @Input() formSubmited!: boolean;
  
  @Output() savedAnswersList = new EventEmitter<any>();
  
  /** Public properties **/
  isShowException = false;
  isOpenAcceptance = false;
  isOpenDeny = false;
  isDenialLetter = false;
  isEdit = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  eligibility: any;
  incomDocuments: any = [];
  oregonDocuments: any = [];
  HIVDocuments: any = [];

  /** Constructor **/
  constructor(
    private cdr: ChangeDetectorRef
    ,private readonly loaderService: LoaderService
    ,private workflowFacade: WorkflowFacade,private route: ActivatedRoute
    ,private clientDocumentFacade:ClientDocumentFacade
    ,private clientEligibilityFacade:ClientEligibilityFacade,
    private eligibilityChecklistAnswerFacade: EligibilityChecklistAnswerFacade,
    private formBuilder: FormBuilder,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService
    ) {
      this.eligibilityForm = this.formBuilder.group({});
     }

  ngOnInit(): void {

    this.loadSessionData();
  }

  showSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }

  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          const sessionData=JSON.parse(session.sessionData);
          this.clientCaseId = sessionData.ClientCaseId;
          this.clientCaseEligibilityId = sessionData.clientCaseEligibilityId;
          this.clientId = sessionData.clientId;
          this.eligibilityForm.controls['clientCaseEligibilityId'].setValue(this.clientCaseEligibilityId);

          this.clientDocumentFacade.getClientDocumentsByClientCaseEligibilityId(this.clientCaseEligibilityId).subscribe((data: any) => {
           this.incomDocuments=data.filter((m:any)=>m.entityTypeCode===ClientDocumnetEntityType.Income);
           this.oregonDocuments=data.filter((m:any)=>m.entityTypeCode===ClientDocumnetEntityType.HomeAddressProof);
           this.HIVDocuments=data.filter((m:any)=>m.entityTypeCode===ClientDocumnetEntityType.HivVerification);
            this.getIncomeEligibility();
            this.getEligibilityChecklistAnswers();
          },(error) => {
              //this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
            })

        }
      });

  }
  getEligibilityChecklistAnswers() {
    this.loaderService.show()
    this.eligibilityChecklistAnswerFacade.getEligibilityChecklistAnswers(this.clientCaseEligibilityId).subscribe((data: any) => {
    this.savedAnswersList.emit(data);
    this.loaderService.hide();
     },(error:any) => {
      this.loaderService.hide();
       })
  }
  getIncomeEligibility() {
    this.loaderService.show()
    this.clientEligibilityFacade.getEligibility(this.clientCaseEligibilityId,this.clientId).subscribe((data: any) => {
    this.eligibility=data;
    this.cdr.detectChanges();
    this.loaderService.hide();
     },(error:any) => {
      this.loaderService.hide();
       })
  }

  viewOrDonwloadFile(type:string,clientDocumentId:string,documentName:string) {
    this.loaderService.show()
    this.clientDocumentFacade.getClientDocumentsViewDownload(clientDocumentId).subscribe((data: any) => {
      const fileUrl = window.URL.createObjectURL(data);
      if(type==='download'){
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = documentName;
        downloadLink.click();
      }else{
        window.open(fileUrl, "_blank");
      }
      this.loaderService.hide();
     },(error) => {
      this.loaderService.hide();
       this.showSnackBar(SnackBarNotificationType.ERROR, error)
     })
  }
  
  answerClick(type:string,answer:string){
    this.eligibilityForm.controls[type]?.setValue(answer);
  }


  /** Internal event methods **/
  onToggleExceptionClicked() {
    this.isShowException = !this.isShowException;
  }

  onCloseAcceptanceClicked() {
    this.isOpenAcceptance = false;
  }

  isOpenAcceptanceClicked() {
    this.isOpenAcceptance = true;
  }

  isCloseDenyClicked() {
    this.isOpenDeny = false;
  }

  isOpenDenyClicked() {
    this.isOpenDeny = true;
  }
  handleClosAfterDeny(event:boolean) {
    if(event)
    {
      this.isOpenDeny = false;
      this.isDenialLetter = true;
    }
    else
    {
      this.isOpenDeny = false;
      this.isDenialLetter = false;
    }
  }
  denialPopupClose()
  {
    this.isDenialLetter = false;
  }
}
