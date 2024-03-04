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
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-text-message-editor',
  templateUrl: './text-message-editor.component.html',
  styleUrls: ['./text-message-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageEditorComponent {
  /** Input properties **/
  @Input() templateContent!: string;

    /** Output properties **/
  @Output() messageContentChangedEvent = new EventEmitter<any>();

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
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
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
    this.tareaMessagesCounter -= 1;
    this.tareaMessages.forEach((message) => {
      if (message.id === id) {
        this.tareaMessages.splice(id, 1);
      }
    });
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
  }

  onSearchClosed() {
    this.isSearchOpened = false;
  }
}
