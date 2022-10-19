/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { HealthcareProviderFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  styleUrls: ['./health-care-provider-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements OnInit {
  /** Input properties **/
  @Input() hasNoProvider!: boolean;

  /** Public properties **/
  healthCareProviders$ = this.providerFacade.healthCareProviders$;
  isEditHealthProvider!: boolean;
  isOpenedProvider = false;
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Provider",
      icon: "edit",
      click: (): void => {
        this.onOpenProviderClicked(true);
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
  constructor(private readonly providerFacade: HealthcareProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadHealthCareProviders();
  }

  /** Private methods **/
  private loadHealthCareProviders() {
    this.providerFacade.loadHealthCareProviders();
  }

  /** Internal event methods **/
  onCloseProviderClicked() {
    this.isOpenedProvider = false;
  }

  onOpenProviderClicked(isEditHealthProviderValue: boolean) {
    this.isOpenedProvider = true;
    this.isEditHealthProvider = isEditHealthProviderValue;
  }
}
