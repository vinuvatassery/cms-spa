/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
/** Enums **/
import { CommunicationEvents } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-send-letter',
  templateUrl: './send-letter.component.html',
  styleUrls: ['./send-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;

  /** Output properties  **/
  @Output() closeSendLetterEvent = new EventEmitter<CommunicationEvents>();

  /** Public properties **/
  letterEditorValueEvent = new EventEmitter<boolean>();
  letterContentValue!: any;
  isNewLetterClicked!: any;
  isOpenLetterTemplate = false;
  isShowPreviewLetterPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  isShowSendLetterToPrintPopupClicked = false;
  dataValue: Array<any> = [
    {
      text: '',
    },
  ];
  popupClass = 'app-c-split-button';

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if (this.data) {
      this.isNewLetterClicked = true;
    } else {
      this.isNewLetterClicked = false;
    }
  }

  /** Internal event methods **/
  onSendNewLetterClicked() {
    this.isNewLetterClicked = true;
    this.isShowPreviewLetterPopupClicked = false;
    this.isShowSendLetterToPrintPopupClicked = false;
    this.isShowSaveForLaterPopupClicked = false;
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.onCloseNewLetterClicked();
  }

  onSaveForLaterClicked() {
    this.isNewLetterClicked = false;
    this.isShowSaveForLaterPopupClicked = true;
  }

  onSendLetterToPrintDialogClicked(event: any) {
    this.isShowSendLetterToPrintPopupClicked = false;
    if (event === CommunicationEvents.Print) {
      this.closeSendLetterEvent.emit(CommunicationEvents.Print);
    } else if (event === CommunicationEvents.Close) {
      this.closeSendLetterEvent.emit(CommunicationEvents.Close);
    }
  }

  onPreviewLetterClicked() {
    this.isShowPreviewLetterPopupClicked = true;
    this.isShowSaveForLaterPopupClicked = false;
    this.isShowSendLetterToPrintPopupClicked = false;
    this.letterEditorValueEvent.emit(true);
  }

  onSendLetterToPrintClicked() {
    this.isNewLetterClicked = false;
    this.isShowSendLetterToPrintPopupClicked = true;
    this.isShowPreviewLetterPopupClicked = false;
    this.letterEditorValueEvent.emit(true);
  }

  onCloseNewLetterClicked() {
    this.closeSendLetterEvent.emit(CommunicationEvents.Close);
  }

  /** External event methods **/
  handleLetterEditor(event: any) {
    this.letterContentValue = event;
  }

  handleOpenTemplateClicked() {
    this.isOpenLetterTemplate = true;
  }
}
