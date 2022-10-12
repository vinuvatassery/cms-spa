/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  styleUrls: ['./health-care-provider-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements OnInit {
  /** Public properties **/
  providersGrid$ = this.providerFacade.providersGrid$;
  isOpenProvider = false;
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Provider",
      icon: "edit",
      click: (): void => {
        // this.onOpenProviderClicked(true);
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove Provider",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
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
