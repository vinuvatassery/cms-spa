/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';


/** Internal Libraries **/
import { CommunicationEvents } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';



@Component({
  selector: 'cms-financial-send-letter',
  templateUrl: './financial-send-letter.component.html',
  styleUrls: ['./financial-send-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialSendLetterComponent {
  
  /** Output properties  **/
  @Output() closeSendLetterEvent = new EventEmitter<CommunicationEvents>();

  /** Public properties **/
  public formUiStyle : UIFormStyle = new UIFormStyle();
 
  dataValue: Array<any> = [
    {
      text: '',
    },
  ];
  popupClass = 'app-c-split-button';
  ddlTemplates: any;




  onCloseNewLetterClicked()
  {
     this.closeSendLetterEvent.emit(CommunicationEvents.Close)
  }




}
