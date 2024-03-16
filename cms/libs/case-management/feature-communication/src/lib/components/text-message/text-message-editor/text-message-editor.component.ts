/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-text-message-editor',
  templateUrl: './text-message-editor.component.html',
  styleUrls: ['./text-message-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageEditorComponent {
  /** Public properties **/
  @ViewChild('smsAnchor') public smsAnchor!: ElementRef;
  @ViewChild('smsPopup', { read: ElementRef }) public smsPopup!: ElementRef;
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
  smsPopupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Private methods **/
  private contains(target: any): boolean {
    return (
      this.smsAnchor.nativeElement.contains(target) ||
      (this.smsPopup ? this.smsPopup.nativeElement.contains(target) : false)
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
  }

  onSearchClosed() {
    this.isSearchOpened = false;
  }
}
