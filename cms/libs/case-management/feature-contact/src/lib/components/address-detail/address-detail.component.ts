/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,OnDestroy,ChangeDetectorRef
} from '@angular/core';
import {  FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
/** External Libraries **/
import {  BehaviorSubject, of, Subscription } from 'rxjs';

/** Internal Libraries **/
import { ContactFacade, StatesInUSA, ClientAddress } from '@cms/case-management/domain';
import { LovFacade,MailAddress,AddressValidationFacade, AddressValidation } from '@cms/system-config/domain';
import { UIFormStyle, IntlDateService } from '@cms/shared/ui-tpa'
import { SnackBarNotificationType,NotificationSnackbarService, ConfigurationProvider, LoaderService} from '@cms/shared/util-core';

@Component({
  selector: 'case-management-address-detail',
  templateUrl: './address-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressDetailComponent implements OnInit, OnDestroy {
 
  public currentDate = new Date();
  public formUiStyle : UIFormStyle = new UIFormStyle();
 
  /** Input properties**/
  @Input() isEditValue!: boolean;
  @Input() clientId!: number;
  @Input() caseEligibilityId!: string;

  /** Public properties **/
  ddlCountries$ = this.contactFacade.ddlCountries$;
  ddlStates$ = this.contactFacade.ddlStates$;
  ddlAddressTypes$ = this.lovFacade.addressType$;  
  editedAddress$ = this.contactFacade.editedAddress$;  
  editedAddressSubscription!:Subscription;
  stateSubscription!:Subscription;
  countrySubscription!:Subscription;
  isDeactivateValue!: boolean;
  isDeactivateAddressPopup = true;
  isAddressLine1Disabled = true;
  isAddressLine2Disabled = true;
  isZIPDisabled = true;
  isCityDisabled = true;
  isStateDisabled = true;
  isCountryDisabled = true;
  isEffectiveDateDisabled = true;
  addressIsValid=true
  addressForm!:FormGroup;
  selectedAddressForm!:FormGroup;
  showCountyLoader = this.contactFacade.showloaderOnCounty$;
  effectiveDateValidator:boolean= true;
  address!:any;
  addressValidationPopupVisibility$ = new BehaviorSubject(false);  
  showAddressValidationLoader$= new BehaviorSubject(false);  
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  //mailingAddressIsNotValid: boolean = false;
  addressEntered: MailAddress | undefined;
  addressSuggested: MailAddress | undefined;
  clientAddress!: ClientAddress ;

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade,
    private readonly formBuilder: FormBuilder, private readonly lovFacade: LovFacade,
    private readonly addressValidationFacade: AddressValidationFacade,
    private readonly snackbarService: NotificationSnackbarService,
    public readonly intl: IntlDateService,private readonly configurationProvider: ConfigurationProvider,    
    private loaderService: LoaderService,private readonly cd: ChangeDetectorRef) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlStates();    
    this.loadDdlCounties(StatesInUSA.Oregon);
    this.onEditAddressClicked();
    this.buildAddressForm();
    this.buildAddressValidationForm();
    this.loadAddressTypeLovs();
    this.disableAllFields();
    this.pageSubscription();
   
  }
  ngOnDestroy(): void {
    this.editedAddressSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
    this.countrySubscription.unsubscribe();
  }
  /** Private methods **/
  private pageSubscription(){
    this.editedAddressSubscription =  this.editedAddress$.subscribe(address=>{
      this.bindModelToForm(address);
    });
    this.stateSubscription = this.ddlStates$.subscribe(state=>{
      if(this.isEditValue){
        this.addressForm.controls["state"].setValue(this.address.stateCode);
      }
    });
    this.countrySubscription = this.  ddlCountries$.subscribe(country=>{
      debugger;
      this.addressForm.controls["country"].setValue(this.address.county);
    })
  }
   private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }
  private loadAddressTypeLovs(){
    this.lovFacade.getAddressTypeLovs();
  }
  private loadDdlCounties(stateCode: string) {
    this.contactFacade.loadDdlCounties(stateCode);
  }
  private onEditAddressClicked() {
    if (!this.isEditValue) {
      this.isAddressLine1Disabled = true;
      this.isAddressLine2Disabled = true;
      this.isZIPDisabled = true;
      this.isCityDisabled = true;
      this.isStateDisabled = true;
      this.isCountryDisabled = true;
    }
  }

  private buildAddressForm(){
    this.addressForm = this.formBuilder.group({
      addressType:[''],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      zip: [''],
      country: [''],
      effectiveDate:['']
    });
  }
  private buildAddressValidationForm() {
    this.selectedAddressForm = new FormGroup({
      chosenAddress: new FormControl('', Validators.required),
    });
  }
  private validateForm(){
    this.resetValidators();
    this.addressForm.markAllAsTouched();
    this.addressForm.updateValueAndValidity();
    this.addressForm.controls["addressType"].setValidators([Validators.required]);
    this.addressForm.controls["addressType"].updateValueAndValidity();
    let addressType = this.addressForm.controls["addressType"].value;
   if(addressType ==='H' || addressType === 'M'){
      this.addressForm.controls["address1"].setValidators([Validators.required]);
      this.addressForm.controls["address1"].updateValueAndValidity();
      this.addressForm.controls["zip"].setValidators([Validators.required]);
      this.addressForm.controls["zip"].updateValueAndValidity();
   }
   if(addressType ==='H' || addressType === 'M' || addressType === 'U'){
      this.addressForm.controls["city"].setValidators([Validators.required]);
      this.addressForm.controls["city"].updateValueAndValidity();
      this.addressForm.controls["effectiveDate"].setValidators([Validators.required]);
      this.addressForm.controls["effectiveDate"].updateValueAndValidity();
   }
   if(addressType === 'M'){
    this.addressForm.controls["state"].setValidators([Validators.required]);
      this.addressForm.controls["state"].updateValueAndValidity();
   }
   if(addressType ==='H' || addressType === 'U'){
    this.addressForm.controls["country"].setValidators([Validators.required]);
      this.addressForm.controls["country"].updateValueAndValidity();
   }


  }
  private populateModel(){
    this.clientAddress =  {
      address1: this.addressForm?.controls['address1']?.value,
      address2: this.addressForm?.controls['address2']?.value,
      city: this.addressForm?.controls['city']?.value,
      state: this.addressForm?.controls['state']?.value,
      county: this.addressForm?.controls['country']?.value,
      zip: this.addressForm?.controls['zip']?.value,
      addressTypeCode: this.addressForm?.controls['addressType']?.value,
      clientId:this.clientId,
      startDate:  new Date(this.intl.formatDate(this.addressForm?.controls['effectiveDate'].value, this.dateFormat))
      
    }
  }
  private resetValidators() {
    Object.keys(this.addressForm.controls).forEach((key: string) => {     
        this.addressForm.controls[key].removeValidators(Validators.required);
        this.addressForm.controls[key].updateValueAndValidity();         
    });
  }
  private resetData() {
    Object.keys(this.addressForm.controls).forEach((key: string) => {  
       
        if(key !== 'addressType'){          
          this.addressForm.controls[key].setValue('');
        }   
    });
  }
  private disableAllFields(){
    this.addressForm.controls["address1"].disable();
    this.addressForm.controls["address2"].disable();
    this.addressForm.controls["city"].disable();
    this.addressForm.controls["state"].disable();
    this.addressForm.controls["zip"].disable();
    this.addressForm.controls["country"].disable();
    this.addressForm.controls["effectiveDate"].disable();
  }
  private bindModelToForm(address:any){
    this.address = address;
    this.addressForm.controls["addressType"].setValue(address.addressTypeCode);
    this.addressForm.controls["address1"].setValue(address.address1);
    this.addressForm.controls["address2"].setValue(address.address2);
    this.addressForm.controls["city"].setValue(address.city);
    this.addressForm.controls["zip"].setValue(address.zip);
    this.addressForm.controls["effectiveDate"].setValue(address.startDate);
    this.onDdlAddressTypeValueChange(address.addressTypeCode);
    this.addressForm.markAllAsTouched();
    this.cd.detectChanges();
  }
  /** Internal event methods **/
  onDeactivateAddressClosed() {
    this.isDeactivateAddressPopup = false;
  }

  onDeactivateClicked() {
    this.isDeactivateValue = true;
    this.isDeactivateAddressPopup = true;
  }
  onAddressValidationCloseClicked(val:boolean) { 
    this.contactFacade.editAddressSubject.next(val);
    this.closeValidationPopup();
  }

  
  validateEffectiveDate(event: Event) {
    this.effectiveDateValidator = false;
    const effectiveDate = this.addressForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    if (effectiveDate > todayDate) {
      this.effectiveDateValidator = true;
    }
  }
  private closeValidationPopup() {
      this.addressValidationPopupVisibility$.next(false);  
      this.selectedAddressForm.reset();
  }
  onUseSelectedAddressClicked() {
    this.contactFacade.editAddressSubject.next(false);
    this.selectedAddressForm.markAllAsTouched();
    if (this.selectedAddressForm.valid) {
      if (this.selectedAddressForm.controls['chosenAddress']?.value === 'addressSuggested') {
        this.setAddress(this.addressSuggested);
      }
      this.closeValidationPopup();
    }
  }
  private setAddress(address: MailAddress | undefined) {
    if (!address) return;    
    this.addressForm.controls['address1'].setValue(address?.address1 == '' ? address?.address2 : address?.address1);
    this.addressForm.controls['address2'].setValue(address?.address1 == '' ? '' : address?.address2);
    this.addressForm.controls['city'].setValue(address?.city);
    this.addressForm.controls['state'].setValue(address?.state);
    this.addressForm.controls['zip'].setValue(address?.zip5);   
  }

  validateAddress(isNoPopup: boolean = false) {
    this.addressEntered = {
      address1: this.addressForm?.controls['address1']?.value ?? '',
      address2: this.addressForm?.controls['address2']?.value ?? '',
      city: this.addressForm?.controls['city']?.value ?? '',
      state: this.addressForm?.controls['state']?.value ?? '',
      zip5: this.addressForm?.controls['zip']?.value ?? ''
    }
     if(this.addressForm?.controls['address1'].value !== '' &&
     this.addressForm?.controls['city'].value !== '' &&
     this.addressForm?.controls['zip'].value !== '' ){
      this.showAddressValidationLoader$.next(true);
      this.uspsHomeAddressValidation(isNoPopup,  this.addressEntered);
     }
  }

  private uspsHomeAddressValidation(isNoPopup: boolean, changedHomeAddress: MailAddress){
    this.addressValidationFacade.validate(changedHomeAddress).subscribe({
      next: (validationResp: AddressValidation | null) => {
        this.showAddressValidationLoader$.next(false);
        if (validationResp?.isValid ?? false) {
           this.addressSuggested = validationResp?.address;
           this.addressIsValid = true;
        }
        else {
          this.addressIsValid = false;
        }
        if (!isNoPopup) {
          this.addressValidationPopupVisibility$.next(true);
        }
      },
      error: (err: any) => {
        this.showAddressValidationLoader$.next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
      }
    })
  }

  closePopup(){
    this.contactFacade.showAddPopupSubject.next(false);
  }
  onDdlAddressTypeValueChange(event: any) {
    this.resetValidators();
    if(!this.isEditValue){ this.resetData(); }
    switch (event) {
      case 'U':
        this.addressForm.controls["address1"].disable();
        this.addressForm.controls["address2"].disable();
        this.addressForm.controls["city"].enable();
        this.addressForm.controls["state"].enable();
        this.addressForm.controls["state"].setValue('OR');
        this.addressForm.controls["zip"].disable();
        this.addressForm.controls["country"].enable();
        this.addressForm.controls["effectiveDate"].enable();
        break;
      case 'H':
        this.addressForm.controls["address1"].enable();
        this.addressForm.controls["address2"].enable();
        this.addressForm.controls["city"].enable();
        this.addressForm.controls["state"].enable();
        this.addressForm.controls["state"].setValue('OR');
        this.addressForm.controls["zip"].enable();
        this.addressForm.controls["country"].enable();
        this.addressForm.controls["effectiveDate"].enable();
        break;
      case 'M':
        this.addressForm.controls["address1"].enable();
        this.addressForm.controls["address2"].enable();
        this.addressForm.controls["city"].enable();
        this.addressForm.controls["state"].enable();
        this.addressForm.controls["state"].setValue('');
        this.addressForm.controls["zip"].enable();
        this.addressForm.controls["country"].disable();
        this.addressForm.controls["effectiveDate"].enable();
        break;

    }
  }
  createAddress() {    
    this.validateForm();
    this.populateModel();
    let editAddress = false;
    this.contactFacade.editAddress$.subscribe(edit=>{
      editAddress = edit;
    })
    if(editAddress){this.validateAddress();}
    if (this.addressForm.valid && !editAddress) {
      this.loaderService.show();
      return this.contactFacade.createAddress(this.clientId ?? 0, this.caseEligibilityId ?? '', this.clientAddress).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.contactFacade.showAddPopupSubject.next(false);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Client Address Saved Successfully")
        },
        error:(error)=>{
           this.loaderService.hide();
        }
      })     
    }
    return of(false);
  }
}
