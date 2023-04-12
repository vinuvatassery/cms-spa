/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';


import { UIFormStyle } from '@cms/shared/ui-tpa';
import { first, Subject } from 'rxjs';
@Component({
  selector: 'case-management-case-manager-list',
  templateUrl: './case-manager-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerListComponent implements OnInit {

  /******* output events */
  @Output() loadCasemanagersGridEvent =  new EventEmitter();
  @Output() deleteCasemanagersGridEvent =  new EventEmitter<string>();
  @Output() searchTextEvent = new EventEmitter<string>(); 
  @Output() getExistingCaseManagerEvent= new EventEmitter<string>(); 
  @Output() addExistingCaseManagerEvent= new EventEmitter<string>(); 
  @Output() loadprofilePhotoEvent =  new EventEmitter<string>();

  /** Input properties **/
  @Input()  getCaseManagers$ : any
  @Input() showAddNewManagerButton$ : any
  @Input() getManagerUsers$ : any;
  @Input() selectedCaseManagerDetails$ : any
  @Input() assignCaseManagerStatus$ : any
  @Input() removeCaseManager$: any
  @Input() userImage$: any
  @Input() managementTab: any

  /** Public properties **/
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  selectedCustomCaseManagerName! : string;
  editformVisibleSubject = new Subject<boolean>();
  editformVisible$ = this.editformVisibleSubject.asObservable();
  
  existingCaseManagerData! : any;
  isOpenedCaseManagerSearch =false;
  editButtonEmitted = false;
  removeButttonEmitted = false;
  showDeleteConfirmation = false;
  showEditpopup = false;
  deleteCaseManagerCaseId! : string
  isEditSearchCaseManagerProvider = false;
  selectedCaseManagerId! : string;
  gridHoverDataItem! : any
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Case Manager",
      icon: "edit",
      click: (clientCaseId : string,caseManagerId : string): void => {
        if(!(this.editButtonEmitted ?? false))
        {
          this.editButtonEmitted = true;
          this.deleteCaseManagerCaseId = clientCaseId
         this.onOpenManagerSearchClicked(clientCaseId , caseManagerId ,true);
        }
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove Case Manager",
      icon: "delete",
      click: (clientCaseId : string, caseManagerId : string): void => {
        if(this.removeButttonEmitted === false)
        {
          this.deleteCaseManagerCaseId = clientCaseId
          this.onremoveManagerClicked()
          this.removeButttonEmitted = true;
        }
      },
    },
  ];


  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadManagers();
  }

  /** Private methods **/
  private loadManagers() {
  this.loadCasemanagersGridEvent.emit()
  }

  onManagerHover(dataItem : any)
  {
   this.gridHoverDataItem=dataItem    
  }
  

  onOpenManagerSearchClicked(clientCaseId : string,caseManagerId: string,isEdit : boolean) {
    this.selectedCustomCaseManagerName="";
   
    this.isEditSearchCaseManagerProvider = isEdit;
    this.selectedCaseManagerId = caseManagerId;
    if(isEdit === true)
    {      
    this.getExistingCaseManagerEvent.emit(this.selectedCaseManagerId)
    this.onExistCaseManagerFormLoad();
    }
    else
    {
      this.isOpenedCaseManagerSearch = true;
      this.editformVisibleSubject.next(this.isOpenedCaseManagerSearch);
    }
  }

  onremoveManagerClicked()
  {
    this.showDeleteConfirmation = true;
  }

  onDeleteConfirmCloseClicked()
  {
    this.showDeleteConfirmation = false;
    this.removeButttonEmitted = false;
  }

  onDeleteConfirmHandle($event : any)
  {
    
    if(!($event ?? false))
    {
      this.onDeleteConfirmCloseClicked()
    }
    else
    {
       this.deleteCasemanagersGridEvent.emit(this.deleteCaseManagerCaseId)
       this.removeCaseManager$.pipe(first((removeResponse: any ) => removeResponse != null))
       .subscribe((removeResponse: any) =>
       {  
         if(removeResponse ===true)
         {        
           this.loadManagers();
           this.onDeleteConfirmCloseClicked() 
         }
         
       })
          
    }
  }

  handleManagerRemove(caseManagerCaseId : any)
  {    
    this. onCloseCsManagerSearchClicked();    
    this.onremoveManagerClicked();
  }
  onCloseCsManagerSearchClicked()
  {
    this.editButtonEmitted = false;
    this.editformVisibleSubject.next(false);
  }

  searchTextEventHandleer($event : any)
  {    
    this.searchTextEvent.next($event);
  }


  addExistingCaseManagerEventEventHandler($event : any)
  {
   this.addExistingCaseManagerEvent.emit($event);

   this.assignCaseManagerStatus$.pipe(first((addResponse: any ) => addResponse != null))
   .subscribe((addResponse: any) =>
   {  
     if(addResponse ?? false)
     {        
       this.loadManagers();
       this.onCloseCsManagerSearchClicked()
     }
     
   })
 
  }

  onExistCaseManagerFormLoad()
  {     
    this.selectedCaseManagerDetails$?.pipe(first((existcsManagerData: any ) => existcsManagerData?.loginUserId != null))
    .subscribe((existcsManagerData: any) =>
    {
      if( existcsManagerData?.loginUserId)
      {        
         this.existingCaseManagerData =
         {           
          assignedcaseManagerId: existcsManagerData?.loginUserId  
         }   
         this.selectedCustomCaseManagerName = existcsManagerData?.fullName+' '+ existcsManagerData?.pOrNbr+' '+ existcsManagerData?.phoneNbr
         this.isOpenedCaseManagerSearch = true;
         this.editformVisibleSubject.next(this.isOpenedCaseManagerSearch);
       }
    });
   
  }


  loadprofilePhotoEventHandler(caseManagerId : string)
  {    
   this.loadprofilePhotoEvent.emit(caseManagerId)
  }

}
