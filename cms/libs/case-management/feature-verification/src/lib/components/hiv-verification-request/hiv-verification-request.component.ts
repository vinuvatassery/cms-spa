/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef,Output,EventEmitter } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';
/** Internal Libraries **/
import { VerificationFacade,
   ClientHivVerification,
  VerificationStatusCode,
  VerificationTypeCode,
  ProviderOption,
  ClientDocumentFacade,
  HivVerificationDocument, 
  WorkflowFacade,
  CompletionChecklist} from '@cms/case-management/domain';
import { SnackBarNotificationType,ConfigurationProvider} from '@cms/shared/util-core';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { StatusFlag } from '@cms/shared/ui-common';


@Component({
  selector: 'case-management-hiv-verification-request',
  templateUrl: './hiv-verification-request.component.html',
  styleUrls: ['./hiv-verification-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationRequestComponent implements OnInit{
  /** Input properties **/
  @Input() hivVerificationForm!: FormGroup;
  @Input() clientId!: number;
  @Input() clientCaseId!: any;
  @Input() clientCaseEligibilityId!: any;
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
  dateFormat = this.configurationProvider.appSettings.dateFormat;
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

  constructor( private verificationFacade: VerificationFacade,
    private readonly cdr: ChangeDetectorRef,
    private intl: IntlService, private readonly configurationProvider: ConfigurationProvider,
    public readonly clientDocumentFacade:ClientDocumentFacade,
    private readonly workflowFacade: WorkflowFacade){}
  /** Internal event methods **/
  ngOnInit(): void {
    this.providerValue$.subscribe(data=>{
      this.userId = this.hivVerificationForm.controls["userId"].value;
      this.providerOption = data;
      if(data=== ProviderOption.HealthCareProvider){
        if(this.hivVerificationForm.controls["providerEmailAddress"].value !== null && this.hivVerificationForm.controls["providerEmailAddress"].value !== ''){
          this.isSendRequest = true;
          this.sentDate = new Date(this.intl.formatDate(this.hivVerificationForm.controls["verificationStatusDate"].value, this.dateFormat))
        }
        if(this.isResendRequest || !this.isSendRequest){
          this.isEmailFieldVisible = true;
          this.isSendRequest = false;
        }
        else{
          this.isEmailFieldVisible = false;
        }
      }
      else{
        this.isEmailFieldVisible = false;
        this.isSendRequest = false;
        this.isResendRequest = false;
      }
      this.cdr.detectChanges();
    });
    this.verificationFacade.showAttachmentOptions$.subscribe(response=>{
      this.showAttachmentOptions = response;
      this.uploadedAttachment = [];
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
    });
  }
  onSendRequestClicked() {
    if (this.providerOption ===ProviderOption.HealthCareProvider) {
      this.hivVerificationForm.markAllAsTouched();
      this.hivVerificationForm.controls["providerEmailAddress"].setValidators([Validators.required, Validators.email])
      this.hivVerificationForm.controls["providerEmailAddress"].updateValueAndValidity();
    }
    if(this.hivVerificationForm.controls["providerEmailAddress"].valid){

      this.isSendRequest = true;
      this.populateModel();
      this.save();
    }
  }

  onResendRequestClicked() {
    this.isEmailFieldVisible = true;
    this.isSendRequest = false;
    this.isResendRequest = true;
    this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
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
    this.verificationFacade.showLoader();
    this.verificationFacade.save( this.clientHivVerification).subscribe({
      next:(data)=>{
        this.isResendRequest = false;
        this.verificationFacade.hivVerificationSaveSubject.next(true);
        this.sentDate =  this.clientHivVerification.verificationStatusDate;
        this.verificationFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Client hiv verification request sent successfully.'
        );
        this.verificationFacade.hideLoader();
        this.cdr.detectChanges();
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
}
