import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-sms-text-template-new-form',
  templateUrl: './sms-text-template-new-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsTextTemplateNewFormComponent {
  /** Public properties **/
  @ViewChild('smsAnchor') public smsAnchor!: ElementRef;
  @ViewChild('smsPopup', { read: ElementRef }) public smsPopup!: ElementRef;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions =
    new UploadFileRistrictionOptions();
  isShowPopupClicked = false;
  isShowPreviewSmsTextHeaderFooterDialog = false;
  isShowSendTextDialog = false;
  isAddLanguageDetailPopup = false;
  isRemoveLanguagePopup = false;
  isBccEnable = false;
  isSmsTextTemplateLeavePopupShow = false;
  onToggle() {
    this.isShowPopupClicked = true;
  }

  public listItems: Array<string> = [
    'Role Name',
    'Role Name',
    'Role Name',
    'Role Name',
    'Role Name',
  ];
  public value: any = [];

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
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';

  /** Internal event methods **/
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
  onPreviewSmsTextHeaderFooterOpenClicked() {
    this.isShowPreviewSmsTextHeaderFooterDialog = true;
  }
  onPreviewSmsTextHeaderFooterCloseClicked() {
    this.isShowPreviewSmsTextHeaderFooterDialog = false;
  }

  onSendTestOpenClicked() {
    this.isShowSendTextDialog = true;
  }
  onSendTestCloseClicked() {
    this.isShowSendTextDialog = false;
  }

  onOpenAddLanguageDetailClicked() {
    this.isAddLanguageDetailPopup = true;
  }

  onCloseAddLanguageDetailClicked() {
    this.isAddLanguageDetailPopup = false;
  }

  onOpenRemoveLanguageClicked(event: any) {
    this.isRemoveLanguagePopup = true;
  }

  onCloseRemoveLanguageClicked() {
    this.isRemoveLanguagePopup = false;
  }

  onSmsTextTemplateLeaveClicked() {
    this.isSmsTextTemplateLeavePopupShow = true;
  }
  onCloseSmsTextTemplateLeaveClicked() {
    this.isSmsTextTemplateLeavePopupShow = false;
  }
}
