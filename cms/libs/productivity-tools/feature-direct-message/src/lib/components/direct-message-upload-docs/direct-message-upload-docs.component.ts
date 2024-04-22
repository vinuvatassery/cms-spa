import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {CommunicationFacade,WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { LoaderService, ConfigurationProvider,LoggingService,NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'productivity-tools-direct-message-upload-docs',
  templateUrl: './direct-message-upload-docs.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageUploadDocsComponent {
  @ViewChild('anchor',{ read: ElementRef }) public anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup!: ElementRef;
  @Input() uploadDocumentTypeDetails : any
  @Output() uploadDocumentsClosedDialog = new EventEmitter<any>();
  @Output() uploadedDocuments = new EventEmitter<any>();
  @Output() cerEmailAttachments = new EventEmitter();
  @Input() clientAttachmentForm!: FormGroup;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  showClientAttachmentUpload: boolean = false;
  showFormsAndDocumentsUpload: boolean = false;
  showAttachmentUpload: boolean = false;
  attachedFiles: any;
  @Input() notificationGroup!: string;
  @Input() clientCaseEligibilityId!:string;
  public uploadedAttachedFile: any;
  public selectedAttachedFile: any;
  public selectedSystemAttachedFile: any;
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  attachedFileValidatorSize: boolean = false;
  public uploadRemoveUrl = 'removeUrl';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  formsAndDocumentList$!: any;
  clientAllDocumentList$!: any;
  cerAuthorizationForm!:FormGroup;
  isShowPopupClicked = false;
  @Input() communicationTypeCode!:any;
  @Input() isContentMissing!: boolean;
  @Input() selectedTemplate!: any;
  @Input() selectedTemplateContent !:any;
  cerFormPreviewData:any;
   @Input() clientId!:any;
  showAttachmentOptions = true;
  onUploadDocumentsClosed(){
    this.uploadDocumentsClosedDialog.emit();
  }
  constructor(
    private readonly communicationFacade: CommunicationFacade,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly workflowFacade : WorkflowFacade,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route : ActivatedRoute,
   ) {}
   ngOnInit(): void {
    this.route.queryParamMap.subscribe((params :any) =>{
      this.clientId = params.get('id')
      if(this.clientId){
        this.loadClientAttachments(this.clientId);
      }
     })
  
   
    this.loadFormsAndDocuemnts();
    this.cerAuthorizationForm = this.formBuilder.group({
      clientsAttachment:[]
    });
  }
  handleFileSelected(event: any) {  
    this.selectedAttachedFile=event.files[0].rawFile;
    this.attachedFileValidatorSize=false;
    if(!this.attachedFileValidatorSize)
    {
     this.cerEmailAttachments.emit(this.selectedAttachedFile);
    }
   this.showAttachmentUpload = false;
  }
  handleFileRemoved(event: any) {
    this.attachedFiles = null;
  }
  formsAndDocumentChange(event:any)
  {
    if(event !== undefined){
    this.selectedSystemAttachedFile = event;
    this.showFormsAndDocumentsUpload = false;
   }
  }
  loadFormsAndDocuemnts() {
    this.loaderService.show();
    this.communicationFacade.loadFormsAndDocuments('FORM')
      .subscribe({
        next: (attachments: any) => {
          if (attachments.length > 0) {
            this.formsAndDocumentList$ = attachments;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
  }

  loadClientAttachments(clientId: any) {
    this.loaderService.show();
    this.communicationFacade.loadClientAttachments(clientId,null)
      .subscribe({
        next: (attachments: any) => {
          if (attachments.totalCount > 0) {
            this.clientAllDocumentList$ = attachments?.items;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
  }
  clientAttachmentChange(event:any)
  {
    if( event != undefined){
      this.uploadedAttachedFile =  event;
      this.showClientAttachmentUpload = false;
  }
  }
  uploadAttachments(){
    let SystemAttachmentsRequests:any = {};
    const formData = new FormData();
  if (this.selectedAttachedFile){
    formData.append("UploadedAttachments",this.selectedAttachedFile );
    this.uploadedDocuments.emit(formData);
  }
  else if(this.uploadedAttachedFile)
    {

     formData.append('SystemAttachments.FileName',this.uploadedAttachedFile.documentName);
    formData.append('SystemAttachments.FilePath',this.uploadedAttachedFile.documentPath);
    formData.append('SystemAttachments.FileSize',this.uploadedAttachedFile.documentSize);
    formData.append('SystemAttachments.DocumentTemplateId',this.uploadedAttachedFile.documentTemplateId);
    formData.append('SystemAttachments.ClientDocumentId',this.uploadedAttachedFile.clientDocumentId);
    this.uploadedDocuments.emit(formData);
  }
  else if(this.selectedSystemAttachedFile){
    formData.append('SystemAttachments.FileName',this.selectedSystemAttachedFile.description);
    formData.append('SystemAttachments.FilePath',this.selectedSystemAttachedFile.templatePath);
    formData.append('SystemAttachments.FileSize',this.selectedSystemAttachedFile.templateSize);
    formData.append('SystemAttachments.DocumentTemplateId',this.selectedSystemAttachedFile.documentTemplateId);
    this.uploadedDocuments.emit(formData);
  }
  }
}
