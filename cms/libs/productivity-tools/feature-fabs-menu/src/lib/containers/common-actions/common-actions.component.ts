/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { DialItem } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'productivity-tools-common-actions',
  templateUrl: './common-actions.component.html',
  styleUrls: ['./common-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonActionsComponent implements OnInit {
  /** Public properties **/
  isShownEventLog = false;
  isShownDirectMessage = false;
  isShownTodoReminders = false;
  clickedContact!: any;
  item: Array<DialItem> = [{}];

  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    debugger;
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
 
   this.router.navigate([{ outlets: { directMessage: [ 'fabs'] }}]);
    this.isShownDirectMessage = !this.isShownDirectMessage;
    this.isShownEventLog = false;
    this.isShownTodoReminders = false;
  }

  handleShowTodoRemindersClicked() {
    this.isShownTodoReminders = !this.isShownTodoReminders;
    this.isShownDirectMessage = false;
    this.isShownEventLog = false;
  }
}
