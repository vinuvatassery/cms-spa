import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-racial-or-ethnic-identity-list',
  templateUrl: './racial-or-ethnic-identity-list.component.html',
  styleUrls: ['./racial-or-ethnic-identity-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RacialOrEthnicIdentityListComponent implements OnInit {

 /** Public properties **/
 isIdentityDeactivatePopup = false;
 isIdentityDetailPopup = false;
 clientProfileRacialOrEthnicIdentity$ = this.userManagementFacade.clientProfileRacialOrEthnicIdentity$;
 ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
 popupClassAction = 'TableActionPopup app-dropdown-action-list';
 public formUiStyle : UIFormStyle = new UIFormStyle();
 public moreactions = [
   {
     buttonType:"btn-h-primary",
     text: "Edit",
     icon: "edit",
     click: (): void => {
     },
   },
   {
     buttonType:"btn-h-primary",
     text: "Deactivate",
     icon: "block",
     click: (): void => {
      this.onIdentityDeactivateClicked()
     },
   },
   {
     buttonType:"btn-h-danger",
     text: "Delete",
     icon: "delete",
     click: (): void => {
     },
   },
   

 ];


 /** Constructor **/
 constructor(private readonly userManagementFacade: UserManagementFacade) { }

 /** Lifecycle hooks **/
 ngOnInit(): void {
   this.loadDdlColumnFilters();
   this.loadRacialOrEthnicIdentityList();
 }
 private loadDdlColumnFilters() {
   this.userManagementFacade.loadDdlColumnFilters();
 }
 private loadRacialOrEthnicIdentityList() {
   this.userManagementFacade.loadRacialOrEthnicIdentityList();
 }

 /** Internal event methods **/
 onCloseIdentityDeactivateClicked() {
   this.isIdentityDeactivatePopup = false;
 }
 onIdentityDeactivateClicked() {
   this.isIdentityDeactivatePopup = true;
 }
 onCloseIdentityDetailClicked() {
   this.isIdentityDetailPopup = false;
 }
 onIdentityDetailClicked() {
   this.isIdentityDetailPopup = true;
 }


}
