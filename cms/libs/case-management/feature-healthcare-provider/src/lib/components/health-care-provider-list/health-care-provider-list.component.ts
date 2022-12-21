/** Angular **/
import {
  Component,  OnInit,  ChangeDetectionStrategy,  Input,  Output,  EventEmitter, OnChanges, OnDestroy,} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { first, Subject, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  styleUrls: ['./health-care-provider-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements OnInit , OnChanges ,OnDestroy{
  /** Input properties **/
  @Input() hasNoProvider!: boolean;
  @Input() healthCareProvidersData$! : any;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() removeHealthProvider$: any;
  @Input() healthCareProviderSearchList$: any;
  @Input() addExistingProvider$: any;
  @Input() loadExistingProvider$: any;

  @Output() deleteConfimedEvent =  new EventEmitter<string>();
  @Output() loadProvidersListEvent = new EventEmitter<any>(); 
  @Output() searchTextEvent = new EventEmitter<string>(); 
  @Output() addExistingProviderEvent = new EventEmitter<any>(); 
  @Output() getExistingProviderEvent = new EventEmitter<any>(); 
  public formUiStyle : UIFormStyle = new UIFormStyle();

  editformVisibleSubject = new Subject<boolean>();
  editformVisible$ = this.editformVisibleSubject.asObservable();
  subscriptionData! : Subscription;
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
  isOpenedbusinessInfo =false;
  gridHoverDataItem! : any
  existingProviderData! : any
  selectedCustomProviderName! : string
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Provider",
      icon: "edit",
      click: (providerId : string): void => {     
        if(!this.editbuttonEmitted)
        {                 
        this.editbuttonEmitted= true;
        this.onOpenProviderSearchClicked(providerId ,true);
        }
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
  ngOnDestroy(): void {
    this.subscriptionData.unsubscribe()
  }
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

  onOpenProviderSearchClicked(providerId : string,isEdit : boolean) {
    this.selectedCustomProviderName="";
   
    this.isEditSearchHealthProvider = isEdit;
    this.prvSelectedId = providerId;
    if(isEdit === true)
    {
    this.getExistingProviderEvent.emit(this.prvSelectedId)
    this.onExistProviderFormLoad();
    }
    else
    {
      this.isOpenedProviderSearch = true;
      this.editformVisibleSubject.next(this.isOpenedProviderSearch);
    }
  }
  onCloseProviderSearchClicked() {
    this.isOpenedProviderSearch = false;
    this.editformVisibleSubject.next(this.isOpenedProviderSearch);
    this.editbuttonEmitted =false;
  }
  onBusinessInfoCloseClicked()
  {
    this.isOpenedbusinessInfo = false;
  }

  onOpenBusinessLogicClicked()
  {
    this.onCloseProviderSearchClicked()
    this.isOpenedbusinessInfo = true;
  }
  onDeleteConfirmCloseClicked()
  {
    this.deletebuttonEmitted =false;
    this.isOpenedDeleteConfirm = false;
  }

  onRemoveClick(prvId : string)
  { 
    this.isOpenedDeleteConfirm = true;
    this.prvSelectedId = prvId;      
  }
 /** child component event methods **/

 /**from search component */
 handlePrvRemove(prvId : any)
 {
  this.onCloseProviderSearchClicked()
  this.onRemoveClick(prvId)
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

   searchTextEventHandleer($event : any)
   {
     this.searchTextEvent.next($event);
   }

   onProviderHover(dataItem : any)
   {
     this.gridHoverDataItem = dataItem;
     this.gridHoverDataItem.isClinic =false
   }

   onClinicHover(dataItem : any)
   {
     this.gridHoverDataItem = dataItem;
     this.gridHoverDataItem.isClinic =true 
   }

   addExistingProviderEventHandler($event : any)
   {
    this.addExistingProviderEvent.emit($event);

    this. addExistingProvider$.pipe(first((addResponse: any ) => addResponse != null))
    .subscribe((addResponse: any) =>
    {  
      if(addResponse ===true)
      {        
        this.loadHealthCareProvidersList()
        this.onCloseProviderSearchClicked()
      }
      
    })
  
   }


   onExistProviderFormLoad()
   {     
    this.subscriptionData =  this.loadExistingProvider$?.pipe(first((existProviderData: any ) => existProviderData?.providerId != null))
     .subscribe((existProviderData: any) =>
     {
       if( existProviderData?.providerId)
       {        
          this.existingProviderData=
          {           
              selectedProviderId: existProviderData?.providerId  ,
             providerId: existProviderData?.providerId  ,
            
          }   
          this.selectedCustomProviderName =existProviderData?.fullName+' '+ existProviderData?.clinicName+' '+ existProviderData?.address
          this.isOpenedProviderSearch = true;
          this.editformVisibleSubject.next(this.isOpenedProviderSearch);
        }
     });
    
   }
   
}
