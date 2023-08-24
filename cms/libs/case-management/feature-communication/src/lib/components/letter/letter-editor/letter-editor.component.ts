/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  HostListener,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
/** Facades **/
import { CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-letter-editor',
  templateUrl: './letter-editor.component.html',
  styleUrls: ['./letter-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterEditorComponent implements OnInit {
  /** Input properties **/
  @Input() dataEvent!: EventEmitter<any>;
  @Input() currentValue!: any;
  @Input() clientCaseEligibilityId!:string;
  @Input() clientId!:any;
  /** Output properties  **/
  @Output() editorValue = new EventEmitter<any>();

  /** Public properties **/
  @ViewChild('anchor') public anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup!: ElementRef;
  clientVariables$ = this.communicationFacade.clientVariables$;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  letterEditorValue!: any;
  isSearchOpened = true;
  isShowPopupClicked = false;

  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.dataEventSubscribed();
    this.loadClientVariables();
    this.loadDdlEditorVariables();
  }

  /** Private methods **/
  private dataEventSubscribed() {
    this.dataEvent.subscribe({
      next: (event: any) => {
        if (event) {
          this.editorValue.emit(this.letterEditorValue);
        }
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  private loadClientVariables() {
    this.communicationFacade.loadClientVariables();
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
      this.onToggleClicked(false);
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: any): void {
    this.onToggleClicked(false);
  }

  /** Internal event methods **/
  onToggleClicked(show?: boolean): void {
    this.isShowPopupClicked =
      show !== undefined ? show : !this.isShowPopupClicked;
    this.isSearchOpened = true;
  }

  onSearchclosed() {
    this.isSearchOpened = false;
  }

}
