/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
/** Facades **/
import { State } from '@progress/kendo-data-query';
import { first, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-phone-list',
  templateUrl: './phone-list.component.html',
  styleUrls: ['./phone-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneListComponent implements  OnChanges {

  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() clientPhonesData$: any;
  @Input() clientPhone$: any;
  @Input() lovClientPhoneDeviceType$: any
  @Input() addClientPhoneResponse$ : any
  @Input() preferredClientPhone$: any;
  @Input() deactivateClientPhone$: any
  @Input() removeClientPhone$ : any

  @Output() loadClientPhonesListEvent = new EventEmitter<any>(); 
  @Output() addClientPhoneEvent = new EventEmitter<any>(); 
  @Output() loadDeviceTypeLovEvent = new EventEmitter<any>(); 
  @Output() loadSelectedPhoneEvent = new EventEmitter<any>(); 
  @Output() preferredClientPhoneEvent = new EventEmitter<any>(); 
  @Output() deactivateClientPhoneEvent = new EventEmitter<any>(); 
  @Output() removeClientPhoneEvent = new EventEmitter<any>(); 

  /** Public properties **/
  isEditPhoneNumber!: boolean;
  isPhoneNumberDetailPopup = false;
  isDeactivatePhoneNumberPopup = false;
  deletebuttonEmitted = false;
  editbuttonEmitted = false;
  activateButtonEmitted = false;
  preferredButtonEmitted = false;
  subscriptionData! : Subscription;
  selectedPhoneData! : any
  editformVisibleSubject = new Subject<boolean>();
  editformVisible$ = this.editformVisibleSubject.asObservable();
  isOpenedPhoneEdit = false;
  public  state!: State
  // gridOption: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public gridOption = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Phone",
      icon: "edit",
      click: (clientPhoneId : string): void => {                
        if(!this.editbuttonEmitted)
        {                 
        this.editbuttonEmitted= true;
        this.onPhoneNumberDetailClicked(true,clientPhoneId);
        }
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Make Preferred",
      icon: "star",
      click: (clientPhoneId : string): void => {   
        if(!this.preferredButtonEmitted)
        {                 
        this.preferredButtonEmitted= true;
        this.onPreferredPhoneClicked(clientPhoneId);
        }       
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Phone",
      icon: "block",
      click: (): void => {
       this.onDeactivatePhoneNumberClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Phone",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
   
    
 
  ];
   
  ngOnChanges(): void {     
    this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort
    };        
      this.loadClientPhonesList()
  } 

  /** Private methods **/

  private loadClientPhonesList(): void {   
    this.loadPhones(this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType ,false)    
  }
  loadPhones(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string,showDeactivated : boolean)
   {
     const gridDataRefinerValue = 
     {
       skipCount: skipcountValue,
       pagesize : maxResultCountValue,
       sortColumn : sortValue,
       sortType : sortTypeValue,
       showDeactivated: showDeactivated
     }
     this.loadClientPhonesListEvent.next(gridDataRefinerValue)
   }

        /** grid event methods **/
 
    public dataStateChange(stateData: any): void {               
          this.sort = stateData.sort;
          this.sortValue = stateData.sort[0]?.field
          this.sortType = stateData.sort[0]?.dir ?? 'asc'
          this.state=stateData;
          this.loadClientPhonesList();   
    }

  /** Internal event methods **/
  onPhoneNumberDetailClosed() {
    this.editbuttonEmitted= false;
    this.isPhoneNumberDetailPopup = false;
    this.isOpenedPhoneEdit = false;
    this.editformVisibleSubject.next(this.isOpenedPhoneEdit);
  }

  onPhoneNumberDetailClicked(editValue: boolean, clientPhoneId : string) {
   
    this.isEditPhoneNumber = editValue;
    if(clientPhoneId)
    {
    this.loadSelectedPhoneEvent.emit(clientPhoneId)
    this.onSelectedPhoneFormLoad()
    }
    else
    {
      this.isOpenedPhoneEdit = true;
      this.editformVisibleSubject.next(this.isOpenedPhoneEdit);
    }
  }

  onDeactivatePhoneNumberClosed() {
    this.isDeactivatePhoneNumberPopup = false;
  }

  onDeactivatePhoneNumberClicked() {
    this.isDeactivatePhoneNumberPopup = true;
  }

  addClientPhoneHandle(phoneData : any): void
  {  
    this.editbuttonEmitted= true;
    this.addClientPhoneEvent.emit(phoneData);

    this.addClientPhoneResponse$.pipe(first((addResponse: any ) => addResponse != null))
    .subscribe((addResponse: any) =>
    {  
      if(addResponse ===true)
      {        
        this.loadClientPhonesList()
        this.onPhoneNumberDetailClosed()
      }
      
    })
  } 

  loadDeviceTypeLovHandle()
  {
    this.loadDeviceTypeLovEvent.emit()
  }

  onSelectedPhoneFormLoad()
  {     
   this.subscriptionData =  this.clientPhone$?.pipe(first((phoneData: any ) => phoneData?.clientPhoneId != null))
    .subscribe((phoneData: any) =>
    {
      if(phoneData?.clientPhoneId)
      {        
         this.selectedPhoneData=
         {           
          clientPhoneId: phoneData?.clientPhoneId   ,
          phoneNbr: phoneData?.phoneNbr   ,
          detailMsgConsentFlag: phoneData?.detailMsgConsentFlag   ,
          deviceTypeCode: phoneData?.deviceTypeCode   ,
          smsTextConsentFlag: phoneData?.smsTextConsentFlag   ,       
          preferredFlag: phoneData?.preferredFlag   , 
          otherPhoneNote: phoneData?.otherPhoneNote  
           
         }           
         this.isOpenedPhoneEdit = true;
         this.editformVisibleSubject.next(this.isOpenedPhoneEdit);
       }
    });
   
  }  

  onPreferredPhoneClicked(clientPhoneId : string)
  {
    this.preferredClientPhoneEvent.emit(clientPhoneId)
    this.preferredClientPhone$.pipe(first((Response: any ) => Response != null))
    .subscribe((Response: any) =>
    {  
      if(Response ===true)
      {      
        this.preferredButtonEmitted= false;  
        this.loadClientPhonesList()      
      }
      
    })
  }
 
}
