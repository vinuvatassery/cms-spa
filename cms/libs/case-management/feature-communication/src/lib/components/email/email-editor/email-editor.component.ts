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
      text: "Attach from Computer",
      click: (): void => {
        this.showAttachmentUpload = true;
      },
    },
    {
      text: "Attach from Client's Attachments",
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
    this.attachedFiles = null;
    this.attachedFileValidatorSize=false;
    this.attachedFiles = event.files[0].rawFile;
   if(this.attachedFiles.size>this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.attachedFileValidatorSize = true;
    this.attachedFiles = null;
    this.showAttachmentUpload = true;
   }
   this.uploadedAttachedFile = [
    {
      document: event.files[0],
      size: event.files[0].size,
      name: event.files[0].name,
      uid: ''
    },
  ];
  this.selectedAttachedFile.push(
    {
      document: event.files[0],
      size: event.files[0].size,
      name: event.files[0].name,
      uid: ''
    }
  );
  this.handleFileRemoved(event);
  this.showAttachmentUpload = false;
  }

  handleFileRemoved(event: any) {
    this.attachedFiles = null;
  }
}
