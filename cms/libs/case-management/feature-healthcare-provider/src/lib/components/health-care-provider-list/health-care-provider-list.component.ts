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
  ClientCaseEligibilityId  = "90478CC0-1EB5-4D76-BC49-05423EFA3D93";
  /** Public properties **/
  healthCareProviders$ = this.providerFacade.healthCareProviders$;
  removeHealthProvider$ =this.providerFacade.removeHealthProvider$;
  isEditHealthProvider!: boolean;
  isOpenedProvider = false;
  isOpenedDeleteConfirm = false;
  prvSelectedId! : string; 

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
        this.onRemoveProviderClicked()
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly providerFacade: HealthcareProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadHealthCareProviders(this.ClientCaseEligibilityId);
  }

  /** Private methods **/
  private loadHealthCareProviders(ClientCaseEligibilityId : string) {  
    this.providerFacade.loadHealthCareProviders(ClientCaseEligibilityId);   
  }

  private removeHealthCareProvider(ClientCaseEligibilityId : string , ProviderId : string)
  {
     this.providerFacade.removeHealthCareProviders(ClientCaseEligibilityId, ProviderId);      
  }

  /** Internal event methods **/
  onCloseProviderClicked() {
    this.isOpenedProvider = false;
  }

  onOpenProviderClicked(isEditHealthProviderValue: boolean) {
    this.isOpenedProvider = true;
    this.isEditHealthProvider = isEditHealthProviderValue;
  }

  onRemoveProviderClicked()
  { 
    this.isOpenedDeleteConfirm = true;
  }

  onDeleteConfirmCloseClicked()
  {
    this.isOpenedDeleteConfirm = false;
  }

  onRemoveClick(prvId : string)
  { 
    this.prvSelectedId = prvId;      
  }

      /** External event methods **/
  handleDeclinePrvRemove() {
    this.onDeleteConfirmCloseClicked()
  }

  handleAcceptPrvRemove(isDelete :boolean)
   {  
      if(isDelete)
      {
        this.removeHealthCareProvider(this.ClientCaseEligibilityId  ,this.prvSelectedId) ; 
      }      
      this.onDeleteConfirmCloseClicked()        
   }
}
