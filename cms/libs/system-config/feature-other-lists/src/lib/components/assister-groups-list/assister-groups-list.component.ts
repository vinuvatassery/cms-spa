import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SystemConfigOtherListsFacade } from '@cms/system-config/domain';
@Component({
  selector: 'system-config-assister-groups-list',
  templateUrl: './assister-groups-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssisterGroupsListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/
  isAssisterGroupsDetailPopup = false;
  isAssisterGroupsDeletePopupShow = false;
  isAssisterGroupsDeactivatePopupShow = false;
  isAssisterGroupsReactivatePopupShow = false;
  assisterGroupsLists$ = this.systemConfigOtherListsFacade.loadAssisterGroupsListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public moreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onAssisterGroupsDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onAssisterGroupsDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly systemConfigOtherListsFacade: SystemConfigOtherListsFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadAssisterGroupsLists();
  }

  /** Private  methods **/

  private loadAssisterGroupsLists() {
    this.systemConfigOtherListsFacade.loadAssisterGroupsLists();
  }

  /** Internal event methods **/
  onCloseAssisterGroupsDetailClicked() {
    this.isAssisterGroupsDetailPopup = false;
  }
  onAssisterGroupsDetailClicked() {
    this.isAssisterGroupsDetailPopup = true;
  }

  onCloseAssisterGroupsDeleteClicked() {
    this.isAssisterGroupsDeletePopupShow = false;
  }
  onAssisterGroupsDeleteClicked() {
    this.isAssisterGroupsDeletePopupShow = true;
  }
  onCloseAssisterGroupsDeactivateClicked() {
    this.isAssisterGroupsDeactivatePopupShow = false;
  }
  onAssisterGroupsDeactivateClicked() {
    this.isAssisterGroupsDeactivatePopupShow = true;
  }

  onCloseAssisterGroupsReactivateClicked() {
    this.isAssisterGroupsReactivatePopupShow = false;
  }
}
