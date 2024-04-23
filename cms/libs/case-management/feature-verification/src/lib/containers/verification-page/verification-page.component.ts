/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription, first } from 'rxjs';
/** Internal Libraries **/
import { VerificationFacade, NavigationType, WorkflowFacade, EsignFacade, EsignStatusCode, WorkflowTypeCode, CommunicationEventTypeCode } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { UserDataService } from '@cms/system-config/domain';
import { StatusFlag } from '@cms/shared/ui-common';

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
  saveForLaterClickSubscription !: Subscription;
  clientHivVerification: any;
  isNotUploaded = true;
  alreadyUploaded = false;
  showAttachmentOptions = true;
  healthCareProviderExists: boolean = false;
  providerEmail!: string;
  emailSentDate?:any = null;
  loginUserName!:any;
  loginUserId!: any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  errorMessage!: string;
  isSendEmailFailed: boolean = false;
  isSendEmailClicked: boolean = false;
  workflowTypeCode:any;
  isProviderAvailable: boolean = false;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private verificationFacade: VerificationFacade,private formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,private workFlowFacade: WorkflowFacade,
    private route: ActivatedRoute, private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly router: Router,
    private readonly esignFacade: EsignFacade,
    private readonly intl: IntlService,
    private readonly userDataService: UserDataService,
    private readonly configurationProvider: ConfigurationProvider,
) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.buildForm();
    this.addSaveForLaterSubscription();
    this.addSaveSubscription();
    this.verificationFacade.isSaveandContinue$.subscribe(response=>{
      this.isNotUploaded = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.showAttachmentOptions$.subscribe(response=>{
      this.showAttachmentOptions = response;
      this.cdr.detectChanges();
    });
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

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      this.validateForm();
      if (this.hivVerificationForm.valid) {
        this.save().subscribe((response: any) => {
          if (response) {
            this.loaderService.hide();
            if (this.workflowFacade.sendLetterEmailFlag === StatusFlag.Yes) {
              if (this.workflowTypeCode === WorkflowTypeCode.NewCase) {
                this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
                  queryParamsHandling: "preserve"
                });
              }
              else {
                this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
                  queryParamsHandling: "preserve"
                });
              }
            }
          }
        })
      }
      else {
        if (this.workflowTypeCode === WorkflowTypeCode.NewCase) {
          this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
        else {
          this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
      }
    });
  }

  private loadSessionData() {
    this.verificationFacade.showLoader();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session && session?.sessionData) {
          this.clientCaseId = JSON.parse(session.sessionData)?.ClientCaseId
          this.clientId = JSON.parse(session.sessionData)?.clientId ?? this.clientId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.getHealthcareProvider();
          this.verificationFacade.getClientHivDocuments(this.clientId);
          this.cdr.detectChanges();
        }
      });
      this.verificationFacade.hideLoader();
  }

  private load(){
    this.verificationFacade.showLoader();
    this.verificationFacade.getHivVerificationWithAttachment( this.clientId, this.clientCaseEligibilityId).subscribe({
      next:(data)=>{
        if(data?.clientHivVerificationId){
          this.hivVerificationForm.controls["providerOption"].setValue(data?.verificationMethodCode);
          this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
          if(data?.verificationMethodCode == "UPLOAD_ATTACHMENT")
          {
            this.verificationFacade.showAttachmentOptions.next(false);
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

  getHealthcareProvider() {
    if(this.clientId > 0){
    this.verificationFacade.showLoader();
    this.verificationFacade.loadHealthCareProviders(this.clientId , 0 , 10, '' , 'asc', false).subscribe({
      next: (healthCareProvidersResponse : any) => {
        if(healthCareProvidersResponse)
        {
          const items = healthCareProvidersResponse["items"];
          if(items.length > 0){
            this.healthCareProviderExists = true;
            items.forEach((item: any) => {
              this.providerEmail = item?.emailAddress;
            });
            this.loadPendingEsignRequestInfo();
          }else{
            this.healthCareProviderExists = false;
            this.load();
          }
        }
        this.cdr.detectChanges();
        this.verificationFacade.hideLoader();
      },
      error: (err) => {
        this.verificationFacade.hideLoader();
        this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }
}

loadPendingEsignRequestInfo(){
  this.verificationFacade.showLoader();
    this.esignFacade.getEsignRequestInfo(this.workflowFacade.clientCaseEligibilityId ?? '', 'HIV_VERIFICATION_EMAIL')
    .subscribe({
      next: (data: any) =>{
        if (data?.esignRequestId != null) {
          if(data?.esignRequestStatusCode == EsignStatusCode.Pending || data?.esignRequestStatusCode == EsignStatusCode.InProgress){
            this.isSendEmailClicked=true;
            this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), this.dateFormat);
            this.providerEmail = data?.to.map((x: any)=>x);
            this.getLoggedInUserProfile();
          }
          else if(data?.esignRequestStatusCode == EsignStatusCode.Complete){
            this.isSendEmailClicked=true;
            this.providerEmail = data?.to.map((x: any)=>x);
            this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), this.dateFormat);
            this.getLoggedInUserProfile();
          }else if(data?.esignRequestStatusCode == EsignStatusCode.Failed){
            this.providerEmail = data?.to.map((x: any)=>x);
            this.isSendEmailFailed = true;
            this.errorMessage = data?.errorMessage;
          }
          }
          this.load();
          this.cdr.detectChanges();
          this.verificationFacade.hideLoader();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      this.loggingService.logException(err);
    },
  });
}

getLoggedInUserProfile(){
  this.verificationFacade.showLoader();
 this.userDataService.getProfile$.subscribe((profile:any)=>{
    if(profile?.length>0){
     this.loginUserName= profile[0]?.firstName+' '+profile[0]?.lastName;
     this.loginUserId = profile[0].loginUserId;
    }
  })
  this.verificationFacade.hideLoader();
}
}
