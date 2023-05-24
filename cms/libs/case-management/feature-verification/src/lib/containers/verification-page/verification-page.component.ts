/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription, first } from 'rxjs';
/** Internal Libraries **/
import { VerificationFacade, NavigationType, WorkflowFacade } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';



@Component({
  selector: 'case-management-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  hivVerificationForm!:FormGroup;
  sessionId!: string;
  clientCaseId!: string;
  clientId!: number;
  userId!:any;
  clientCaseEligibilityId : any
  private loadSessionSubscription!: Subscription;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  clientHivVerification: any;


  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private verificationFacade: VerificationFacade,private formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,private workFlowFacade: WorkflowFacade,
    private route: ActivatedRoute, private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
    this.loadSessionData();
    this.verificationFacade.hivVerificationSave$.subscribe(data=>{
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
  }

  /** Private Methods **/
  private buildForm() {
    this.hivVerificationForm = this.formBuilder.group({
      providerEmailAddress: [''],
      providerOption:[''],
      attachmentType:[''],
      verificationStatusDate:[''],
      requestedUserName:[''],
      userId:['']
    });

  }
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe({
      next: ([navigationType, isSaved]) => {
        this.loaderService.hide();
        if (isSaved) {
          this.verificationFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,'HIV Verification status updated');
          this.workflowFacade.navigate(navigationType);
        } else {
          this.workflowFacade.enableSaveButton();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  private loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session && session?.sessionData) {
          this.clientCaseId = JSON.parse(session.sessionData)?.ClientCaseId
          this.clientId = JSON.parse(session.sessionData)?.clientId ?? this.clientId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.verificationFacade.getClientHivDocuments(this.clientId);
          this.cdr.detectChanges();
          this.load();
        }

      });
  }

  private load(){
    this.verificationFacade.showLoader();
    this.verificationFacade.getHivVerificationWithAttachment( this.clientId, this.clientCaseEligibilityId).subscribe({
      next:(data)=>{
        if(data?.clientHivVerificationId){
          if(data?.verificationMethodCode == "UPLOAD_ATTACHMENT")
          {
            this.verificationFacade.showAttachmentOptions.next(false);
            this.hivVerificationForm.controls["providerOption"].setValue(data?.verificationMethodCode);
            this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
            if (data?.hivVerification?.documentName) {
              this.verificationFacade.hivVerificationUploadedDocument.next(data);
            }
            else {
              this.verificationFacade.hivVerificationUploadedDocument.next(undefined);
            }
            this.cdr.detectChanges();
          }
          else
          {
            this.verificationFacade.showAttachmentOptions.next(true);
          }

          // if(data?.hivVerification !== null){
          //   this.hivVerificationForm.controls["providerEmailAddress"].setValue(data.hivVerification["verificationToEmail"]);
          //   this.hivVerificationForm.controls["providerOption"].setValue(data.hivVerification["verificationMethodCode"]);
          //   this.hivVerificationForm.controls["verificationStatusDate"].setValue(data.hivVerification["verificationStatusDate"]);
          //   this.hivVerificationForm.controls["requestedUserName"].setValue(data["requestedUserName"]);
          //   this.hivVerificationForm.controls["userId"].setValue(data.hivVerification["creatorId"]);
          //   this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
          // }
        }
        else
        {
          this.verificationFacade.showAttachmentOptions.next(true);
        }

        this.verificationFacade.hideLoader();
      },
      error:(error)=>{
        if (error) {
          this.verificationFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.verificationFacade.hideLoader();
        }
      }
    });
  }
  private save() {
    this.validateForm();
    this.cdr.detectChanges();
    if (this.hivVerificationForm.valid) {
      this.loaderService.show()
      return this.saveHivVerification();
    }

    return of(false)
  }
  private validateForm(){
    this.hivVerificationForm.markAllAsTouched();
    this.hivVerificationForm.controls["providerOption"].setValidators([Validators.required])
    this.hivVerificationForm.controls["providerOption"].updateValueAndValidity();
    this.hivVerificationForm.updateValueAndValidity();
  }

  onAttachmentConfirmationEvent(event:any)
  {
    this.clientHivVerification = event;
  }
  private saveHivVerification() {
    return this.verificationFacade.saveHivVerification(this.clientHivVerification);
  }
}
