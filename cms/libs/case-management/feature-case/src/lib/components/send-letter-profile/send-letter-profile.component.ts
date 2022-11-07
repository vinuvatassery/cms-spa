/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { CaseFacade } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';


@Component({
  selector: 'case-management-send-letter-profile',
  templateUrl: './send-letter-profile.component.html',
  styleUrls: ['./send-letter-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterProfileComponent implements OnInit {
 currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';

  /** Public properties **/
  ddlSendLetters$ = this.caseFacade.ddlSendLetters$;
  isEligibilityInfoDialogOpened = false;

  /** Constructor **/
  constructor(private readonly caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlSendLetters();
  }

  /** Private methods **/
  private loadDdlSendLetters() {
    this.caseFacade.loadDdlSendLetters();
  }

  /** Internal event methods **/
  onCloseEligibilityInfoClicked() {
    this.isEligibilityInfoDialogOpened = false;
  }

  onOpenEligibilityInfoClicked() {
    this.isEligibilityInfoDialogOpened = true;
  }
}
