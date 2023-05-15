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
} from '@angular/core';
/** Facades **/
import { CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

/** External Libraries **/
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailEditorComponent implements OnInit {
  /** Input properties **/
  @Input() dataEvent!: EventEmitter<any>;
  @Input() loadInitialData = new EventEmitter();
  @Input() editorValue!: any;
  /** Output properties  **/
  // @Output() editorValue = new EventEmitter<any>();

  /** Public properties **/
  @ViewChild('anchor') public anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup!: ElementRef;
  // clientVariables$ = this.communicationFacade.clientVariables$;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  emailEditorvalue!: any;
  isSearchOpened = true;
  isShowPopupClicked = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  clientVariables!: any;
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.dataEventSubscribed();
    this.emailEditorValueEvent(this.editorValue);
    this.loadClientVariables();
    this.loadDdlEditorVariables();
  }

  /** Private methods **/
  private dataEventSubscribed() {
    this.dataEvent.subscribe({
      next: (event: any) => {
        if (event) {
          this.editorValue.emit(this.emailEditorvalue);
        }
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  // private loadClientVariables() {
  //   this.communicationFacade.loadClientVariables();
  //   this.communicationFacade.loadCERAuthorizationEmailEditVariables();
  // }

  private loadClientVariables() {
    //this.communicationFacade.loadClientVariables();
    this.loaderService.show();
    this.communicationFacade.loadCERAuthorizationEmailEditVariables()
        .subscribe((variables: any) => {
          if (variables) {
            this.clientVariables = variables; 
          }
          this.loaderService.hide();
        });
  }

  private loadDdlEditorVariables() {
    this.communicationFacade.loadDdlEditorVariables();
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.onToggle(false);
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: any): void {
    this.onToggle(false);
  }

  /** Internal event methods **/
  onToggle(show?: boolean): void {
    this.isShowPopupClicked =
      show !== undefined ? show : !this.isShowPopupClicked;
    this.isSearchOpened = true;
  }

  onSearchClosed() {
    this.isSearchOpened = false;
  }

  emailEditorValueEvent(emailData:any){
    this.emailEditorvalue = emailData.templateContent;
  }

  searchVariable(event: any){
console.log(event);
  }
}
