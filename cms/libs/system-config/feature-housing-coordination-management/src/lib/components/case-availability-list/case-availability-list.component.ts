/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-case-availability-list',
  templateUrl: './case-availability-list.component.html',
  styleUrls: ['./case-availability-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseAvailabilityListComponent implements OnInit {
  /** Public properties **/
  isCaseAvailabilityDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileCaseAvailabilities$ =
    this.userManagementFacade.clientProfileCaseAvailabilities$;


    popupClassAction = 'TableActionPopup app-dropdown-action-list';

    public moreactions = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
          this.onCaseAvailabilityDetailClicked();
        },
      }, 
   
    ];

  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadClientProfileCaseAvailabilities();
  }

  /** Private methods **/
  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadClientProfileCaseAvailabilities() {
    this.userManagementFacade.loadClientProfileCaseAvailabilities();
  }

  /** Internal event methods **/
  onCloseCaseAvailabilityDetailClicked() {
    this.isCaseAvailabilityDetailPopup = false;
  }
  onCaseAvailabilityDetailClicked() {
    this.isCaseAvailabilityDetailPopup = true;
  }
}
