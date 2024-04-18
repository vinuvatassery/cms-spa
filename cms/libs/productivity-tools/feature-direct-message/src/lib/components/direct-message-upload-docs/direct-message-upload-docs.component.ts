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
  @Output() cerEmailAttachments = new EventEmitter();
  @Input() clientAttachmentForm!: FormGroup;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  showClientAttachmentUpload: boolean = false;
  showFormsAndDocumentsUpload: boolean = false;
  showAttachmentUpload: boolean = false;
  attachedFiles: any;
  @Input() notificationGroup!: string;
  @Input() clientCaseEligibilityId!:string;
  public uploadedAttachedFile: any[] = [];
  public selectedAttachedFile: any[] = [];
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
   ) {}
   ngOnInit(): void {
    this.loadClientAttachments('348');
    this.loadFormsAndDocuemnts();
    this.cerAuthorizationForm = this.formBuilder.group({
      clientsAttachment:[]
    });
  }
  handleFileSelected(event: any) {
    this.attachedFileValidatorSize=false;
    for (let file of event.files){
   if(file.size>this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.attachedFileValidatorSize = true;
    this.showAttachmentUpload = true;
    event.files = [];
    this.uploadedAttachedFile = [];
   }
  }
  if(!this.attachedFileValidatorSize){
  if(this.selectedAttachedFile.length == 0){
    this.selectedAttachedFile = event.files;
  }else{
    for (let file of event.files){
    const isFileExists = this.selectedAttachedFile?.some((item: any) => item.name === file.name);
    if(!isFileExists){
      this.selectedAttachedFile.push(file);
     }
    }
   }
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
    const isFileExists = this.selectedAttachedFile?.some((file: any) => file.name === event.description);
    if(!isFileExists){
    this.uploadedAttachedFile = [{
      document: event,
      size: event.templateSize,
      name: event.description,
      documentTemplateId: event.documentTemplateId,
      uid: '',
      templatePath: event.templatePath
    }];
    if(this.selectedAttachedFile.length == 0){
      this.selectedAttachedFile = this.uploadedAttachedFile;
    }else{
      for (let file of this.uploadedAttachedFile){
        this.selectedAttachedFile.push(file);
       }
      }
    this.uploadedAttachedFile = [];
    this.cerEmailAttachments.emit(event);
    }
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
    this.communicationFacade.loadClientAttachments(clientId)
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
    const isFileExists = this.selectedAttachedFile?.some((file: any) => file.name === event.documentName);
    if(!isFileExists){
    this.uploadedAttachedFile = [{
      document: event,
      size: event.documentSize,
      name: event.documentName,
      clientDocumentId: event.clientDocumentId,
      uid: '',
      documentPath: event.documentPath
    }];
    if(this.selectedAttachedFile.length == 0){
      this.selectedAttachedFile = this.uploadedAttachedFile;
    }else{
      for (let file of this.uploadedAttachedFile){
        this.selectedAttachedFile.push(file);
       }
      }
    this.uploadedAttachedFile = [];
    this.cerEmailAttachments.emit(event);
    }
    this.showClientAttachmentUpload = false;
  }
  }
}
