/** Angular **/
import {
  Component,  OnInit,  ChangeDetectionStrategy,  Input,  Output,  EventEmitter, OnChanges,} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { first } from 'rxjs';

@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  styleUrls: ['./health-care-provider-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements OnInit , OnChanges {
  /** Input properties **/
  @Input() hasNoProvider!: boolean;
  @Input() healthCareProvidersData$! : any;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() removeHealthProvider$: any;

  @Output() deleteConfimedEvent =  new EventEmitter<string>();
  @Output() loadProvidersListEvent = new EventEmitter<any>(); 
  public formUiStyle : UIFormStyle = new UIFormStyle();

  /** Public properties **/

  isEditHealthProvider!: boolean;
  isOpenedProvider = false;
  isOpenedDeleteConfirm = false;
  prvSelectedId! : string; 
  isEditSearchHealthProvider!: boolean;
  isOpenedProviderSearch = false;
  public  state!: State
  deletebuttonEmitted = false;
  editbuttonEmitted = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Provider",
      icon: "edit",
      click: (providerId : string): void => {                      
        this.onOpenProviderSearchClicked(true);
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove Provider",
      icon: "delete",
      click: (providerId : string): void => {    
        if(!this.deletebuttonEmitted)
        {         
          this.deletebuttonEmitted =true;
        this.onRemoveClick(providerId)
        }
      },
    },
  ];

  
  /** Lifecycle hooks **/

  ngOnChanges(): void {     
    this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort
    };        
      this.loadHealthCareProvidersList()
  } 

   ngOnInit(): void {
    console.log('')
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


  onDeleteConfirmCloseClicked()
  {
    this.isOpenedDeleteConfirm = false;
  }

  onRemoveClick(prvId : string)
  { 
    this.isOpenedDeleteConfirm = true;
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
        this.deletebuttonEmitted =false;
        this.deleteConfimedEvent.emit(this.prvSelectedId);

        this.removeHealthProvider$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((deleteResponse: any) =>
        {  
          if(deleteResponse == true)
          {
            this.loadHealthCareProvidersList()
          }
          
        })
      }      
      this.onDeleteConfirmCloseClicked()        
   }
     /** grid event methods **/
 
     public dataStateChange(stateData: any): void {         
      this.sort = stateData.sort;
      this.sortValue = stateData.sort[0]?.field
      this.sortType = stateData.sort[0]?.dir ?? 'asc'
      this.state=stateData;
      this.loadHealthCareProvidersList();   
  }

  private loadHealthCareProvidersList(): void {   
    this.loadDependents(this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType)    
  }
   loadDependents(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string)
   {
     const gridDataRefinerValue = 
     {
       skipCount: skipcountValue,
       pagesize : maxResultCountValue,
       sortColumn : sortValue,
       sortType : sortTypeValue,
     }
     this.loadProvidersListEvent.next(gridDataRefinerValue)
   }
}
