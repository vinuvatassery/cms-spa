/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';

/** Internal Libraries **/
import { CommunicationEvents} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';


@Component({
  selector: 'cms-financial-send-email',
  templateUrl: './financial-send-email.component.html',
  styleUrls: ['./financial-send-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialSendEmailComponent {

  /** Output properties  **/
  @Output() closeSendEmailEvent = new EventEmitter<CommunicationEvents>();  

  public formUiStyle : UIFormStyle = new UIFormStyle();
 
  selectedEmail=""
  selectedCCEmail=""

  onCloseSendEmailClicked()
  {
    this.closeSendEmailEvent.emit(CommunicationEvents.Close)
  }
}

