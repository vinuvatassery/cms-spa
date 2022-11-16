/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageListComponent implements OnInit {
 /** Public properties **/
 isLanguageDeactivatePopup = false;
 isLanguageDetailPopup = false;
 ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
 clientProfileLanguages$ = this.userManagementFacade.clientProfileLanguages$;
 popupClassAction = 'TableActionPopup app-dropdown-action-list';

 public moreactions = [
   {
     buttonType:"btn-h-primary",
     text: "Edit",
     icon: "edit",
     click: (): void => {
       // this.onUserDetailsClicked(true);
     },
   },
   {
     buttonType:"btn-h-primary",
     text: "Reorder",
     icon: "format_list_numbered",
     click: (): void => {
     //  this.onUserDeactivateClicked()
     },
   },
   {
     buttonType:"btn-h-primary",
     text: "Deactivate",
     icon: "block",
     click: (): void => {
      this.onLanguageDeactivateClicked()
     },
   },
   {
     buttonType:"btn-h-danger",
     text: "Delete",
     icon: "delete",
     click: (): void => {
     // this.onOpenDeleteTodoClicked()
     },
   },
   

 ];
 /** Constructor **/
 constructor(private readonly userManagementFacade: UserManagementFacade) {}

 /** Lifecycle hooks **/
 ngOnInit(): void {
   console.log(  this.clientProfileLanguages$,"aaaaaaaaaaaaa");
   this.loadColumnFilters();
   this.loadClientProfileLanguages();
 }

 /** Private methods **/
 private loadColumnFilters() {
   this.userManagementFacade.loadDdlColumnFilters();
 }

 private loadClientProfileLanguages() {
   this.userManagementFacade.loadClientProfileLanguages();
 }

 /** Internal event methods **/
 onCloseLanguageDeactivateClicked() {
   this.isLanguageDeactivatePopup = false;
 }
 onLanguageDeactivateClicked() {
   this.isLanguageDeactivatePopup = true;
 }
 onCloseLanguageDetailClicked() {
   this.isLanguageDetailPopup = false;
 }
 onLanguageDetailClicked() {
   this.isLanguageDetailPopup = true;
 }

}
