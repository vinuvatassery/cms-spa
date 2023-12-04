 
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-direct-messages-list',
  templateUrl: './direct-messages-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessagesListComponent implements OnInit {

 /** Public properties **/ 
 isDirectMessageDetailPopup = false;
 ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
 directMessageLogEvent$ = this.userManagementFacade.directMessageLogEvent$;
 public formUiStyle : UIFormStyle = new UIFormStyle();
 popupClassAction = 'TableActionPopup app-dropdown-action-list';

 
 /** Constructor **/
 constructor(private readonly userManagementFacade: UserManagementFacade) { }

 /** Lifecycle hooks **/
 ngOnInit(): void {
 
   this.loadDdlColumnFilters();
   this.loadDirectMessageList();
 }
 private loadDdlColumnFilters() {
   this.userManagementFacade.loadDdlColumnFilters();
 }

 private loadDirectMessageList() {
   this.userManagementFacade.loadDirectMessageLogEvent();
 }

 /** Internal event methods **/
 
 onCloseDirectMessageDetailClicked() {
   this.isDirectMessageDetailPopup = false;
 }
 onDirectMessageDetailClicked() {
   this.isDirectMessageDetailPopup = true;
 }
}
