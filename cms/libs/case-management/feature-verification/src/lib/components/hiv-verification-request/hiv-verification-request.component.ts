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
  ClientDocumentFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType,ConfigurationProvider} from '@cms/shared/util-core';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';


@Component({
  selector: 'case-management-hiv-verification-request',
  templateUrl: './hiv-verification-request.component.html',
  styleUrls: ['./hiv-verification-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationRequestComponent implements OnInit {
  /** Input properties **/
  @Input() hivVerificationForm!: FormGroup;
  @Input() clientId!: number;
  @Output() openRemoveAttachmentConfirmationEvent = new EventEmitter();
  userId!: any;
  hivVerificationAttachment!: File | undefined;
  public uploadRemoveUrl = 'removeUrl';
  /** Public properties **/
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
  popupClass1 = 'more-action-dropdown app-dropdown-action-list ';
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "View in New Tab",
      icon: "open_in_new",
      click: (): void => {
      },
    },
 
    
    {
      buttonType:"btn-h-danger",
      text: "Remove Attachment",
      icon: "delete",
      click: (): void => {
        this.openRemoveAttachmentConfirmationEvent.emit();
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
    public readonly clientDocumentFacade:ClientDocumentFacade){}
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
    //this.homeAddressProofFile = undefined;
    this.hivVerificationAttachment = undefined;
    this.hivVerificationAttachment = e.files[0].rawFile;
    this.showHivVerificationAttachmentRequiredValidation = false;
    this.showHivVerificationAttachmentSizeValidation = (this.hivVerificationAttachment?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    //this.updateHomeAddressProofCount(true);
  }

  handleFileRemoved(e: SelectEvent) {
    this.openRemoveAttachmentConfirmationEvent.emit();
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
}
