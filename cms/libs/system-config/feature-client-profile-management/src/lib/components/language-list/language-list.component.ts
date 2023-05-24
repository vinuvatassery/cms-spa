/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
     text: "Reorder",
     icon: "format_list_numbered",
     click: (): void => {
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
     },
   },
   

 ];
 /** Constructor **/
 constructor(private readonly userManagementFacade: UserManagementFacade) {}

 /** Lifecycle hooks **/
 ngOnInit(): void {
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
