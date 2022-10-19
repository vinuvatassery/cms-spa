/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-eid-lifetime-period-list',
  templateUrl: './eid-lifetime-period-list.component.html',
  styleUrls: ['./eid-lifetime-period-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EidLifetimePeriodListComponent implements OnInit {
  /** Public properties **/
  isPeriodDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfilePeriods$ = this.userManagementFacade.clientProfilePeriods$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
        // this.onSlotDetailClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
        // this.onSlotDetailClicked();
      },
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
