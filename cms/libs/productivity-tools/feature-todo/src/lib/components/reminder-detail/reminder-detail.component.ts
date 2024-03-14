/** Angular **/
import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter, Input } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
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
  currentDate = new Date();
  showClientSearchInputLoader = false
  public formUiStyle: UIFormStyle = new UIFormStyle();

  /** Public properties **/
  clientReminderForm !: FormGroup
  isValidateForm = false
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaRemindermaxLength = 200;
  tareaReminderCharachtersCount!: number;
  tareaReminderCounter!: string;
  tareaReminderDescription = '';
  isShow = false;
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
  @Output() getReminderDetailsLov = new EventEmitter();

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
  constructor(private readonly todoFacade: TodoFacade, 
    private router : Router,
    private route : ActivatedRoute,
    private readonly caseFacade: CaseFacade,
    private configurationProvider: ConfigurationProvider,
    private financialVendorFacade : FinancialVendorFacade,
    public intl: IntlService) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    if(this.router.url.includes('vendors')){
      const vid = this.route.snapshot.queryParamMap.get('v_id')
      const tabcode = this.route.snapshot.queryParamMap.get('tab_code')
      this.financialVendorFacade.vendorProfile$.subscribe(vp =>{  
        this.remainderFor.emit(vp?.vendorName)
      })
      this.entityTypeCode='VENDOR'
      if(vid && tabcode){
        this.entityId = vid
      this.financialVendorFacade.getVendorProfile(vid,tabcode)
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
    
     this.caseFacade.loadClientProfileHeader(+id);
    }
  }
     if(!this.entityTypeCode){
      this.isShow = true
      this.getReminderDetailsLov.emit()
     }

    this.tareaVariablesIntialization();
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
    this.clientReminderForm = new FormGroup({
      dueDate: new FormControl(''),
      time: new FormControl(''),
      description: new FormControl(''),
      linkTo: new FormControl(''),
      vendorId : new FormControl({}),
      clientId :new FormControl({}),
      addToOutlookCalender: new FormControl(''),
    });
  }
 
  onCloseReminderClicked() 
  {
    this.isModalNewReminderCloseClicked.emit(true);
  }
  setValidators() {
    this.clientReminderForm.markAllAsTouched();
    this.clientReminderForm.controls['dueDate'].setValidators([Validators.required,]);
    this.clientReminderForm.controls['dueDate'].updateValueAndValidity();
    this.clientReminderForm.controls['description'].setValidators([Validators.required,]);
    this.clientReminderForm.controls['description'].updateValueAndValidity();
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

  public save() {
    this.todoFacade.curdAlert$.subscribe(res =>{
      if(res){    
      this.isModalNewReminderCloseClicked.emit(true)
      }
    })

    this.setValidators();
   const dueDate = new Date(this.intl.formatDate(this.clientReminderForm.controls['dueDate'].value, this.dateFormat));
    console.log(this.clientReminderForm.controls['time'].value)
    if (this.clientReminderForm.valid) {
      const payload ={
        alertDueDate :  dueDate,
        alertDesc : this.clientReminderForm.controls['description'].value,
        entityTypeCode : this.entityTypeCode,
        entityId :this.entityId ,
        customAlertFlag : 'Y',
        type :'REMINDER',
        alertFrequencyCode :'NEVER',
        alertName :  'REMINDER',
        AddToOutlookFlag :  this.clientReminderForm.controls['addToOutlookCalender'].value ? "Y" : "N"
      }
     if(this.clientReminderForm.controls['time'].value){
     let payloadWithRepeat ={
        ... payload,
        repeatTime : new Date(this.clientReminderForm.controls['time'].value).getHours()+":"+new Date(this.clientReminderForm.controls['time'].value).getMinutes()
      }    
      this.todoFacade.createAlertItem(payloadWithRepeat)
     }else{
     this.todoFacade.createAlertItem(payload)
     }
     this.isModalNewReminderCloseClicked.emit();
    }
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

  
}
