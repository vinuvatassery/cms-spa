import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-funds-list',
  templateUrl: './funds-list.component.html',
  styleUrls: ['./funds-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundsListComponent implements OnInit {


  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isPeriodDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfilePeriods$ = this.userManagementFacade.clientProfilePeriods$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
    
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
  
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadClientProfilePeriods();
  }

  /** Private  methods **/
  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadClientProfilePeriods() {
    this.userManagementFacade.loadClientProfilePeriods();
  }

  /** Internal event methods **/
  onClosePeriodDetailClicked() {
    this.isPeriodDetailPopup = false;
  }
  onPeriodDetailClicked() {
    this.isPeriodDetailPopup = true;
  }
}
