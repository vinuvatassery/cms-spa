/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-phone-list',
  templateUrl: './phone-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneListComponent implements OnInit , OnChanges {

  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() clientPhonesData$: any;

  @Output() loadClientPhonesListEvent = new EventEmitter<any>(); 

  /** Public properties **/
  phoneNumbers$ = this.contactFacade.phoneNumbers$;
  isEditPhoneNumber!: boolean;
  isPhoneNumberDetailPopup = false;
  isDeactivatePhoneNumberPopup = false;
  public  state!: State
  // gridOption: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public gridOption = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Phone",
      icon: "edit",
      click: (): void => {
        this.onPhoneNumberDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Make Preferred",
      icon: "star",
      click: (): void => {
      //  this.onDeactivateEmailAddressClicked()
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

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadPhoneNumbers();
  }

   
  ngOnChanges(): void {     
    this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort
    };        
      this.loadClientPhonesList()
  } 

  /** Private methods **/
  private loadPhoneNumbers() {
    this.contactFacade.loadPhoneNumbers();
  }

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
    this.isPhoneNumberDetailPopup = false;
  }

  onPhoneNumberDetailClicked(editValue: boolean) {
    this.isPhoneNumberDetailPopup = true;
    this.isEditPhoneNumber = editValue;
  }

  onDeactivatePhoneNumberClosed() {
    this.isDeactivatePhoneNumberPopup = false;
  }

  onDeactivatePhoneNumberClicked() {
    this.isDeactivatePhoneNumberPopup = true;
  }
}
