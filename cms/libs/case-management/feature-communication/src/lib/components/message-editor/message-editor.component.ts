import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { CommunicationEventTypeCode, CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss'],
})
export class MessageEditorComponent implements OnInit, OnChanges {

  formUiStyle: UIFormStyle = new UIFormStyle();
  
  @Input() messageList!:any;
  @Input() templateContent!: any;
  @Input() smsMessages!:any;

  clientVariables:any;
  allVariables:any;
  showVariable:boolean = false;
  selectedVariableMessageId:any;
  tAreaMessageMaxLength = 140;

  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly loggingService: LoggingService,
    private readonly elementRef: ElementRef,) { }
    
  ngOnInit(): void {
  
  this.loadClientVariables();
    this.validateMessage();    
  }

  ngOnChanges() {
    if (this.messageList !== undefined && this.messageList.length > 0) {
      if (this.templateContent !== null && this.templateContent !== undefined) {
        this.messageList.forEach((item: any) => {
          item.messageText = this.templateContent;
        });

      }
    }
    if (this.messageList !== undefined &&  this.messageList.length === 0) {
      if(this.smsMessages !== undefined && this.smsMessages.length>0){
        this.smsMessages.forEach((item :string)=> this.addNewMessageOnChange(item));
      }
    }

  }

  private validateMessage() {
    if (this.messageList !== undefined && this.messageList.length === 0) {
      this.messageList = [
        {
          messageId: this.getMessageId(),
          messageText: this.templateContent,
          wordCount: this.templateContent?.length ?? 0,
          showVariables: false
        },
      ];
    }
  }

  addNewMessageOnChange(message: string | null = null) {
    if(message != null){
      this.messageList.push({
        messageId: this.getMessageId(),
        messageText: message, 
        wordCount: message?.length,
        showVariables: false
      });
    }   
  }

  addNewMessage() {
    if (this.messageList.length < 10) {
      this.messageList.push({
        messageId: this.getMessageId(),
        messageText: this.templateContent ?? '', 
        wordCount: this.templateContent?.length,
        showVariables: false
      });
    }
  }


  onDeleteMessageClicked(id: any) {
    this.messageList = this.messageList.filter((x:any)=> x.messageId != id);  
  }


  private loadClientVariables() {
    this.communicationFacade.loadCERAuthorizationEmailEditVariables(CommunicationEventTypeCode.TemplateVariable)
      .subscribe({
        next: (variables: any) => {
          if (variables) {
            this.clientVariables = variables;
            this.allVariables = this.clientVariables
          }
          this.loaderService.hide();
        },
      });
  }

  showVariables(item:any){
    item.showVariable = true;
    this.showVariable = true;
    this.selectedVariableMessageId= item.messageId;
  }

  onSearchChange(searchText: string): void {
    if(searchText){
    this.clientVariables = this.allVariables.filter((option: any) =>
      option.lovDesc?.toLowerCase().includes(searchText.toLowerCase())
    );
    }else{
      this.clientVariables = this.allVariables;
    }
  }

  onMessageValueChange(item: any): void {
    item.wordCount = item.messageText?.length ?? 0;
  }

  @HostListener("document:keydown", ["$event"])
  public keydown(event: KeyboardEvent): void {
    this.clientVariables = this.allVariables;   
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    this.clientVariables = this.allVariables;
    if (event.target?.children[0]?.id !== "insertVariable" && event.target.parentElement.id !== 'searchVariable') {
      this.messageList.forEach((x: any) => {
        x.showVariable = false;
      });      
    }
    else{
      this.messageList.forEach((x: any) => {
          if(x.messageId != this.selectedVariableMessageId){
            x.showVariable = false;
          }
      });
    }
  }


  bindVariableToEditor(variable: any,item:any) {
    this.insertTextAtCursor(variable, item);    
  }

  insertTextAtCursor(variable: any, item:any): void {
    const textareaParent = document.getElementById(item.messageId) as HTMLTextAreaElement;
    const textarea = textareaParent.children[0] as HTMLTextAreaElement;
    const currentValue = textarea.value;
    const cursorPos = this.getCursorPos(textarea);
  
    // Insert the new text at the cursor position
    const patchedValue = currentValue.slice(0, cursorPos) + '{{'+variable+'}}' + currentValue.slice(cursorPos);
    textarea.value = patchedValue;
    item.messageText = textarea.value
    item.wordCount = textarea.value?.length ?? 0;
  }

  getCursorPos(textarea: HTMLTextAreaElement): number {
    let cursorPosition = textarea.selectionStart;
    return cursorPosition;
  }  

  private getMessageId() {
    let isDuplicate = false;
    let id = this.getRandomInt(1, 100);
    do {
      isDuplicate = this.messageList.findIndex((m: any) => m.messageId === id) !== -1;
      if (isDuplicate)
        id = this.getRandomInt(1, 100);
    }
    while (isDuplicate);
    return id;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
