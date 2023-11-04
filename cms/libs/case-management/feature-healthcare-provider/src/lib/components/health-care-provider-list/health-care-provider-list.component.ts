/** Angular **/
import {
  Component,  ChangeDetectionStrategy,  Input,  Output,  EventEmitter, OnChanges, ChangeDetectorRef,} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { first, Subject, Subscription } from 'rxjs';
import { CaseFacade,ContactFacade, FinancialVendorFacade } from '@cms/case-management/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-health-care-provider-list',
  templateUrl: './health-care-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderListComponent implements  OnChanges {
  /** Input properties **/
  @Input() managementTab =  false;
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
  @Input() searchProviderLoaded$: any;
  @Input() healthCareProvideReactivate$: any;
  @Input() showAddNewProvider$ : any

  @Output() deleteConfimedEvent =  new EventEmitter<string>();
  @Output() deactivateConfimEvent =  new EventEmitter<string>();
  @Output() reactivateConfimEvent =  new EventEmitter<string>();
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
  isOpenedDeactivateConfirm = false;
  isOpenedReactivateConfirm = false;
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
  deactivateButtonEmitted =false;
  reactivateButtonEmitted =false;
  clientProviderId! :any
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  notApplicable :any ='Not Applicable'
  medicalProviderForm: FormGroup;
  hasHealthcareProviderCreateUpdatePermission=false;
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (clientProviderId : string): void => {     
        if(!this.editbuttonEmitted)
        {                 
        this.editbuttonEmitted= true;
        this.onOpenProviderSearchClicked(clientProviderId ,true);
        }
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove",
      icon: "delete",
      click: (clientProviderId : string): void => {    
        if(!this.deletebuttonEmitted)
        {         
          this.deletebuttonEmitted =true;
        this.onRemoveClick(clientProviderId)
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      buttonName: 'deactivate',
      click: (clientProviderId: string): void => {
        if (!this.deactivateButtonEmitted) {         
          this.deactivateButtonEmitted = true;
          this.onDeactivateClick(clientProviderId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      buttonName: 'reactivate',
      click: (clientProviderId: string): void => {
        if (!this.reactivateButtonEmitted) {         
          this.reactivateButtonEmitted = true;
          this.onReactivateClick(clientProviderId);
        }
      },
    }
  ];
  ddlStates=this.contactFacade.ddlStates$;
  clinicVendorList= this.financialVendorFacade.clinicVendorList$;
  clinicVendorLoader= this.financialVendorFacade.clinicVendorLoader$;
  constructor(private caseFacade: CaseFacade,private financialVendorFacade: FinancialVendorFacade,private contactFacade:ContactFacade,
    private userManagementFacade:UserManagementFacade, private readonly formBuilder: FormBuilder,private readonly cdr: ChangeDetectorRef,){
    this.medicalProviderForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/ 
  ngOnInit() { 
    this.contactFacade.loadDdlStates();  
    this.hasHealthcareProviderCreateUpdatePermission=this.userManagementFacade.hasPermission(['Service_Provider_Medical_Dental_Provider_Create_Update']);
  }
  ngOnChanges(): void {     
    this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort
    };        
      this.loadHealthCareProvidersList()
  } 

  

   // updating the pagination infor based on dropdown selection
pageselectionchange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadHealthCareProvidersList()
}
  /** Internal event methods **/
  onCloseProviderClicked() {
    this.isOpenedProvider = false;
  }

  onOpenProviderClicked(isEditHealthProviderValue: boolean) {
    this.isOpenedProvider = true;
    this.isEditHealthProvider = isEditHealthProviderValue;
  }

  onOpenProviderSearchClicked(clientProviderId : string,isEdit : boolean) {
    this.selectedCustomProviderName="";
   
    this.isEditSearchHealthProvider = isEdit;
    this.clientProviderId = clientProviderId;
    if(isEdit === true)
    {
    this.getExistingProviderEvent.emit(this.clientProviderId)
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
    this.buildVendorForm();
    this.isOpenedbusinessInfo = true;
  }
  onDeleteConfirmCloseClicked()
  {
    this.deletebuttonEmitted =false;
    this.isOpenedDeleteConfirm = false;
  }

  onDeactConfirmCloseClicked()
  {
    this.deletebuttonEmitted =false;
    this.isOpenedDeactivateConfirm = false;
  }

  onReactConfirmCloseClicked()
  {
    this.deletebuttonEmitted =false;
    this.isOpenedReactivateConfirm = false;
  }

  onRemoveClick(clientProviderId : string)
  { 
    this.isOpenedDeleteConfirm = true;
    this.clientProviderId = clientProviderId;      
  }

  onDeactivateClick(clientProviderId : string)
  { 
    this.isOpenedDeactivateConfirm = true;
    this.clientProviderId = clientProviderId;      
  }

  onReactivateClick(clientProviderId : string)
  { 
    this.isOpenedReactivateConfirm = true;
    this.clientProviderId = clientProviderId;      
  }
 /** child component event methods **/

 /**from search component */
 handlePrvRemove(clientProviderId : any)
 {
  this.onCloseProviderSearchClicked()
  this.onRemoveClick(clientProviderId)
 }

      /** External event methods **/
  handleDeclinePrvRemove() {
    this.onDeleteConfirmCloseClicked()
  }

  handleAcceptProviderRemove(isDelete :boolean)
   {  
      if(isDelete)
      {
        this.deletebuttonEmitted =false;
        this.deleteConfimedEvent.emit(this.clientProviderId);

        this.removeHealthProvider$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((deleteResponse: any) =>
        {  
          if(deleteResponse ?? false)
          {
            this.loadHealthCareProvidersList()
          }
          
        })
      }      
      this.onDeleteConfirmCloseClicked()        
   }

   handleAcceptProviderDeact(isDeactivate:any)
   {  
      if(isDeactivate)
      {
        this.deactivateButtonEmitted =false;
        this.deactivateConfimEvent.emit(this.clientProviderId);

        this.removeHealthProvider$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((deleteResponse: any) =>
        {  
          if(deleteResponse ?? false)
          {
            this.loadHealthCareProvidersList()
          }
          
        })
      }      
      this.onDeactConfirmCloseClicked()        
   }

   
   handleAcceptPrvReact(isReactivate:any)
   {  
      if(isReactivate)
      {
        this.reactivateButtonEmitted =false;
        this.reactivateConfimEvent.emit(this.clientProviderId);

        this.healthCareProvideReactivate$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((deleteResponse: any) =>
        {  
          if(deleteResponse ?? false)
          {
            this.loadHealthCareProvidersList()
          }
          
        })
      }      
      this.onReactConfirmCloseClicked()        
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

   buildVendorForm() {
    this.medicalProviderForm.reset();
    this.medicalProviderForm = this.formBuilder.group({
      firstName:[''],
      lastName:[],
      providerName: [''],
      tinNumber: [''],
      npiNbr: [''],
      paymentMethod: [''],
      specialHandling: [''],
      mailCode: [''],
      nameOnCheck: [''],
      nameOnEnvolop: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zip: [''],
      physicalAddressFlag: [''],
      isPreferedPharmacy: [''],
      paymentRunDate:[''],
      isAcceptCombinedPayment:[''],
      isAcceptReports: [''],
      newAddContactForm: this.formBuilder.array([
      ]),
      activeFlag:[]
    });
  }

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  saveVendorProfile(vendorProfile: any){
    
    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next:(response:any)=>{
        this.financialVendorFacade.hideLoader();
        this.onBusinessInfoCloseClicked();
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,"Vendor profile added successfully");
        this.cdr.detectChanges();
      },
      error:(err:any)=>{
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      }
    });
  }
  searchClinicVendorClicked(clientName:any)
  {
    
    this.financialVendorFacade.searchClinicVendor(clientName);
  }
}
