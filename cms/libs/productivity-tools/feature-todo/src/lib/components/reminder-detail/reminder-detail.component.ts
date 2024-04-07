/** Angular **/
import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseFacade, FinancialVendorFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { ConfigurationProvider, SnackBarNotificationType, } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'productivity-tools-reminder-detail',
  templateUrl: './reminder-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderDetailComponent implements OnInit {
  currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  currentTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());
  showClientSearchInputLoader = false
  public formUiStyle: UIFormStyle = new UIFormStyle();

  /** Public properties **/
  clientReminderForm !: FormGroup
  isValidateForm = false
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaRemindermaxLength = 200;
  selectedMedicalProvider!:any
  tareaReminderCharachtersCount!: number;
  tareaReminderCounter!: string;
  tareaReminderDescription = '';
  isShowEntityTypeCode = false;
  dateValidator = false;

  @Input() entityTypeCodeSubject$! : Observable<any>
  @Input() providerSearchResult$!:Observable<any>
  @Input() medicalProviderSearchLoaderVisibility$! : Observable<any>
  @Output() isModalNewReminderCloseClicked = new EventEmitter();
  @Input() clientSearchLoaderVisibility$! : Observable<any>
  @Input() clientSearchResult$! : Observable<any>
  @Input() clientSubject! : Subject<any>;
  @Output() remainderFor = new EventEmitter(); 
  @Output() searchClientName = new EventEmitter();
  @Output() searchProvider = new EventEmitter();
  @Output() onReminderItemCreateClick = new EventEmitter();
  @Output() loadReminderItems = new EventEmitter();
  @Output() getReminderDetailsLov = new EventEmitter();
  @Input() searchProviderSubject! : Subject<any>
  @Output() onGetTodoItem = new EventEmitter();
@Input() isEdit = false;
@Input() isDelete = false;
@Input() alertId!:any
@Input() getTodo$!:any
  clientProfileHeader$ = this.caseFacade.clientProfileHeader$
  entityTypeCode =''
  entityId = ''
  showClientSearch = false;
  showVendorSearch = false;
  placeholderText ="Search Vendor Name, TIN"
  vendorPlaceHolderText = "Search for Vendor Name or TIN";
  clientPlaceHolderText = "Search Client Name, ID, or SSN";
  insuranceVendorPlaceHolderText = "Search Vendor Name, TIN"
  medicalDentalPlaceHolderText = "Search Provider Name, TIN"
  manufacturerPlaceHolderText = "Search Manufacturer Name, TIN"
  PharmacyPlaceHolderText = "Search Pharmacy Name, TIN"
  dateFormat = this.configurationProvider.appSettings.dateFormat;
 isSubmitted = false
 @Input() isFromNotificationPanel = false;
 allowCustom = false;
  constructor(private readonly todoFacade: TodoFacade, 
    private router : Router,
    private route : ActivatedRoute,
    private readonly caseFacade: CaseFacade,
    private configurationProvider: ConfigurationProvider,
    private financialVendorFacade : FinancialVendorFacade,
    public intl: IntlService,
    public formBuilder: FormBuilder,
    public cdr : ChangeDetectorRef) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if(this.isEdit ||  this.isDelete){
      this.onGetTodoItem.emit(this.alertId);
    }

   if(!this.isFromNotificationPanel){
    if(this.router.url.includes('vendors')){
      const vid = this.route.snapshot.queryParamMap.get('v_id')
      const tabcode = this.route.snapshot.queryParamMap.get('tab_code')
      this.financialVendorFacade.vendorProfileForReminderPanel$.subscribe(vp =>{  
        this.remainderFor.emit(vp?.vendorName)
      })
      this.entityTypeCode='VENDOR'
      if(vid && tabcode){
        this.entityId = vid
      this.financialVendorFacade.getVendorProfileForReminderPanel(vid,tabcode)
      }
    }
    if(this.router.url.includes('case360')){
      this.entityTypeCode='CLIENT'
      const id = this.route.snapshot.queryParamMap.get('id')
      if(id){
      this.caseFacade.clientProfileHeader$.subscribe(cp =>{      
        this.remainderFor.emit(cp?.clientFullName)
      })
      this.entityId = id
    
     this.caseFacade.loadClientProfileHeaderWithOutLoader(+id);
    }
  }
}
     if(!this.entityTypeCode){
      this.isShowEntityTypeCode = true
      this.getReminderDetailsLov.emit()
     }

    this.tareaVariablesIntialization();
    this.buildForm();
  }

  /** Private methods **/
  private tareaVariablesIntialization() {
    this.tareaReminderCharachtersCount = this.tareaReminderDescription
      ? this.tareaReminderDescription.length
      : 0;
    this.tareaReminderCounter = `${this.tareaReminderCharachtersCount}/${this.tareaRemindermaxLength}`;
  }

  /** Internal event methods **/
  onTareaReminderValueChange(event: any): void {
    this.tareaReminderCharachtersCount = event.length;
    this.tareaReminderCounter = `${this.tareaReminderCharachtersCount}/${this.tareaRemindermaxLength}`;
  }
  private buildForm() {

    this.clientReminderForm = this.formBuilder.group({
      dueDate: [null,Validators.required],
      time: [null],
      description: ['',Validators.required],
      linkTo: [''],
      vendorId :[null],
      clientId :[null],
      addToOutlookCalender: [false],
      deleteFromOutlookCalender :[true]
    });
   if(this.isDelete || this.isEdit){
   this.getTodo$.subscribe((res:any) =>{
    if(res){
      const repeatTime = res.repeatTime?.split(':')
      this.clientReminderForm.patchValue({
        description: res.alertDesc,
        addToOutlookCalender: res.addToOutlookFlag =="Y",
        time : repeatTime? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), repeatTime[0], repeatTime[1]) : null
      })
    }
      if(this.isDelete && res){
        this.clientReminderForm.controls["dueDate"].setValue(new Date(res.alertDueDate));
        this.clientReminderForm.controls['time'].disable()
        this.clientReminderForm.controls['description'].disable()
        this.clientReminderForm.controls['addToOutlookCalender'].disable()
        this.clientReminderForm.controls['dueDate'].disable()
        this.isShowEntityTypeCode = false;
      }

     if(this.isEdit && res){
      this.clientReminderForm.controls["dueDate"].setValue(new Date(res.alertDueDate));
      this.entityTypeCode= res.entityTypeCode
      this.entityId = res.entityId
      this.clientReminderForm.controls["linkTo"].setValue(res.entityTypeCode)
     if(res.entityTypeCode !=='CLIENT'){
      this.showVendorSearch = true;
      this.showClientSearch = false;
      this.placeholderText = this.vendorPlaceHolderText;
      this.selectedMedicalProvider =   { providerName : res.providerName,
        tin : res.tin,
        providerId: res.entityId
      };
      this.allowCustom = true;
      this.searchProviderSubject.next([
        { providerName : res.providerName,
          tin : res.tin,
          providerId: res.entityId
        }
      ])
      this.clientReminderForm.controls["vendorId"].setValue({
        providerName : res.providerName,
        tin : res.tin,
        providerId: res.entityId
      })
      this.clientReminderForm.controls['vendorId'].updateValueAndValidity();
     
    }else{
      this.showVendorSearch = false;
      this.showClientSearch = true;
      this.placeholderText = this.clientPlaceHolderText;

      this.clientSubject.next([{
        clientFullName : res.clientFullName,
        dob : res.dob,
        ssn: res.ssn,
        clientId : res.entityId
      }])
      this.clientReminderForm.controls["clientId"].setValue({
        clientFullName : res.clientFullName,
        dob : res.dob,
        ssn: res.ssn,
        clientId : res.entityId
      })
     }
   }
  })
}
  }
 
  onCloseReminderClicked() 
  {
    this.isModalNewReminderCloseClicked.emit();
  }

  dateValidate(event: Event) {
    this.dateValidator = false;
    const signedDate = this.clientReminderForm.controls['dueDate'].value;
    const todayDate = new Date();
    signedDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    if (signedDate.getTime() === todayDate.getTime()) {
      this.dateValidator = false;
    }
    else if (signedDate < todayDate) {
      this.dateValidator = true;
    }
  }

  afterCrudOperationAddSubscription(){
    this.todoFacade.curdAlert$.subscribe(res =>{
      if(res){    
      this.loadReminderItems.emit()
      this.isModalNewReminderCloseClicked.emit(true)
      }
    })
  }

  setLinkToAndEntity(){
    if(this.isShowEntityTypeCode && this.clientReminderForm.controls['linkTo'].value && this.clientReminderForm.controls['linkTo'].value =='CLIENT'){
      this.entityTypeCode = 'CLIENT'
      this.entityId =  this.clientReminderForm.controls['clientId'].value.clientId?.toString()
    }else   if( this.isShowEntityTypeCode && this.clientReminderForm.controls['linkTo'].value && this.clientReminderForm.controls['linkTo'].value !=='VENDOR'){
      this.entityTypeCode = 'VENDOR'
      this.entityId =  this.clientReminderForm.controls['vendorId'].value.providerId?.toString()
    }
  }

  prepareCommonPayload(){
    return {
      alertDueDate :  this.clientReminderForm.controls['dueDate'].value,
      alertDesc : this.clientReminderForm.controls['description'].value,
      entityTypeCode : this.entityTypeCode,
      entityId :this.entityId ,
      customAlertFlag : 'Y',
      type :'REMINDER',
      alertFrequencyCode :'NEVER',
      alertName :  'REMINDER',
      AddToOutlookFlag :  this.clientReminderForm.controls['addToOutlookCalender'].value ? "Y" : "N"
    }
  }

  prepareRepeatPayload(){
    if(this.isEdit){
    return {
      ...this.prepareCommonPayload(),
      repeatTime : new Date(this.clientReminderForm.controls['time'].value).getHours()+":"+new Date(this.clientReminderForm.controls['time'].value).getMinutes(),
      alertId : this.alertId,
    } 
  }else{
    return {
      ...this.prepareCommonPayload(),
      repeatTime : new Date(this.clientReminderForm.controls['time'].value).getHours()+":"+new Date(this.clientReminderForm.controls['time'].value).getMinutes(),
    } 
  }
  }

  updateReminder(){
    if(this.clientReminderForm.controls['time'].value){
      this.todoFacade.updateAlertItem(this.prepareRepeatPayload()) 
     }else{
      this.todoFacade.updateAlertItem({
        ...this.prepareCommonPayload(),
        alertId : this.alertId,
      }) 
     }  
  }
  
  addReminder(){
      if(this.clientReminderForm.controls['time'].value){
        this.todoFacade.createAlertItem(this.prepareRepeatPayload()) 
       }else{
        this.todoFacade.createAlertItem(this.prepareCommonPayload()) 
       }  
      }
  

  public save() {
    this.isSubmitted = true;
    this.afterCrudOperationAddSubscription();
    this.setLinkToAndEntity();
    this.timeValidation();
    this.dueDateValidation();
   this.clientReminderForm.markAllAsTouched();
   if (this.clientReminderForm.valid) {
   if(this.isEdit){
    this.updateReminder()
   }else{
     this.addReminder()
   }
    }
  }

  delete(){
    this.todoFacade.curdAlert$.subscribe(res =>{
      if(res){    
      this.loadReminderItems.emit()
      this.isModalNewReminderCloseClicked.emit(true)
      }
    })
    this.todoFacade.deleteAlert(this.alertId, 
     this.clientReminderForm.controls['deleteFromOutlookCalender'].value ? 'Y' :'N'
    );
    
  }
  onLinkToChange(event:any){
    if(event == 'CLIENT'){
      this.clientReminderForm.controls['clientId'].enable()
  this.showClientSearch = true;
  this.showVendorSearch = false;
  this.placeholderText= this.clientPlaceHolderText
    }else{
    this.clientReminderForm.controls['vendorId'].enable()
      this.showClientSearch = false;
      this.showVendorSearch = true;
    this.getPlaceHolderText(event);
    }
  }

  providerSelectionChange(event : any){  
    console.log(event)
    this.remainderFor.emit(event.providerName)
  }
  clientSelectionChange(event:any){
    this.remainderFor.emit(event.clientFullName)
  }
  getPlaceHolderText(vendorType : any) {
    
    switch (vendorType) {
      case FinancialVendorTypeCode.InsuranceVendors:
        this.placeholderText = this.vendorPlaceHolderText;
        break;
      case FinancialVendorTypeCode.Manufacturers:
        this.placeholderText = this.manufacturerPlaceHolderText;
        break;
      case FinancialVendorTypeCode.MedicalProviders:
      case FinancialVendorTypeCode.DentalProviders:
        this.placeholderText = this.medicalDentalPlaceHolderText;
        break;
      case FinancialVendorTypeCode.Pharmacy:
        this.placeholderText = this.PharmacyPlaceHolderText;
        break;
    }
  }
  loadVendorsBySearchText(vendorSearchText:any){
    this.allowCustom = false;
    if (!vendorSearchText || vendorSearchText.length == 0) {
      return
    }
    this.searchProvider.emit({SearchText : vendorSearchText, 
      VendorTypeCode : this.clientReminderForm.controls['linkTo'].value})
  }
  loadClientBySearchText(clientSearchText: any) {
    if (!clientSearchText || clientSearchText.length == 0) {
      return
    }
    this.showClientSearchInputLoader = true;
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.clientSearchResult$.subscribe(res =>{
      this.showClientSearchInputLoader = false;
    })
    this.searchClientName.emit(clientSearchText)
  }

  dueDateValidation(){
    const dueDate = new Date(this.intl.formatDate(this.clientReminderForm.controls['dueDate'].value, this.dateFormat));
    const todayDate =  new Date(this.intl.formatDate(new Date(), this.dateFormat));
    this.timeValidation()
    if ( this.clientReminderForm.controls['dueDate'].value && dueDate < todayDate) {
      this.clientReminderForm.controls['dueDate'].setErrors({ 'incorrect': true });
      return;
    }
    return true;
  }

  timeValidation(){
    const timeInMinutes = new Date(this.clientReminderForm.controls['time'].value).getMinutes();
    const timeInHours = new Date(this.clientReminderForm.controls['time'].value).getHours();
    const dueDate = this.intl.formatDate(this.clientReminderForm.controls['dueDate'].value, this.dateFormat);
    const todayDate =  this.intl.formatDate(new Date(), this.dateFormat);
   
    if ( this.clientReminderForm.controls['dueDate'].value && dueDate == todayDate) {
   {
    if ( this.clientReminderForm.controls['time'].value &&
    (timeInHours ==  new Date().getHours() && timeInMinutes <= new Date().getMinutes())
    || timeInHours <  new Date().getHours() ) {
      this.clientReminderForm.controls['time'].setErrors({ 'incorrect': true });
      return;
    }
  }
}
  else{
    this.clientReminderForm.controls['time'].setErrors({ 'incorrect': null })
    this.clientReminderForm.controls['time'].updateValueAndValidity();
    return;
  }
  }
}
