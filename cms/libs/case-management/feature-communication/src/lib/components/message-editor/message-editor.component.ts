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

    /** Input properties **/
  @Input() messageList!:any;
  @Input() templateContent!: any;
  @Input() smsMessages!:any;
  @Input() isSubmitted!:any;

    /** Public properties **/
  clientVariables:any;
  allVariables:any;
  showVariable:boolean = false;
  selectedVariableMessageId:any;
  tAreaMessageMaxLength = 140;
  clientVariableExist:any =true;
  caseWorkerVariableExist:any=true;
  otherVariableExist:any=true;

    /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly loggingService: LoggingService,
    private readonly elementRef: ElementRef,) { }

    /** events **/
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

    /** Public Methods **/
  ngOnInit(): void {

    this.loadClientVariables();
    this.setInitialValueMessage();
  }

  ngOnChanges() {
    if (this.messageList !== undefined && this.messageList.length > 0) {
      if (this.templateContent !== null && this.templateContent !== undefined) {
        this.messageList.forEach((item: any) => {
          if(item.messageText === ''){
          item.messageText = this.templateContent;
          }
        });

      }
    }
    if (this.messageList !== undefined &&  this.messageList.length === 0) {
      if(this.smsMessages !== undefined && this.smsMessages.length>0){
        this.smsMessages.forEach((item :string)=> this.addNewMessageOnChange(item));
      }
    }

  }

  addNewMessageOnChange(message: string | null = null) {
    if(message != null){
      this.messageList.push({
        messageId: this.getMessageId(),
        messageText: message,
        wordCount: message?.length,
        showVariables: false,
        isValid : true
      });
    }
  }

  addNewMessage() {
      this.messageList.push({
        messageId: this.getMessageId(),
        messageText: this.templateContent ?? '',
        wordCount: this.templateContent?.length,
        showVariables: false,
        isValid : true
      });
  }


  onDeleteMessageClicked(id: any) {
    if(this.messageList.length === 1){
      this.messageList.forEach((x:any)=>{
        x.messageText = '';
      })
    }
    else{
    this.messageList = this.messageList.filter((x:any)=> x.messageId != id);
    }
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
    this.clientVariableExist = this.clientVariables.filter((x:any)=>x.parentCode =='CLIENT_VARIABLE').length;
    this.caseWorkerVariableExist = this.clientVariables.filter((x:any)=>x.parentCode =='CASE_WORKER_VARIABLE').length;
    this.otherVariableExist = this.clientVariables.filter((x:any)=>x.parentCode =='OTHER_VARIABLE').length;
    }else{
      this.clientVariableExist = true;
      this.caseWorkerVariableExist = true;
      this.otherVariableExist = true;
      this.clientVariables = this.allVariables;
    }
  }

  onMessageValueChange(item: any): void {
    if(item.messageText !== undefined && item.messageText !== ''){
      item.isValid = true;
    }
    item.wordCount = item.messageText?.length ?? 0;
  }



  bindVariableToEditor(variable: any,item:any) {
    this.insertTextAtCursor(variable, item);
  }

  insertTextAtCursor(variable: any, item:any): void {
    const textareaParent = document.getElementById(item.messageId) as HTMLTextAreaElement;
    const textarea = textareaParent.children[0] as HTMLTextAreaElement;
    const currentValue = textarea.value;
    const cursorPos = this.getCursorPos(textarea);

    // Insert the new text at the cursor position if length is less then MessageMaxLength
    const patchedValue = currentValue.slice(0, cursorPos) + '{{'+variable+'}}' + currentValue.slice(cursorPos);
    if(patchedValue.length < this.tAreaMessageMaxLength){
      textarea.value = patchedValue;
      item.messageText = textarea.value
      item.wordCount = textarea.value?.length ?? 0;
    }
  }

  getCursorPos(textarea: HTMLTextAreaElement): number {
    let cursorPosition = textarea.selectionStart;
    return cursorPosition;
  }

  ngDirtyInValid(item:any){
    if(this.isSubmitted){
      if ((item.messageText === undefined || item.messageText === '') && !item.isValid) {
        document.getElementById(item.messageId)?.classList.remove('ng-valid');
        document.getElementById(item.messageId)?.classList.add('ng-invalid');
        document.getElementById(item.messageId)?.classList.add('ng-dirty');
      }
      else {
        document.getElementById(item.messageId)?.classList.remove('ng-invalid');
        document.getElementById(item.messageId)?.classList.remove('ng-dirty');
        document.getElementById(item.messageId)?.classList.add('ng-valid');
      }
    }
    return 'ng-dirty ng-invalid';
  }
  /** Private Methods **/

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

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min; //NOSONAR
  }

  private setInitialValueMessage() {
    if (this.messageList !== undefined && this.messageList.length === 0) {
      this.addNewMessage()
    }
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
}
