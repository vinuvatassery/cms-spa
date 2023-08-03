/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription, first } from 'rxjs';
/** Internal Libraries **/
import { VerificationFacade, NavigationType, WorkflowFacade } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';



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
  isNotUploaded = true;
  alreadyUploaded = false;
  showAttachmentOptions = true;


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
    this.verificationFacade.isSaveandContinue$.subscribe(response=>{
      this.isNotUploaded = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.showAttachmentOptions$.subscribe(response=>{
      this.showAttachmentOptions = response;
      this.cdr.detectChanges();
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
      userId:[''],
      clientsAttachment:[],
      computerAttachment:[]
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
    this.verificationFacade.showLoader();
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
              this.alreadyUploaded = true;
            }
            else {
              this.verificationFacade.hivVerificationUploadedDocument.next(undefined);
              this.alreadyUploaded = false;
            }
            this.cdr.detectChanges();
          }
          else
          {
            this.verificationFacade.showAttachmentOptions.next(true);
          }         
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
      if(this.hivVerificationForm.controls["providerOption"].value == 'UPLOAD_ATTACHMENT' && !this.isNotUploaded)
      {
        this.loaderService.show()
        this.verificationFacade.isSaveandContinueSubject.next(true);
        return this.saveHivVerification();
      }
      else if(this.hivVerificationForm.controls["providerOption"].value !== 'UPLOAD_ATTACHMENT' || this.alreadyUploaded)
      {
        return of(true)
      }
    }

    return of(false)
  }
  private validateForm(){
    this.hivVerificationForm.markAllAsTouched();
    this.hivVerificationForm.controls["providerOption"].setValidators([Validators.required])
    this.hivVerificationForm.controls["providerOption"].updateValueAndValidity();
    if(this.hivVerificationForm.controls['providerOption'].value == 'UPLOAD_ATTACHMENT')
    {
      this.validateUploadAttachemnt();
      this.verificationFacade.formChangeEventSubject.next(true);
    }
    else
    {
      this.resetValidations();
    }
    this.hivVerificationForm.updateValueAndValidity();
  }

  onAttachmentConfirmationEvent(event:any)
  {
    this.clientHivVerification = event;
  }
  private saveHivVerification() {
    return this.verificationFacade.saveHivVerification(this.clientHivVerification);
  }
  validateUploadAttachemnt()
  {
    if(this.showAttachmentOptions)
    {
      this.hivVerificationForm.controls["attachmentType"].setValidators([Validators.required])
      this.hivVerificationForm.controls["attachmentType"].updateValueAndValidity();
    }
    if(this.hivVerificationForm.controls['attachmentType'].value == 'Attach From Client Attachments')
    {
      this.hivVerificationForm.controls["clientsAttachment"].setValidators([Validators.required])
      this.hivVerificationForm.controls["clientsAttachment"].updateValueAndValidity();
    }
    if(this.hivVerificationForm.controls['attachmentType'].value == 'Attach From Computer')
    {
      this.hivVerificationForm.controls["computerAttachment"].setValidators([Validators.required])
      this.hivVerificationForm.controls["computerAttachment"].updateValueAndValidity();
    }
  }
  resetValidations()
  {
    this.hivVerificationForm.controls["clientsAttachment"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['clientsAttachment'].updateValueAndValidity();
    this.hivVerificationForm.controls["computerAttachment"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['computerAttachment'].updateValueAndValidity();
    this.hivVerificationForm.controls["attachmentType"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['attachmentType'].updateValueAndValidity();

  }
}
