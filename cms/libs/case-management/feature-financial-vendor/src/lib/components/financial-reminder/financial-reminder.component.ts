import { ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-reminder',
  templateUrl: './financial-reminder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialReminderComponent {

  constructor( private lovFacade : LovFacade,
    private financialVendorFacade : FinancialVendorFacade,
    private financialRefundFacade : FinancialVendorRefundFacade) {
    
  }
  public formUiStyle : UIFormStyle = new UIFormStyle();
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  reminderIsFor =''

  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  isShowReminderDetailsModal = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';

  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {
        this.onReminderDoneClicked();
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      },
    },
  ];

  /** Internal event methods **/
  onReminderDoneClicked() {
    const snackbarMessage: SnackBar = {
      title: 'Notification message!',
      subtitle: 'Sub title goes here.',
      type: 'success',
    };
    this.snackbarSubject.next(snackbarMessage);
  }

  onCloseReminderClicked() {
    this.isShowReminderDetailsModal = false;
  }

  onAddReminderClicked() {
    this.isShowReminderDetailsModal = true;
  }

  searchClientName(event:any){
    this.financialRefundFacade.loadClientBySearchText(event);
  }

  searchProvider(data:any){
    this.financialVendorFacade.searchAllProvider(data);
  }

  remainderFor(event:any){
    this.reminderIsFor= event
  }
}
