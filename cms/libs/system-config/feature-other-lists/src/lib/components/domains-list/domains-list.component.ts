import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SystemConfigOtherListsFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-domains-list',
  templateUrl: './domains-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainsListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/
  isDomainsDetailPopup = false;
  isDomainsDeletePopupShow = false;
  isDomainsDeactivatePopupShow = false;
  isDomainsReactivatePopupShow = false;
  domainsLists$ = this.systemConfigOtherListsFacade.loadDomainsListsService$;
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
        this.onDomainsDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onDomainsDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly systemConfigOtherListsFacade: SystemConfigOtherListsFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDomainsLists();
  }

  /** Private  methods **/

  private loadDomainsLists() {
    this.systemConfigOtherListsFacade.loadDomainsLists();
  }

  /** Internal event methods **/
  onCloseDomainsDetailClicked() {
    this.isDomainsDetailPopup = false;
  }
  onDomainsDetailClicked() {
    this.isDomainsDetailPopup = true;
  }

  onCloseDomainsDeleteClicked() {
    this.isDomainsDeletePopupShow = false;
  }
  onDomainsDeleteClicked() {
    this.isDomainsDeletePopupShow = true;
  }
  onCloseDomainsDeactivateClicked() {
    this.isDomainsDeactivatePopupShow = false;
  }
  onDomainsDeactivateClicked() {
    this.isDomainsDeactivatePopupShow = true;
  }

  onCloseDomainsReactivateClicked() {
    this.isDomainsReactivatePopupShow = false;
  }
}
