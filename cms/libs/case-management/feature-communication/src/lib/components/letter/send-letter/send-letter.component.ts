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
import { CommunicationEvents,CommunicationFacade } from '@cms/case-management/domain';
import { Observable } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-send-letter',
  templateUrl: './send-letter.component.html',
  styleUrls: ['./send-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;
  @Input() mailingAddress$!: Observable<any>;

  /** Output properties  **/
  @Output() closeSendLetterEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() editorValue = new EventEmitter<any>();
  
  /** Public properties **/
  letterEditorValueEvent = new EventEmitter<boolean>();
  letterContentValue!: any;
  isNewLetterClicked!: any;
  isOpenLetterTemplate = false;
  isShowPreviewLetterPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  isShowSendLetterToPrintPopupClicked = false;
  selectedTemplate!: string;
  templateData:any = [];
  letterTemplatedata: any = [];
  dataValue: Array<any> = [
    {
      text: '',
    },
  ];
  popupClass = 'app-c-split-button';
 /** Constructor **/
 constructor(private readonly communicationFacade: CommunicationFacade,
  private readonly loaderService: LoaderService,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if (this.data) {
      this.isNewLetterClicked = true;
    } else {
      this.isNewLetterClicked = false;
    }    
    this.loadLetterTemplates();
  }

  private loadLetterTemplates() {
    this.loaderService.show();
    this.communicationFacade.loadLetterTemplates(this.selectedTemplate ?? '')
        .subscribe((data: any) => {
          if (data) {
            this.templateData = data
            debugger;
            this.letterTemplatedata = data;
          }
          this.loaderService.hide();
        });
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
    this.selectedTemplate = event;
    this.editorValue = event;
  }

  handleOpenTemplateClicked() {
    this.isOpenLetterTemplate = true;
    this.loadInitialData.emit();
  }
  
  handleDdlLetterValueChange(e:any)
  {
    debugger;
    this.letterContentValue = e.templateContent;
    this.handleLetterEditor(e);
  }
}
