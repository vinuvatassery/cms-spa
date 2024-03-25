/** Angular **/
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    Output,
  } from '@angular/core';
import { CommunicationEvents } from '@cms/case-management/domain';
  
  
  /** Internal Libraries **/

  
  /** External Libraries **/

  
  @Component({
    selector: 'case-management-notification-draft-confirmation',
    templateUrl: './notification-draft-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class NotificationDraftConfirmationComponent implements OnInit {
    /** Input properties **/
  @Input() communicationTypeCode!: string;
    /** Output properties  **/
    @Output() closeNotificationEvent = new EventEmitter<CommunicationEvents>();
    @Output() newNotificationClickEvent = new EventEmitter();
    @Output() continueClickEvent = new EventEmitter();

     /** Constructor **/
     constructor(
) { }
  
    /** Public properties **/
    buttonText!: string;
  
    /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buttonText = this.communicationTypeCode.toUpperCase();
    this.communicationTypeCode = this.communicationTypeCode.toLowerCase();
  }

  closeDraftDailogCloseClicked(){
    this.closeNotificationEvent.emit(CommunicationEvents.Close);
  }

  openNewNotificationClicked(){
    this.newNotificationClickEvent.emit();
  }

  continueWithDraftClicked(){
    this.continueClickEvent.emit();
  }
}