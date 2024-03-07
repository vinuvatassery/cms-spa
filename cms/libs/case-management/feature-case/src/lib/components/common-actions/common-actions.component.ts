// /** Angular **/
// import { Component, ChangeDetectionStrategy } from '@angular/core';
// /** External libraries **/
// import { DialItem } from '@progress/kendo-angular-buttons';

// @Component({
//   selector: 'case-management-common-actions',
//   templateUrl: './common-actions.component.html',
//   styleUrls: ['./common-actions.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class CommonActionsComponent {
//   /** Public properties **/
//   isShownEventLog = false;
//   isShownDirectMessage = false;
//   isShownTodoReminders = false;
//   clickedContact!: any;
//   item: Array<DialItem> = [{}];

//   /** Internal event methods **/
//   onDialItemClicked(event: any): void {
//     this.clickedContact = event.item;
//   }

//   /** External event methods **/
//   handleShowEventLogClicked() {
//     this.isShownEventLog = !this.isShownEventLog;
//     this.isShownDirectMessage = false;
//     this.isShownTodoReminders = false;
//   }

//   handleShowDirectMessageClicked() {
//     this.isShownDirectMessage = !this.isShownDirectMessage;
//     this.isShownEventLog = false;
//     this.isShownTodoReminders = false;
//   }

//   handleShowTodoRemindersClicked() {
//     this.isShownTodoReminders = !this.isShownTodoReminders;
//     this.isShownDirectMessage = false;
//     this.isShownEventLog = false;
//   }
// }
