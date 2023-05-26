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
} from '@angular/core';
/** Facades **/
import { CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

/** External Libraries **/
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, ConfigurationProvider} from '@cms/shared/util-core';

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

  /** Output properties  **/
  @Output() editorValue = new EventEmitter<any>();

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
  attachedFiles: any;
  attachedFileValidatorSize: boolean = false;
  public defaultAttachedFile: any[] = [];
  public uploadedAttachedFile: any[] = [];
  public selectedAttachedFile: any[] = [];
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  public uploadRemoveUrl = 'removeUrl';
  public editorUploadOptions = [
    {
      buttonType:"btn-h-primary",
      text: "Attach from Computer system",
      id: "uploadsystemfile",
      click: (): void => {
        this.showAttachmentUpload = true;
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Attach from Client's Attachments",
      id: "attachfromclient",
      click: (): void => {
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly configurationProvider: ConfigurationProvider,) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.dataEventSubscribed();
    this.emailEditorValueEvent(this.currentValue);
    this.loadClientVariables();
    this.loadDdlEditorVariables();
  }

  ngOnChanges(){
    if(this.currentValue){
      this.emailEditorValueEvent(this.currentValue);
    }
  }

  /** Private methods **/

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
      },
    });
  }

  private loadClientVariables() {
    this.loaderService.show();
    const lovTypes = ['CER_AUTHORIZATION_CLIENT_VARIABLES','CER_AUTHORIZATION_MY_VARIABLES','CER_AUTHORIZATION_OTHER_VARIABLES'].toString();
    this.communicationFacade.loadCERAuthorizationEmailEditVariables(lovTypes)
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
    this.emailEditorvalue = emailData.templateContent;
    this.showAttachmentUpload = false;
  }

  public BindVariableToEditor(editor: EditorComponent, item: any) {
    editor.exec('insertText', { text: '{{' +item + '}}' });
    editor.value = editor.value.replace(/#CURSOR#/, item);
    this.onSearchClosed();
  }

  handleFileSelected(event: any) {
    this.attachedFileValidatorSize=false;
    for(let i=0; i < event.files.length; i++){
   if(event.files[i].size>this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.attachedFileValidatorSize = true;
    this.showAttachmentUpload = true;
    event.files = [];
    this.uploadedAttachedFile = [];
   }
  }
  //  this.uploadedAttachedFile = event.files;
if(this.attachedFileValidatorSize == false){
  if(this.selectedAttachedFile.length == 0){
    this.selectedAttachedFile = event.files;
    // this.handleFileRemoved(event.files);
    this.showAttachmentUpload = false;
  }else{
    for(let i=0; i< event.files.length; i++){
      this.selectedAttachedFile.push(event.files[i]);
      // this.handleFileRemoved(event.files);
      this.showAttachmentUpload = false;
      }
  }
}
}

  handleFileRemoved(event: any) {
    this.attachedFiles = null;
  }
  
  removeFile(index: any) {
    this.selectedAttachedFile.splice(index, 1);
  }
}
