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
  ViewEncapsulation,
  QueryList,
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
  encapsulation: ViewEncapsulation.None,
})
export class TextMessageEditorComponent implements OnInit {
  @ViewChild("anchorInsert", { read: ElementRef }) public anchorInsert!: ElementRef;
  @ViewChild("popupInsert", { read: ElementRef })  public popupInsert!: QueryList<any>; 

  /** Input properties **/
  @Input() templateContent!: any;
  @Input() dataEvent!: EventEmitter<any>;
  @Input() currentValue!: any;
  @Input() smsMessages!: any;

  /** Output properties **/
  @Output() messageContentChangedEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();
  @Output() messagesEditor = new EventEmitter<any>();

  /** Public properties **/
  @ViewChild('textareaRef') textareaRef: any;
  @ViewChild('anchor') public anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup!: ElementRef;
  isShowPopupClicked = false;
  isSearchOpened = true;
  tareaMessagesCounter = 0;
  tareaMessageMaxLength = 140;
  selectedItem: number = -0;
  tareaMessages:
    {
      id: number,
      description: string,
      wordCount: number,
      showVariables: boolean
    }[] = [];
  messages!: string[];
  clientVariables!: any;
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  stringValues: string[] = ['MyFullName', 'MyJobTitle', 'MyPhone', 'MyEmail'];
  editor!: EditorComponent;
  smsEditorvalue!: any;
  requestBody!: string;
  item: any;
  public toggleText = "Show";
  public showInsert = false;
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly loggingService: LoggingService,
    private readonly elementRef: ElementRef,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadClientVariables();
    this.initializeMessage();
    this.dataEventSubscribed();
    this.smsEditorValueEvent(this.currentValue);
  }

  private initializeMessage() {
    if (!this.smsMessages){
    this.tareaMessages = [
      {
        id: this.getMessageId(),
        description: this.templateContent,
        wordCount: this.templateContent?.length ?? 0,
        showVariables: false
      },
    ];
  }
    this.onMessageChange();
  }

  private dataEventSubscribed() {
    this.dataEvent.subscribe({
      next: (event: any) => {
        if (event) {
          this.currentValue.messages = this.messages;
          this.editorValue.emit(this.currentValue);
        }
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        this.loggingService.logException(err);
      },
    });
  }

  smsEditorValueEvent(currentValue: any) {
    let i = 0;
    if (this.smsMessages?.length > 0) {
      this.smsMessages?.forEach((msg: any) => {
        const item = {
          id: this.getMessageId(),
          description: msg,
          wordCount: 0,
          showVariables: false
        };
        i++;
        this.tareaMessages.push(item);
      });
      this.tareaMessages = this.tareaMessages.filter((item: any) => item?.description?.trim() !== '');
    }
    this.messages = this.tareaMessages.reverse().map(user => user.description);
    this.messageContentChangedEvent.emit(this.messages);

  }

  onMessageChange() {
    this.messages = this.tareaMessages.map(user => user.description);
    this.messageContentChangedEvent.emit(this.messages);
  }

  /** Private methods **/
 
 

  /** Internal event methods **/
  onToggleInsertVariableClicked(item: any, index:any): void {
if(this.selectedItem > 0){
  this.selectedItem = 0;
} else{
  this.selectedItem = index + 1;
}

  }
  @HostListener("document:keydown", ["$event"])
  public keydown(event: KeyboardEvent): void {
    if (event.code === "Escape") {
       this.selectedItem = 0; 
    }
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.selectedItem = 0; 
    }
  }
  private contains(target: EventTarget): boolean {
    return (
      this.anchorInsert.nativeElement.contains(target) ||
      this.popupInsert?.forEach((element) => { element.valueToInsert.selectedItem=0 })
    );
  }
  private closeAllVariablePanels() {
    const isVariableAnyOpen = this.tareaMessages.findIndex(m => m.showVariables === true) !== -1;
    if (isVariableAnyOpen) {
      this.tareaMessages = this.tareaMessages.map((m: any) => ({ ...m, showVariables: false }));
    }
  }

  onDeleteMessageClicked(id: any) {
    if (this.tareaMessages.length > 0) {
      const messageIndex = this.tareaMessages.findIndex(m => m.id === id)
      if (messageIndex > -1) {
        this.tareaMessages.splice(messageIndex, 1);
      }
    }
    this.messages = this.tareaMessages.map(user => user.description);
    this.messageContentChangedEvent.emit(this.messages);
  }

  onAddNewMessageClicked() {
    if (this.tareaMessages.length < 10) {
      this.tareaMessages.push({
        id: this.getMessageId(),
        description: this.templateContent ?? '', //Make it as empty string if don't want to auto-populate the defau;t template.
        wordCount: this.templateContent?.length,
        showVariables: false
      });

      this.onMessageChange();
      this.loadClientVariables();
    }
  }

  private getMessageId() {
    let isDuplicate = false;
    let id = this.getRandomNumber();
    do {
      isDuplicate = this.tareaMessages.findIndex(m => m.id === id) !== -1;
      id = this.getRandomNumber();
    }
    while (isDuplicate);
    return id;
  }

  private getRandomNumber() {
    return Math.floor((Math.random() * 6) + 1);
  }

  onMessageValueChange(event: any, id: number): void {
    this.tareaMessages.forEach((message) => {
      if (message.id === id) {
        message.wordCount = event?.length ?? 0;
      }
    });

    this.messages = this.tareaMessages.map(user => user.description);
    this.messageContentChangedEvent.emit(this.messages);
  }

  onSearchClosed() {
    this.isShowPopupClicked = false;
    this.selectedItem = 0;
  }

  private loadClientVariables() {
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationEmailEditVariables(CommunicationEventTypeCode.TemplateVariable)
      .subscribe({
        next: (variables: any) => {
          if (variables) {
            this.clientVariables = variables;
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
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

  bindVariableToEditor(variable: any, item: { id: number, description: string, wordCount: number, showVariables: boolean }) {
    if (variable) {
      const cursorPosition = this.textareaRef?.nativeElement?.selectionStart;
      item.description = `${ item.description?.slice(0, cursorPosition)} {{${variable}}} ${item.description?.slice(cursorPosition)}`;
    }
    this.isShowPopupClicked = false;
  }
}
