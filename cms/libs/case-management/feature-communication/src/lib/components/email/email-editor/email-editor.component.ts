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
import { CommunicationFacade, ClientDocumentFacade, EsignFacade, CommunicationEventTypeCode, DocumentFacade, ScreenType} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { EditorComponent } from '@progress/kendo-angular-editor';

/** External Libraries **/
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, ConfigurationProvider } from '@cms/shared/util-core';

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
  @Input() selectedTemplate!: any;
  @Input() selectedTemplateContent !:any;
  @Input() loadInitialData = new EventEmitter();
  @Input() clientCaseEligibilityId!:string;
  @Input() clientId!:any;
  @Input() communicationTypeCode!:any;
  @Input() isContentMissing!: boolean;
  @Input() notificationGroup!: string;
  @Input() variableName!: string;
  @Input() typeName!: string;
  @Input() templateLoadType!: string;
  /** Output properties  **/
  @Output() cerEmailAttachments = new EventEmitter();
  @Output() editorValueChangeEvent = new EventEmitter();
  @Output() contentValidateEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  public uploadRemoveUrl = 'removeUrl';
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
  clientAllDocumentList$!: any;
  formsAndDocumentList$!: any;
  searchText: string = '';
  filteredOptions !: any;
  typeCount!: number;
  myCount!: number;
  otherCount!: number;
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
    if (this.notificationGroup === ScreenType.ClientProfile) {
      this.loadClientAttachments(this.clientId);
    }
    this.loadFormsAndDocuemnts();
    this.loadClientVariables();
    this.loadDdlEditorVariables();
    this.cerAuthorizationForm = this.formBuilder.group({
      clientsAttachment:[]
    });

  }

  ngOnChanges(){
      if(this.selectedTemplate?.notificationDraftId && this.selectedTemplate?.notificationRequestAttachments?.length > 0){
            for (let file of this.selectedTemplate?.notificationRequestAttachments){
              this.selectedAttachedFile.push({
                document: file,
                size: file.fileSize,
                name: file.fileName,
                path: file.filePath,
                notificationAttachmentId: file.documentTemplateId,
                typeCode: file.typeCode
              })
            }
          this.ref.detectChanges();
          this.cerEmailAttachments.emit(this.selectedAttachedFile);
        }
        else
        {
          if(!this.isContentMissing){
          this.loadClientVendorDefaultAttachment(this.selectedTemplate.documentTemplateId ?? this.selectedTemplate.notificationTemplateId);
        }
    }

    if (this.notificationGroup === ScreenType.VendorProfile) {
      const optionIndex = this.editorUploadOptions.findIndex(i => i.id === 'attachfromclient');
      if (optionIndex > -1) {
        this.editorUploadOptions.splice(optionIndex, 1);
        this.editorUploadOptions = [...this.editorUploadOptions];
      }
    }
  }

  loadClientVendorDefaultAttachment(documentTemplateId: any) {
    this.loaderService.show();
    this.communicationFacade.loadClientAndVendorDefaultAttachments(documentTemplateId)
    .subscribe({
      next: (attachments: any) =>{
        this.selectedAttachedFile =[];
        if (attachments.length > 0) {
          for (let file of attachments){
            this.selectedAttachedFile.push({
              document: file,
              size: file.templateSize,
              name: file.description,
              notificationAttachmentId: file.notificationAttachmentId,
              typeCode: file.typeCode
            });
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

  private loadClientVariables() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationEmailEditVariables(CommunicationEventTypeCode.TemplateVariable)
    .subscribe({
      next: (variables: any) =>{
        if (variables) {
          if(this.communicationTypeCode !== CommunicationEventTypeCode.CerAuthorizationEmail || this.communicationTypeCode !== CommunicationEventTypeCode.CerAuthorizationLetter){
          variables = variables.filter((option: any) => option.lovDesc !== 'Signature');
          }
          this.clientVariables = variables;
          this.filteredOptions = this.clientVariables;
          this.typeCount = this.clientVariables.filter((variable: any) => variable.parentCode === this.typeName).length;
          this.myCount = this.clientVariables.filter((variable: any) => variable.parentCode === 'CASE_WORKER_VARIABLE').length;
          this.otherCount = this.clientVariables.filter((variable: any) => variable.parentCode === 'OTHER_VARIABLE').length;
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
    this.getFilteredVariableCount(this.filteredOptions);
    this.searchText = "";
    this.onSearchChange(this.searchText);
  }

  emailEditorValueEvent(emailData:any){
    this.selectedTemplateContent = emailData.templateContent == undefined? emailData.requestBody : emailData.templateContent;
    this.showAttachmentUpload = false;
  }

  public BindVariableToEditor(editor: EditorComponent, item: any) {
    editor.exec('insertText', { text: '{{' +item + '}}' });
    editor.value = editor.value.replace(/#CURSOR#/, item);
    this.onSearchClosed();
  }

  editorValueChange(event: any){
    this.isContentMissing = false;
    this.editorValueChangeEvent.emit(event);
    this.contentValidateHandler(true);
  }

  contentValidateHandler(event: any){
    this.contentValidateEvent.emit(true);
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
      let uploadedFile = {
        'rawFile': file.rawFile,
        'size': file.size,
        'name': file.name,
        'uid': file.uid,
        'documentPath': ''
      };
      this.selectedAttachedFile.push(uploadedFile);
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

  removeFile(event:any, index: any) {
    this.deleteEsignRequestAttachment(event, index);
  }

  removeAddedFile(index: any){
    this.selectedAttachedFile.splice(index, 1);
    this.cerEmailAttachments.emit(this.selectedAttachedFile);
  }

  clientAttachmentChange(event:any)
  {
    if(event != undefined){
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
    this.cerEmailAttachments.emit(this.selectedAttachedFile[0]);
    }
    this.showClientAttachmentUpload = false;
  }
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
    this.cerEmailAttachments.emit(this.selectedAttachedFile[0]);
    }
    this.showFormsAndDocumentsUpload = false;
   }
  }

clientAttachmentClick(item:any)
  {
    if(!item?.rawFile){
    this.loaderService.show();
    let templatePath = '';
    if(item?.notificationAttachmentId){
      templatePath = item?.document?.templatePath;
    }else if(item?.documentTemplateId){
      templatePath = item?.templatePath;
    }else if(item?.clientDocumentId){
      templatePath = item?.documentPath;
    }else{
      templatePath = item.path;
    }
    const formData = new FormData();
    formData.append('notificationAttachmentId', item?.notificationAttachmentId ?? '');
    formData.append('documentTemplateId', item?.documentTemplateId ?? '');
    formData.append('clientDocumentId', item?.clientDocumentId ?? '');
    formData.append('clientId', this.clientId ?? '');
    formData.append('clientCaseEligibilityId', this.clientCaseEligibilityId ?? '');
    formData.append('templatePath', templatePath ?? '');

    this.communicationFacade.loadAttachmentPreview(formData)
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
          this.showHideSnackBar(SnackBarNotificationType.ERROR, "File is not found at location.");
        },
      });
    }
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.communicationFacade.getClientDocumentsViewDownload(clientDocumentId);
  }

  private loadDefaultTemplateAttachment() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationTemplateAttachment(CommunicationEventTypeCode.TemplateAttachmentTypeCode)
      .subscribe({
        next: (attachments: any) => {
          if (attachments) {
            for (let file of attachments) {
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
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
  }

  private deleteEsignRequestAttachment(attachmentRequest: any, index: any) {
    this.loaderService.show();
    this.esignFacade.deleteAttachmentRequest(attachmentRequest.document.esignRequestAttachmentId)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.selectedAttachedFile.splice(index, 1);
            this.ref.detectChanges();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Attachment removed successfully.');
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

  private loadUserDraftTemplateAttachment() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationDraftAttachment(this.selectedTemplate.documentTemplateId ?? this.selectedTemplate?.notificationTemplateId)
      .subscribe({
        next: (attachments: any) => {
          if (attachments) {
            if (attachments?.esignRequestAttachments != undefined || attachments?.esignRequestAttachments != null) {
              for (let file of attachments.esignRequestAttachments) {
                this.selectedAttachedFile.push({
                  document: file,
                  size: file.attachmentSize,
                  name: file.attachmentName,
                  esignRequestId: file.esignRequestId,
                  typeCode: file.attachmentTypeCode
                })
              }
            } else {
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
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
  }

  loadLetterAttachment(documentTemplateId: string, typeCode: string) {
    this.loaderService.show();
    this.communicationFacade.loadLetterAttachment(documentTemplateId, typeCode)
      .subscribe({
        next: (attachments: any) => {
          if (attachments.length > 0) {
            for (let file of attachments) {
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
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
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

  onSearchChange(searchText: string): void {
    if(searchText){
      this.searchText = searchText;
      this.clientVariables = this.filteredOptions.filter((option: any) =>
      option.lovDesc?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.typeCount = this.clientVariables.filter((variable: any) => variable.parentCode === this.typeName).length;
    this.myCount = this.clientVariables.filter((variable: any) => variable.parentCode === 'CASE_WORKER_VARIABLE').length;
    this.otherCount = this.clientVariables.filter((variable: any) => variable.parentCode === 'OTHER_VARIABLE').length;
    }else{
      this.clientVariables = this.filteredOptions;
    }
    this.getFilteredVariableCount(this.clientVariables);
  }

  getFilteredVariableCount(clientVariables: any) {
    this.typeCount = clientVariables.filter((variable: any) => variable.parentCode === this.typeName).length;
    this.myCount = clientVariables.filter((variable: any) => variable.parentCode === 'CASE_WORKER_VARIABLE').length;
    this.otherCount = clientVariables.filter((variable: any) => variable.parentCode === 'OTHER_VARIABLE').length;
  }
}
