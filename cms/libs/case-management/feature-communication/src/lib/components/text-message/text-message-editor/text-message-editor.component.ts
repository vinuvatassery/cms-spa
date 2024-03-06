/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommunicationEventTypeCode, CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { EditorComponent } from '@progress/kendo-angular-editor';
@Component({
  selector: 'case-management-text-message-editor',
  templateUrl: './text-message-editor.component.html',
  styleUrls: ['./text-message-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageEditorComponent implements OnInit {
  /** Input properties **/
  @Input() templateContent!: string;
  @Input() dataEvent!: EventEmitter<any>;
  @Input() currentValue!: any;

    /** Output properties **/
  @Output() messageContentChangedEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();

  /** Public properties **/
  @ViewChild('anchor') public anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup!: ElementRef;
  isShowPopupClicked = false;
  isSearchOpened = true;
  tareaMessagesCounter = 0;
  tareaMessageMaxLength = 140;
  tareaMessages = [
    {
      id: this.tareaMessagesCounter,
      description: '',
      wordCount: 0,
    },
  ];
  messages!: string[];
  clientVariables!: any;
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  stringValues: string[] = ['MyFullName', 'MyJobTitle', 'MyPhone', 'MyEmail'];
  editor!: EditorComponent;
  smsEditorvalue!: any;
  isDeleteDisabled: boolean = false;
  requestBody!: string;
  item: any;
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly loggingService: LoggingService,) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadClientVariables();
    this.dataEventSubscribed();
    this.smsEditorValueEvent(this.currentValue);
  }

  private dataEventSubscribed() {
    this.dataEvent.subscribe({
      next: (event: any) => {
        if (event) {
          this.currentValue.templateContent = this.templateContent;
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

  smsEditorValueEvent(smsData:any){
    this.smsEditorvalue = smsData.templateContent == undefined? smsData.requestBody : smsData.templateContent;
    this.templateContent = this.smsEditorvalue;
    this.requestBody = this.templateContent;
    this.tareaMessages = [
      {
        id: this.tareaMessagesCounter,
        description: this.templateContent,
        wordCount: 0,
      },
    ];
  }

  /** Private methods **/
  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.onToggleInsertVariableClicked(false);
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: any): void {
    this.onToggleInsertVariableClicked(false);
  }

  /** Internal event methods **/
  onToggleInsertVariableClicked(show?: boolean): void {
    this.isShowPopupClicked =
      show !== undefined ? show : !this.isShowPopupClicked;
    this.isSearchOpened = true;
  }

  onDeleteMessageClicked(id: any) {
    if(this.tareaMessagesCounter == 1){
      this.isDeleteDisabled = true;
    }
    if(this.tareaMessagesCounter > 1){
    this.tareaMessagesCounter -= 1;
    this.tareaMessages.forEach((message) => {
      if (message.id === id) {
        this.tareaMessages.splice(id, 1);
      }
    });
  }
  }

  onAddNewMessageClicked() {
    this.tareaMessagesCounter += 1;
    this.tareaMessages.push({
      id: this.tareaMessagesCounter,
      description: '',
      wordCount: 0,
    });
  }

  onMessageValueChange(event: any, id: number): void {
    this.tareaMessages.forEach((message) => {
      if (message.id === id) {
        message.wordCount = event.length;
      }
    });

    this.messages = this.tareaMessages.map(user => user.description);
    this.messageContentChangedEvent.emit(this.messages);
    this.templateContent = this.messages[0];
  }

  onSearchClosed() {
    this.isSearchOpened = false;
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

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
  }

  BindVariableToEditor(editor: EditorComponent, item: any) {
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
}
