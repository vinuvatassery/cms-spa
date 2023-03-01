/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements OnInit {
  /** Public properties **/
  providersGrid$ = this.providerFacade.providersGrid$;
  isOpenProvider = false;
  public pageSize = 10;
  public skip = 5;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Provider",
      icon: "edit",
      click: (): void => {
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove Provider",
      icon: "delete",
      click: (): void => {
      },
    },
  ];
  /** Constructor **/
  constructor(private readonly providerFacade: ManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadProvidersGrid();
  }

  /** Private methods **/
  private loadProvidersGrid() {
    this.providerFacade.loadProvidersGrid();
  }

  /** Internal event methods **/
  onCloseProviderClicked() {
    this.isOpenProvider = false;
  }

  onOpenProviderClicked() {
    this.isOpenProvider = true;
  }
}
