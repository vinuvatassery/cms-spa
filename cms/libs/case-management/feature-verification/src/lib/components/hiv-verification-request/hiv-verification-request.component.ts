/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef,Output,EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
/** Internal Libraries **/
import { VerificationFacade,
   ClientHivVerification,
  VerificationStatusCode,
  VerificationTypeCode,
  ProviderOption,
  ClientDocumentFacade,
  HivVerificationDocument,
  WorkflowFacade,
  CompletionChecklist,
  ScreenType,
  CommunicationEventTypeCode,
  CommunicationFacade,
  EsignFacade,
  EsignStatusCode} from '@cms/case-management/domain';
import { SnackBarNotificationType,ConfigurationProvider} from '@cms/shared/util-core';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { StatusFlag } from '@cms/shared/ui-common';
import { UserDataService } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-hiv-verification-request',
  templateUrl: './hiv-verification-request.component.html',
  styleUrls: ['./hiv-verification-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationRequestComponent implements OnInit, OnDestroy{
  /** Input properties **/
  @Input() hivVerificationForm!: FormGroup;
  @Input() clientId!: number;
  @Input() clientCaseId!: any;
  @Input() clientCaseEligibilityId!: any;
  @Input() healthCareProviderExists!: any;
  @Input() providerEmail!: any;
  @Input() emailSentDate!: any;
  @Input() loginUserName!: any;
  @Input() isSendEmailFailed!: boolean;
  @Input() errorMessage!: any;
  @Input() isSendEmailClicked!: boolean;
  @Input() loginUserId!: any;
  clientHivDocumentsList$: any;
  @Output() openRemoveAttachmentConfirmationEvent : EventEmitter<string> = new EventEmitter();
  @Output() onAttachmentConfirmationEvent = new EventEmitter();
  userId!: any;
  hivVerificationAttachment!: File | undefined;
  public uploadRemoveUrl = 'removeUrl';
  public hivVerificationUploadFile: any = undefined;
  showAttachmentOptions = true;
  showHideAttachment = true;
  uploadedAttachment: any = [];
  uploadedDate: any;
  uploadedBy: any;
  providerValueSubscription !: Subscription;
  healthCareProviderSubscription!:Subscription;
  isSendEmailVisiable: boolean = false;
  isResendClicked: boolean = false;
  isHealthCareValid: boolean = true;

  /** Public properties **/
  fileUploadRestrictions: FileRestrictions = {
    maxFileSize: this.configurationProvider.appSettings.uploadFileSizeLimit,
  };
  providerValue$ = this.verificationFacade.providerValue$;
  providerOption:any;
  isSendRequest = false;
  isResendRequest = false;
  isEmailFieldVisible=false;
  showHivVerificationAttachmentRequiredValidation = false;
  showHivVerificationAttachmentSizeValidation = false;
  sentDate !:Date ;
  clientHivVerification:ClientHivVerification = new ClientHivVerification;
  fileSize = this.configurationProvider.appSettings?.uploadFileSizeLimit;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions =
  new UploadFileRistrictionOptions();
  showDocInputLoader = false;
  hivDocument = new HivVerificationDocument();
  popupClass1 = 'more-action-dropdown app-dropdown-action-list ';
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "View in New Tab",
      icon: "open_in_new",
      click: (): void => {
        if(this.uploadedAttachment)
        {
          this.clientDocumentFacade.viewOrDownloadFile('view',this.uploadedAttachment[0].documentId,this.uploadedAttachment[0].name)
        }
      },
    },


    {
      buttonType:"btn-h-danger",
      text: "Remove Attachment",
      icon: "delete",
      click: (): void => {
        this.showHivVerificationAttachmentRequiredValidation = true;
        this.openRemoveAttachmentConfirmationEvent.emit(this.uploadedAttachment[0].clientHivVerificationId);
      },
    },
  ];


  public clientDocList = [
    {
      clientDocumentsId: 'Lorem ipsum',
       clientDocumentsName: 'Lorem ipsum dolor sit amet Lorem ipsum ',
       documentType:'Lorem ipsum Lorem ipsum'
      },
    ]
  selectedAttachedFile: any[] = [];
  emailSubject!: string;
  notificationTemplateId: any;
  defaultOption!: any;

  constructor( private verificationFacade: VerificationFacade,
    private readonly cdr: ChangeDetectorRef,
    private intl: IntlService, private readonly configurationProvider: ConfigurationProvider,
    public readonly clientDocumentFacade:ClientDocumentFacade,
    private readonly workflowFacade: WorkflowFacade,
    private readonly communicationFacade: CommunicationFacade,
    private readonly esignFacade: EsignFacade,
    private readonly userDataService: UserDataService,
){}
  /** Internal event methods **/
  ngOnInit(): void {
    this.providerValueSubscription = this.providerValue$.subscribe(data=>{
      this.userId = this.hivVerificationForm.controls["userId"].value;
      this.providerOption = data;
      this.providerEmail = this.providerEmail ?? '';
      this.emailSentDate = null;
      if(data=== ProviderOption.HealthCareProvider){
        this.loadPendingEsignRequestInfo();
    } else if(data=== ProviderOption.CaseManager){
      this.getClientHivVerification();
    }else{
        this.isEmailFieldVisible = false;
        this.isSendRequest = false;
        this.isResendRequest = false;
      }
      this.updateVerificationCount(true);
      this.cdr.detectChanges();
    });
    this.verificationFacade.showAttachmentOptions$.subscribe(response=>{
      this.showAttachmentOptions = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.showHideAttachment$.subscribe(response=>{
      this.showHideAttachment = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.clientHivDocumentsList$.subscribe(response=>{
      this.clientHivDocumentsList$ = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.formChangeEvent$.subscribe(response=>{
      this.cdr.detectChanges();
    });
    this.verificationFacade.hivUploadedDocument$.subscribe(data=>{
      if(data)
      {
        let documentData = [
          {
            name: data?.hivVerification?.documentName,
            size: data?.hivVerification?.documentSize,
            src: data?.hivVerification?.documentPath,
            uid: data?.hivVerification?.documentId,
            documentId: data?.hivVerification?.documentId,
            clientHivVerificationId: data?.clientHivVerificationId,
          },
        ];
        this.uploadedAttachment = documentData;
        this.userId = data?.creatorId;
        this.uploadedDate = data?.verificationUploadedDate;
        this.uploadedBy = data?.uploadedBy
        this.cdr.detectChanges();
        this.updateVerificationCount(true);
      }
      else{
        this.uploadedAttachment =[];
      }
    });

    this.initHealthCareProviderInvalidSubject();
  }

  initHealthCareProviderInvalidSubject() {
      this.healthCareProviderSubscription = this.verificationFacade.healthcareInvalid$.subscribe((response: any) => {
      this.isHealthCareValid = !response;
      this.cdr.detectChanges();
    })
  }

  onSendRequestClicked() {
    if(this.providerOption === ProviderOption.CaseManager){
      this.sendHivRequestCaseManager();
    }
    if (this.providerOption ===ProviderOption.HealthCareProvider) {
      this.loadHivVerificationEmail();
      this.hivVerificationForm.markAllAsTouched();
      this.hivVerificationForm.controls["providerEmailAddress"].setValidators([Validators.required, Validators.email]);
      this.hivVerificationForm.controls["providerEmailAddress"].updateValueAndValidity();
    }
  }

  healthcareProviderData(){
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(this.hivVerificationForm.controls["providerEmailAddress"].value);
    if(isValid){
      this.isSendRequest = true;
      this.populateModel();
      this.save();
    }else{
      this.hivVerificationForm.controls['providerEmailAddress'].setErrors({ 'invalidEmail': true });
    }
  }

  onResendRequestClicked() {

    //this.isResendClicked = true;
    //this.isEmailFieldVisible = true;
    //this.isSendEmailVisiable = true;
    //this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
    if(this.providerOption === ProviderOption.CaseManager){
      this.sendHivRequestCaseManager();
    }else if(this.providerOption === ProviderOption.HealthCareProvider){
      this.isResendClicked = true;
      this.isEmailFieldVisible = true;
      this.isSendEmailVisiable = true;
      this.isSendRequest = false;
    }
    this.isHealthCareValid = true;
  }

  handleFileSelected(e: SelectEvent) {
    this.hivVerificationAttachment = undefined;
    this.hivVerificationAttachment = e.files[0].rawFile;
    this.showHivVerificationAttachmentRequiredValidation = false;
    this.verificationFacade.isSaveandContinueSubject.next(this.showHivVerificationAttachmentRequiredValidation);
    this.showHivVerificationAttachmentSizeValidation = (this.hivVerificationAttachment?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    if (this.hivVerificationAttachment)
    {
      let hivVerificationDoc: HivVerificationDocument | undefined = undefined;
      hivVerificationDoc = {
        documentName: this.hivVerificationAttachment.name,
        document: this.hivVerificationAttachment,
        documentSize: this.hivVerificationAttachment.size
      };
      this.clientHivVerification.hivVerificationDoc = hivVerificationDoc;
      this.clientHivVerification.clientId = this.clientId;
      this.clientHivVerification.clientCaseEligibilityId = this.clientCaseEligibilityId;
      this.clientHivVerification.clientCaseId = this.clientCaseId;
      this.clientHivVerification.verificationMethodCode = this.providerOption;
      if(!this.showHivVerificationAttachmentRequiredValidation && !this.showHivVerificationAttachmentSizeValidation)
      {
        this.updateVerificationCount(true);
        this.onAttachmentConfirmationEvent.emit(this.clientHivVerification);
      }
    }
  }

  handleFileRemoved(e: SelectEvent) {
    this.showHivVerificationAttachmentRequiredValidation = true;
    this.verificationFacade.isSaveandContinueSubject.next(this.showHivVerificationAttachmentRequiredValidation);
    this.openRemoveAttachmentConfirmationEvent.emit(this.uploadedAttachment[0].clientHivVerificationId);
    this.updateVerificationCount(false);
  }
  private populateModel(){
    this.clientHivVerification.clientId = this.clientId;
    this.clientHivVerification.verificationStatusCode = VerificationStatusCode.Pending;
    this.clientHivVerification.verificationToEmail =  this.hivVerificationForm.controls["providerEmailAddress"].value;
    this.clientHivVerification.verificationMethodCode = this.hivVerificationForm.controls["providerOption"].value;
    this.clientHivVerification.verificationTypeCode = VerificationTypeCode.HivVerificationForm;
    this.clientHivVerification.verificationStatusDate= new Date();

  }
  private save(){
    //Initiate Adobe Esign request
    this.initiateAdobeEsignProcess(this.clientHivVerification);
  }

  clientAttachmentChange(event:any)
  {
    this.verificationFacade.isSaveandContinueSubject.next(false);
    this.clientHivVerification.hivVerificationDoc = null;
    this.clientHivVerification.clientId = this.clientId;
    this.clientHivVerification.documentId = event.clientDocumentId;
    this.clientHivVerification.clientCaseEligibilityId = this.clientCaseEligibilityId;
    this.clientHivVerification.clientCaseId = this.clientCaseId;
    this.clientHivVerification.verificationMethodCode = this.providerOption;
    this.onAttachmentConfirmationEvent.emit(this.clientHivVerification);

  }
  attachmentRadioChanged(event:any)
  {
    this.hivVerificationForm.controls["clientsAttachment"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['clientsAttachment'].updateValueAndValidity();
    this.hivVerificationForm.controls["computerAttachment"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['computerAttachment'].updateValueAndValidity();
    this.verificationFacade.isSaveandContinueSubject.next(true);
  }

  private updateVerificationCount(isCompleted: boolean) {
    const workFlowData: CompletionChecklist[] = [{
      dataPointName: 'verificationMethod',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowData);
  }

  private initiateAdobeEsignProcess(clientHivVerification: ClientHivVerification) {
    this.verificationFacade.showLoader();
    let esignRequestFormdata = this.esignFacade.prepareHivVerificationdobeEsignFormData(clientHivVerification, this.clientCaseEligibilityId, this.emailSubject, this.selectedAttachedFile, this.notificationTemplateId);
    const emailData = {};
    this.esignFacade.initiateAdobeesignRequest(esignRequestFormdata, emailData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.loadPendingEsignRequestInfo();
            this.saveHivVerificationData();
            this.isSendEmailVisiable = false;
            this.verificationFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'HIV Verification sent successfully!');
            this.cdr.detectChanges();
          }
          this.verificationFacade.hideLoader();
        },
        error: (err: any) => {
          this.verificationFacade.hideLoader();
          this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  loadHivVerificationEmail() {
    this.verificationFacade.showLoader();
    this.communicationFacade.loadEmailTemplates(ScreenType.ClientProfile, CommunicationEventTypeCode.HIVVerificationEmail,  CommunicationEventTypeCode.HIVVerificationEmail ?? '')
      .subscribe({
        next: (data: any) => {
          if (data) {
            if (data) {
              for (let template of data) {
                this.emailSubject = template.description;
                this.notificationTemplateId = template.documentTemplateId;
              }
            }
            this.loadEmailAttachment(data[0]?.documentTemplateId);
            this.cdr.detectChanges();
            this.verificationFacade.hideLoader();
          }
        },
        error: (err: any) => {
          this.verificationFacade.hideLoader();
          this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  loadEmailAttachment(documentTemplateId: any) {
    this.verificationFacade.showLoader();
    this.communicationFacade.loadClientAndVendorDefaultAttachments(documentTemplateId)
      .subscribe({
        next: (attachments: any) => {
          if (attachments.length > 0) {
            this.selectedAttachedFile=[];
            for (let file of attachments) {
              this.selectedAttachedFile.push({
                document: file,
                size: file.templateSize,
                name: file.description,
                notificationAttachmentId: file.notificationAttachmentId,
                typeCode: file.typeCode
              })
            }
            this.cdr.detectChanges();
            this.verificationFacade.hideLoader();
            this.healthcareProviderData();
          }
        },
        error: (err: any) => {
          this.verificationFacade.hideLoader();
          this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  saveHivVerificationData(){
    this.verificationFacade.showLoader();
    const formData = new FormData();
    formData.append('verificationToEmail', this.hivVerificationForm.controls["providerEmailAddress"].value ?? '');
    formData.append('clientId', this?.clientId.toString() ?? '');
    formData.append('verificationMethodCode', this.hivVerificationForm.controls["providerOption"].value ?? '');
    formData.append('verificationTypeCode', VerificationTypeCode.HivVerificationForm ?? '');
    formData.append('verificationStatusCode', VerificationStatusCode.Pending ?? '');
    this.verificationFacade.save(formData).subscribe({
    next:(data)=>{
      if(data){
        this.isResendRequest = false;
        this.verificationFacade.hivVerificationSaveSubject.next(true);
        this.verificationFacade.hideLoader();
        this.cdr.detectChanges();
      }
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

loadPendingEsignRequestInfo(){
  this.verificationFacade.showLoader();
    this.esignFacade.getEsignRequestInfo(this.workflowFacade.clientCaseEligibilityId ?? '', 'HIV_VERIFICATION_EMAIL')
    .subscribe({
      next: (data: any) =>{
        if (data?.esignRequestId != null) {
          if(data?.esignRequestStatusCode == EsignStatusCode.Pending || data?.esignRequestStatusCode == EsignStatusCode.InProgress){
            this.isSendEmailClicked=true;
            this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), "MM/dd/yyyy");
            this.intl.formatDate(new Date(), "MM/dd/yyyy")
            this.providerEmail = data?.to.map((x: any)=>x);
            this.getLoggedInUserProfile();
          }
          else if(data?.esignRequestStatusCode == EsignStatusCode.Complete){
            this.isSendEmailClicked=true;
            this.providerEmail = data?.to.map((x: any)=>x);
            this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), "MM/dd/yyyy");
            this.getLoggedInUserProfile();
          }else if(data?.esignRequestStatusCode == EsignStatusCode.Failed){
            this.providerEmail = data?.to.map((x: any)=>x);
            this.isSendEmailFailed = true;
            this.errorMessage = data?.errorMessage;
          }
            this.isEmailFieldVisible = false;
            this.isSendRequest = true;
            this.cdr.detectChanges();
          }else{
            this.isEmailFieldVisible = true;
            this.isSendEmailVisiable = true;
            this.isSendRequest = false;
            this.isResendRequest = false;
            this.emailSentDate = null;
            this.cdr.detectChanges();
          }
          this.verificationFacade.hideLoader();
    },
    error: (err: any) => {
      this.verificationFacade.hideLoader();
      this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
    },
  });
}

getLoggedInUserProfile(){
  this.verificationFacade.showLoader();
  this.userDataService.getProfile$.subscribe((profile:any)=>{
    if(profile?.length>0){
     this.loginUserName= profile[0]?.firstName+' '+profile[0]?.lastName;
    }
  })
  this.verificationFacade.hideLoader();
}
sendHivRequestCaseManager(){
    if(this.clientId != 0 && this.clientId != null && this.clientId != undefined){
      this.verificationFacade.showLoader();
      this.verificationFacade.sendHivRequestCaseManager(this.clientId).subscribe({
        next: (response: any) => {
          if(response){
            this.isSendRequest = true;
            this.emailSentDate = this.intl.formatDate(new Date(), "MM/dd/yyyy");
            this.loginUserName = response?.userName;
            this.cdr.detectChanges();
            this.verificationFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'HIV Verification sent successfully!');
          }
          this.verificationFacade.hideLoader();
        },
        error: (err: any) => {
          this.verificationFacade.hideLoader();
          this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
    }
  }

  getClientHivVerification(){
    if(this.clientId != 0 && this.clientId != null && this.clientId != undefined){
      this.verificationFacade.showLoader();
      this.verificationFacade.getClientHivVerification(this.clientId).subscribe({
        next: (response: any) => {
          if(response){
            if(response?.hivVerification?.verificationMethodCode === ProviderOption.CaseManager)
            {
            this.isSendRequest = true;
            this.loginUserName = response?.requestedUserName;
            this.emailSentDate = this.intl.formatDate(new Date(response?.hivVerification?.verificationStatusDate),"MM/dd/yyyy");
            }
          }else{
            this.isSendRequest = false;
            this.isResendRequest=false;
            this.emailSentDate=null;
            this.isEmailFieldVisible = false;
          }
          this.cdr.detectChanges();
          this.verificationFacade.hideLoader();
        },
        error: (err: any) => {
          this.isSendRequest = false;
          this.verificationFacade.hideLoader();
          this.verificationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
    }
  }


ngOnDestroy(): void {
  this.providerValueSubscription?.unsubscribe();
  this.healthCareProviderSubscription.unsubscribe();
}
}
