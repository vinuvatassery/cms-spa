/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';


@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  styleUrls: ['./health-care-provider-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements OnInit {
  /** Input properties **/
  @Input() hasNoProvider!: boolean;
  @Input() healthCareProvidersData! : any;

  @Output() deleteConfimedEvent =  new EventEmitter<string>();
  
  /** Public properties **/
   healthCareProviders$! :any ;
  // removeHealthProvider$ ;
  isEditHealthProvider!: boolean;
  isOpenedProvider = false;
  isOpenedDeleteConfirm = false;
  prvSelectedId! : string; 
  isEditSearchHealthProvider!: boolean;
  isOpenedProviderSearch = false;
  
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Provider",
      icon: "edit",
      click: (): void => {                      
        this.onOpenProviderSearchClicked(true);
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

  
  /** Lifecycle hooks **/
   ngOnInit(): void {
    this.healthCareProviders$ = this.healthCareProvidersData;
   }

  /** Internal event methods **/
  onCloseProviderClicked() {
    this.isOpenedProvider = false;
  }

  onOpenProviderClicked(isEditHealthProviderValue: boolean) {
    this.isOpenedProvider = true;
    this.isEditHealthProvider = isEditHealthProviderValue;
  }

  onOpenProviderSearchClicked(isEditSearchHealthProviderValue: boolean) {
    this.isOpenedProviderSearch = true;
    this.isEditSearchHealthProvider = isEditSearchHealthProviderValue;
  }
  onCloseProviderSearchClicked() {
    this.isOpenedProviderSearch = false;
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
        this.deleteConfimedEvent.emit(this.prvSelectedId);
      }      
      this.onDeleteConfirmCloseClicked()        
   }
}
