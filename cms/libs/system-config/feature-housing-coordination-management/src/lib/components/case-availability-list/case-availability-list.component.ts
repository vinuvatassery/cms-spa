/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-case-availability-list',
  templateUrl: './case-availability-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseAvailabilityListComponent implements OnInit {

  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isCaseAvailabilityDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileCaseAvailabilities$ =
    this.userManagementFacade.clientProfileCaseAvailabilities$;
    public formUiStyle : UIFormStyle = new UIFormStyle();

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
