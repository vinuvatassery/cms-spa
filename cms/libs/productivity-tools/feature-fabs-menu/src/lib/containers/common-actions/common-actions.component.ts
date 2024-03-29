/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FabMenuFacade } from '@cms/productivity-tools/domain';
/** External libraries **/
import { DialItem } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'productivity-tools-common-actions',
  templateUrl: './common-actions.component.html',
  styleUrls: ['./common-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonActionsComponent {
  /** Public properties **/
 
  clickedContact!: any;
  item: Array<DialItem> = [{}];
  clientId : any;
  //vendorId : any;
  entityId : any;
  
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly fabMenuFacade : FabMenuFacade
  ) {}

  ngOnInit(): void {
    debugger;
      this.clientId = this.route.snapshot.params['id'];
      //this.vendorId = this.route.snapshot.queryParams['v_id'];
      if(this.clientId){
        this.entityId = this.clientId.toString();
      }
      // else if(this.vendorId){
      //   this.entityId = this.vendorId.toString();
      // }
  }
  /** Internal event methods **/
  onDialItemClicked(event: any): void {
    this.clickedContact = event.item;
  }

  /** External event methods **/
  handleShowEventLogClicked() {
    
    this.fabMenuFacade.isShownEventLog = !this.fabMenuFacade.isShownEventLog;
    this.fabMenuFacade.isShownDirectMessage = false;
    this.fabMenuFacade.isShownTodoReminders = false;  
  }

  handleShowDirectMessageClicked() {
    this.fabMenuFacade.isShownDirectMessage = !this.fabMenuFacade.isShownDirectMessage;
    this.fabMenuFacade.isShownEventLog = false;
    this.fabMenuFacade.isShownTodoReminders = false;
   
  }

  handleShowTodoRemindersClicked() {
    this.fabMenuFacade.isShownTodoReminders = !this.fabMenuFacade.isShownTodoReminders;
    this.fabMenuFacade.isShownDirectMessage = false;
    this.fabMenuFacade.isShownEventLog = false;
   
  }
}
