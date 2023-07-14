/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
/** External libraries **/
import { DialItem } from '@progress/kendo-angular-buttons';
import {ProfileTabFacade, CaseFacade} from '@cms/case-management/domain';
import { first } from 'rxjs';

@Component({
  selector: 'case-management-common-actions',
  templateUrl: './common-actions.component.html',
  styleUrls: ['./common-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonActionsComponent {
  /** Public properties **/
  isShownEventLog = false;
  isShownDirectMessage = false;
  isShownTodoReminders = false;
  clickedContact!: any;
  clientProfileHeader$ = this.caseFacade.clientProfileHeader$;
  item: Array<DialItem> = [{}];
  clientCaseEligibilityId: any
  clientId: any
  eventLogCount:any;
  eventLog$ = this.profileTabFacade.eventLog$;

  constructor(private profileTabFacade: ProfileTabFacade,private readonly caseFacade: CaseFacade,){

  }
  ngOnInit(): void {

    this.profileHeaderLoad();
    
  }

  profileHeaderLoad(){
    this.clientProfileHeader$
      ?.pipe(first((clientHeaderData: any) => clientHeaderData?.clientId > 0))
      .subscribe((clientHeaderData: any) => {
        if (clientHeaderData?.clientId > 0) {          
          this.clientId = clientHeaderData?.clientId;
          this.clientCaseEligibilityId = clientHeaderData?.clientCaseEligibilityId;  
          debugger;  
          this.loadEventLog()    
        }
      });

  }
  /** Internal event methods **/
  onDialItemClicked(event: any): void {
    this.clickedContact = event.item;
  }

  /** External event methods **/
  handleShowEventLogClicked() {
    this.isShownEventLog = !this.isShownEventLog;
    this.isShownDirectMessage = false;
    this.isShownTodoReminders = false;
  }

  handleShowDirectMessageClicked() {
    this.isShownDirectMessage = !this.isShownDirectMessage;
    this.isShownEventLog = false;
    this.isShownTodoReminders = false;
  }

  loadEventLog(){
    this.profileTabFacade.loadEventLog(this.clientId,this.clientCaseEligibilityId);
  }

  handleShowTodoRemindersClicked() {
    this.isShownTodoReminders = !this.isShownTodoReminders;
    this.isShownDirectMessage = false;
    this.isShownEventLog = false;
  }
}
