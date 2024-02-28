/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
/** Facades **/
import { CommunicationFacade, ClientDocumentFacade, EsignFacade, CommunicationEventTypeCode} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { EditorComponent } from '@progress/kendo-angular-editor';

/** External Libraries **/
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, ConfigurationProvider} from '@cms/shared/util-core';

/** Internal Libraries **/
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'case-management-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EmailEditorComponent implements OnInit {
  /** Input properties **/
  @Input() dataEvent!: EventEmitter<any>;
  @Input() loadInitialData = new EventEmitter();
  @Input() currentValue!: any;
  @Input() clientCaseEligibilityId!:string;
  @Input() clientId!:any;
  @Input() communicationTypeCode!:any;
  /** Output properties  **/
  @Output() editorValue = new EventEmitter<any>();
  @Output() cerEmailAttachments = new EventEmitter();

  /** Public properties **/
  @ViewChild('anchor',{ read: ElementRef }) public anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup!: ElementRef;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  emailEditorvalue!: any;
  isSearchOpened = true;
  isShowPopupClicked = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  clientVariables!: any;
  previewValue!: any;
  showPreviewEmail: boolean = false;
  showAttachmentUpload: boolean = false;
  showClientAttachmentUpload: boolean = false;
  showFormsAndDocumentsUpload: boolean = false;
  attachedFiles: any;
  attachedFileValidatorSize: boolean = false;
  cerAuthorizationForm!:FormGroup;
  isDefaultAttachment: boolean = false;
  public uploadedAttachedFile: any[] = [];
  public selectedAttachedFile: any[] = [];
  cerFormPreviewData:any;
  clientAllDocumentList$: any;
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  public uploadRemoveUrl = 'removeUrl';
  stringValues: string[] = ['MyFullName', 'MyJobTitle', 'MyPhone', 'MyEmail'];
  public editorUploadOptions = [
    {
      buttonType:"btn-h-primary",
      text: "Attach from Forms & Documents",
      id: "uploadsystemfile",
      click: (): void => {
        this.showFormsAndDocumentsUpload = true;
        this.showAttachmentUpload = false;
        this.showClientAttachmentUpload = false;
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Attach from Computer",
      id: "uploadsystemfile",
      click: (): void => {
        this.showClientAttachmentUpload = false;
        this.showAttachmentUpload = true;
        this.showFormsAndDocumentsUpload = false;
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Attach from Client's Attachments",
      id: "attachfromclient",
      click: (): void => {
        this.showAttachmentUpload = false;
        this.showClientAttachmentUpload = true;
        this.showFormsAndDocumentsUpload = false;
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly configurationProvider: ConfigurationProvider,
    private formBuilder: FormBuilder,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly ref: ChangeDetectorRef,
    private readonly esignFacade: EsignFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.dataEventSubscribed();
    this.emailEditorValueEvent(this.currentValue);
    this.loadClientVariables();
    this.loadDdlEditorVariables();
    this.cerAuthorizationForm = this.formBuilder.group({
      clientsAttachment:[]
    });
  }

  ngOnChanges(){
    if(this.currentValue){
      this.selectedAttachedFile = [];
      if(this.communicationTypeCode == CommunicationEventTypeCode.CerAuthorizationEmail || this.communicationTypeCode == CommunicationEventTypeCode.CerAuthorizationLetter){
        this.loadUserDraftTemplateAttachment();
        this.loadLetterAttachment(this.currentValue.documentTemplateId, CommunicationEventTypeCode.CERAttachmentTypeCode);
      }else{
        if(this.currentValue?.notifcationDraftId && this.currentValue?.notificationRequestAttachments){
            for (let file of this.currentValue?.notificationRequestAttachments){
              this.selectedAttachedFile.push({
                document: file,
                size: file.fileSize,
                name: file.fileName,
                path: file.filePath,
                documentTemplateId: file.documentTemplateId,
                typeCode: file.typeCode
              })
            }
          this.ref.detectChanges();
          this.cerEmailAttachments.emit(this.selectedAttachedFile);
        }else{
        this.loadClientVendorDefaultAttachment(this.currentValue.documentTemplateId);
        }
      }
    }
  }

  loadClientVendorDefaultAttachment(documentTemplateId: any) {
    this.loaderService.show();
    this.communicationFacade.loadClientAndVendorDefaultAttachments(documentTemplateId)
    .subscribe({
      next: (attachments: any) =>{
        if (attachments.length > 0) {
          for (let file of attachments){
            this.selectedAttachedFile.push({
              document: file,
              size: file.templateSize,
              name: file.description,
              documentTemplateId: file.documentTemplateId,
              typeCode: file.typeCode
            })
          }
        this.ref.detectChanges();
        this.cerEmailAttachments.emit(this.selectedAttachedFile);
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      this.loggingService.logException(err);
    },
  });
  }

  /** Private methods **/

  cerEmailAttachmentEvent(event:any){
    this.cerEmailAttachments.emit(event);
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
  }

  private dataEventSubscribed() {
    this.dataEvent.subscribe({
      next: (event: any) => {
        if (event) {
          this.currentValue.templateContent = this.emailEditorvalue;
          this.editorValue.emit(this.currentValue);
        }
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
        this.loggingService.logException(err);
      },
    });
  }

  private loadClientVariables() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationEmailEditVariables(CommunicationEventTypeCode.TemplateVariable)
    .subscribe({
      next: (variables: any) =>{
        if (variables) {
          this.clientVariables = variables;
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      this.loggingService.logException(err);
    },
  });
  }

  private loadDdlEditorVariables() {
    this.communicationFacade.loadDdlEditorVariables();
  }

  @HostListener('document:keydown', ['$event'])
    public keydown(event: KeyboardEvent): void {
        if (event.code === 'Escape') {
            this.onToggle(false);
        }
    }

    @HostListener('document:click', ['$event'])
    public documentClick(event: any): void {
        if (!this.contains(event.target)) {
            this.onToggle(false);
        }
    }

    public onToggle(show?: boolean): void {
        this.isShowPopupClicked = show !== undefined ? show : !this.isShowPopupClicked;
    }

    private contains(target: EventTarget): boolean {
        return (
            this.anchor.nativeElement.contains(target) ||
            (this.popup ? this.popup.nativeElement.contains(target) : false)
        );
    }

  onSearchClosed() {
    this.isShowPopupClicked = false;
  }

  emailEditorValueEvent(emailData:any){
    this.emailEditorvalue = emailData.templateContent == undefined? emailData.requestBody : emailData.templateContent;
    this.showAttachmentUpload = false;
  }

  public BindVariableToEditor(editor: EditorComponent, item: any) {
    if(item === 'MySignature'){
      this.stringValues.forEach(value => {
        editor.exec('insertText', { text: '{{' +value + '}}' });
      });
    }else{
    editor.exec('insertText', { text: '{{' +item + '}}' });
    editor.value = editor.value.replace(/#CURSOR#/, item);
    }
    this.onSearchClosed();
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
    this.showAttachmentUpload = false;
  }else{
    for (let file of event.files){
      this.selectedAttachedFile.push(file);
      this.showAttachmentUpload = false;
     }
    }
   }
   this.cerEmailAttachments.emit(this.selectedAttachedFile);
  }

  handleFileRemoved(event: any) {
    this.attachedFiles = null;
  }

  removeFile(event:any, index: any) {
    this.deleteEsignRequestAttachment(event, index);
  }

  removeAddedFile(index: any){
    this.selectedAttachedFile.splice(index, 1);
  }

  clientAttachmentChange(event:any)
  {
    this.uploadedAttachedFile = [{
      document: event,
      size: event.documentSize,
      name: event.documentName,
      clientDocumentId: event.clientDocumentId,
      uid: ''
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
    this.showClientAttachmentUpload = false;
  }

clientAttachmentClick(item:any)
  {
    this.loaderService.show();
    this.communicationFacade.loadAttachmentPreview(this.clientId ?? 0, this.clientCaseEligibilityId ?? '', item?.documentTemplateId ?? null)
        .subscribe({
          next: (data: any) =>{
         if (data) {
            this.cerFormPreviewData = data;
            const fileUrl = window.URL.createObjectURL(data);
            window.open(fileUrl, "_blank");
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
        },
      });
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.communicationFacade.getClientDocumentsViewDownload(clientDocumentId);
 }

  private loadDefaultTemplateAttachment() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationTemplateAttachment(CommunicationEventTypeCode.TemplateAttachmentTypeCode)
    .subscribe({
      next: (attachments: any) =>{
        if (attachments) {
          for (let file of attachments){
          this.selectedAttachedFile.push({
            document: file,
            size: file.templateSize,
            name: file.description,
            documentTemplateId: file.documentTemplateId,
            typeCode: file.typeCode
          })
        }
        this.ref.detectChanges();
        this.cerEmailAttachments.emit(this.selectedAttachedFile);
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      this.loggingService.logException(err);
    },
  });
  }

  private deleteEsignRequestAttachment(attachmentRequest: any, index: any) {
    this.loaderService.show();
    this.esignFacade.deleteAttachmentRequest(attachmentRequest.document.esignRequestAttachmentId)
    .subscribe({
      next: (data: any) =>{
        if (data) {
        this.selectedAttachedFile.splice(index, 1);
        this.ref.detectChanges();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Attachment removed successfully.');
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      this.loggingService.logException(err);
    },
  });
  }

  private loadUserDraftTemplateAttachment() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationDraftAttachment(this.currentValue.documentTemplateId)
    .subscribe({
      next: (attachments: any) =>{
        if (attachments) {
          if(attachments?.esignRequestAttachments != undefined || attachments?.esignRequestAttachments != null){
            for (let file of attachments.esignRequestAttachments){
              this.selectedAttachedFile.push({
                document: file,
                size: file.attachmentSize,
                name: file.attachmentName,
                esignRequestId: file.esignRequestId,
                typeCode: file.attachmentTypeCode
              })
            }
          }else{
            this.loadDefaultTemplateAttachment();
          }
        this.ref.detectChanges();
        this.cerEmailAttachments.emit(this.selectedAttachedFile);
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      this.loggingService.logException(err);
    },
  });
  }

  loadLetterAttachment(documentTemplateId: string, typeCode: string){
    this.loaderService.show();
    this.communicationFacade.loadLetterAttachment(documentTemplateId, typeCode)
    .subscribe({
      next: (attachments: any) =>{
        if (attachments.length > 0) {
          for (let file of attachments){
            this.selectedAttachedFile.push({
              document: file,
              size: file.templateSize,
              name: file.description,
              documentTemplateId: file.documentTemplateId,
              typeCode: file.typeCode
            })
          }
        this.ref.detectChanges();
        this.cerEmailAttachments.emit(this.selectedAttachedFile);
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      this.loggingService.logException(err);
    },
  });
  }
}
