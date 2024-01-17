/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,OnDestroy,ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import {  FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
/** External Libraries **/
import {  BehaviorSubject, of, Subscription } from 'rxjs';

/** Internal Libraries **/
import { ContactFacade, StatesInUSA, ClientAddress  } from '@cms/case-management/domain';
import { LovFacade,MailAddress,AddressValidationFacade, AddressValidation } from '@cms/system-config/domain';
import { UIFormStyle, IntlDateService } from '@cms/shared/ui-tpa'
import { SnackBarNotificationType,NotificationSnackbarService, ConfigurationProvider, LoaderService, LoggingService} from '@cms/shared/util-core';
import {AddressType, StatusFlag} from '@cms/shared/ui-common'
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
  @Input() showFormFields!:boolean;
  @Input() deactivateFlag!:boolean;
  @Input() deleteFlag!:boolean;
  @Input() clientAddressId!:any;
  @Input() selectedAddress!:any;


  @Output() detailModalCloseEvent= new EventEmitter<any>();
  @Output() deactivateButtonClick= new EventEmitter<any>();
  /** Public properties **/
  ddlCountries$ = this.contactFacade.ddlCountries$;
  ddlStates$ = this.contactFacade.ddlStates$;
  ddlAddressTypes$ = this.lovFacade.addressType$;
  editedAddress$ = this.contactFacade.editedAddress$;
  editedAddressSubscription!:Subscription;
  stateSubscription!:Subscription;
  countySubscription!:Subscription;
  isDeactivateValue!: boolean;
  isDeactivateAddressPopup = true;
  isAddressLine1Disabled = true;
  isAddressLine2Disabled = true;
  isZIPDisabled = true;
  isCityDisabled = true;
  isStateDisabled = true;
  isCountyDisabled = true;
  isEffectiveDateDisabled = true;
  addressIsValid=true
  addressForm!:FormGroup;
  selectedAddressForm!:FormGroup;
  showCountyLoader = this.contactFacade.showloaderOnCounty$;
  showStateLoader = this.contactFacade.showLoaderOnState$;
  showAddressTypeLoader = this.lovFacade.showLoaderOnAddressType$;
  effectiveDateValidator:boolean= true;
  address!:any;
  addressValidationPopupVisibility$ = new BehaviorSubject(false);
  showAddressValidationLoader$= new BehaviorSubject(false);
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  addressEntered: MailAddress | undefined;
  addressSuggested: MailAddress | undefined;
  clientAddress!: ClientAddress ;
  addressType!:string;
  editAddressTypeText:string='';

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade,
    private readonly formBuilder: FormBuilder, private readonly lovFacade: LovFacade,
    private readonly addressValidationFacade: AddressValidationFacade,
    private readonly snackbarService: NotificationSnackbarService,
    public readonly intl: IntlDateService,private readonly configurationProvider: ConfigurationProvider,
    private loaderService: LoaderService,private readonly cd: ChangeDetectorRef,
    private readonly loggingService: LoggingService) {}

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
    if(!this.isEditValue){this.address =null;}
    if(this.showFormFields){
      this.onDdlAddressTypeValueChange('M');
    }

  }
  ngOnDestroy(): void {
    this.editedAddressSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
    this.countySubscription.unsubscribe();
  }
  /** Private methods **/
  private pageSubscription(){
    this.editedAddressSubscription =  this.editedAddress$.subscribe(address=>{
      this.bindModelToForm(address);
    });
    this.stateSubscription = this.ddlStates$.subscribe(state=>{
      if(this.isEditValue){
        this.addressForm.controls["state"].setValue(this.address?.state);
      }
    });
    this.countySubscription = this.  ddlCountries$.subscribe(county=>{
      this.addressForm.controls["county"].setValue(this.address?.county);
    })
  }
   private loadDdlStates() {
    this.contactFacade.showLoaderOnState.next(true);
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
      this.isCountyDisabled = true;
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
      county: [''],
      effectiveDate:[''],
      sameAsMailingAddress:['']
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
   if(addressType ===AddressType.Home || addressType === AddressType.Mailing){
      this.addressForm.controls["address1"].setValidators([Validators.required]);
      this.addressForm.controls["address1"].updateValueAndValidity();
     this.addressForm.controls["zip"].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 -]+$')]);
      this.addressForm.controls["zip"].updateValueAndValidity();
      this.addressForm.controls["state"].setValidators([Validators.required]);
      this.addressForm.controls["state"].updateValueAndValidity();
   }
   if(addressType === AddressType.Home || addressType === AddressType.Mailing || addressType === AddressType.UnHoused){
      this.addressForm.controls["city"].setValidators([Validators.required]);
      this.addressForm.controls["city"].updateValueAndValidity();
      if(!this.isEditValue){
        this.addressForm.controls["effectiveDate"].setValidators([Validators.required]);
        this.addressForm.controls["effectiveDate"].updateValueAndValidity();
      }
   }
   if((addressType === AddressType.Home || addressType === AddressType.UnHoused) && !this.isEditValue){
      this.addressForm.controls["county"].setValidators([Validators.required]);
      this.addressForm.controls["county"].updateValueAndValidity();
      if( this.addressForm.controls["state"].value !== 'OR'){
        this.addressForm.controls['state'].setErrors({ 'incorrect': true });
      }
   }


  }
  private populateModel(){
    this.clientAddress = {
      address1: this.addressForm?.controls['address1']?.value,
      address2: this.addressForm?.controls['address2']?.value,
      city: this.addressForm?.controls['city']?.value,
      state: this.addressForm?.controls['state']?.value,
      county: this.addressForm?.controls['county']?.value,
      zip: this.addressForm?.controls['zip']?.value,
      addressTypeCode: this.addressForm?.controls['addressType']?.value,
      clientId: this.clientId,
      startDate: new Date(this.intl.formatDate(this.addressForm?.controls['effectiveDate'].value, this.dateFormat)),
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
    this.addressForm.controls["county"].disable();
    this.addressForm.controls["effectiveDate"].disable();
  }
  private bindModelToForm(address:any){
    this.editAddressTypeText =address?.addressTypeDesc.toLowerCase()
    this.address = address;
    this.addressForm.controls["addressType"].setValue(address.addressTypeCode);
    this.addressForm.controls["address1"].setValue(address.address1);
    this.addressForm.controls["address2"].setValue(address.address2);
    this.addressForm.controls["city"].setValue(address.city);
    this.addressForm.controls["zip"].setValue(address.zip);
    this.addressForm.controls["effectiveDate"].setValue(address.startDate);
    this.addressForm.controls["sameAsMailingAddress"].setValue(address.sameAsMailingAddressFlag === StatusFlag.Yes?true:false);
    this.onDdlAddressTypeValueChange(address.addressTypeCode);
    this.addressForm.markAllAsTouched();
    this.cd.detectChanges();
  }
  /** Internal event methods **/
  onDeactivateAddressClosed() {
    this.isDeactivateAddressPopup = false;
  }

  onDeactivateClicked() {
    this.deactivateButtonClick.emit(true)
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
    this.addressType =  this.addressForm.controls["addressType"].value;
    this.resetValidators();
    if(!this.isEditValue){ this.resetData(); }
    switch (event) {
      case 'U':
        this.addressForm.controls["address1"].disable();
        this.addressForm.controls["address2"].disable();
        this.addressForm.controls["city"].enable();
        this.addressForm.controls["state"].enable();
        this.addressForm.controls["state"].setValue('OR');
        this.addressForm.controls["state"].disable();
        this.addressForm.controls["zip"].disable();
        this.addressForm.controls["county"].enable();
        this.addressForm.controls["county"].patchValue(null);
        this.addressForm.controls["effectiveDate"].enable();
        break;
      case 'H':
        this.addressForm.controls["address1"].enable();
        this.addressForm.controls["address2"].enable();
        this.addressForm.controls["city"].enable();
        this.addressForm.controls["state"].enable();
        this.addressForm.controls["state"].setValue('OR');
        this.addressForm.controls["zip"].enable();
        this.addressForm.controls["county"].enable();
        this.addressForm.controls["county"].patchValue(null);
        this.addressForm.controls["effectiveDate"].enable();
        break;
      case 'M':
        this.addressForm.controls["address1"].enable();
        this.addressForm.controls["address2"].enable();
        this.addressForm.controls["city"].enable();
        this.addressForm.controls["state"].enable();
        this.addressForm.controls["state"].setValue(null);
        this.addressForm.controls["zip"].enable();
        this.addressForm.controls["county"].disable();
        this.addressForm.controls["county"].patchValue(null);
        this.addressForm.controls["effectiveDate"].enable();
        break;
    }
    this.cd.detectChanges();
  }
  createAddress() {
    this.validateForm();
    this.populateModel();
    let editAddress = false;
    this.contactFacade.editAddress$.subscribe(edit=>{
      editAddress = edit;
    })
    if(editAddress){this.validateAddress();}
    if (this.addressForm.valid && !editAddress)
    {
      this.loaderService.show();
      if(!this.isEditValue){
      return this.contactFacade.createAddress(this.clientId ?? 0, this.caseEligibilityId ?? '', this.clientAddress).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.detailModalCloseEvent.emit(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Client Address Saved Successfully.")
        },
        error:(error)=>{
          this.loggingService.logException(error);
           this.loaderService.hide();
        }
      });
    }
    else{
      this.clientAddress.clientAddressId = this.address.clientAddressId;
      this.clientAddress.concurrencyStamp = this.address.concurrencyStamp;
      this.clientAddress.activeFlag = StatusFlag.Yes
      this.clientAddress.sameAsMailingAddressFlag = this.addressForm?.controls['sameAsMailingAddress']?.value?StatusFlag.Yes:StatusFlag.No;
      return this.contactFacade.updateAddress(this.clientId ?? 0, this.caseEligibilityId ?? '', this.clientAddress).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.detailModalCloseEvent.emit(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Client Address Updated Successfully.")
        },
        error:(error)=>{
          this.loggingService.logException(error);
           this.loaderService.hide();
        }
      });
    }

    }
    return of(false);
  }

  deactivateAndAdd(){
    this.addressForm.controls["addressType"].setValue(AddressType.Mailing);
    this.addressForm.controls["effectiveDate"].setValue(new Date());
    this.validateForm();
    this.populateModel();
    if (this.clientAddress && this.addressForm.valid) {
      this.selectedAddress.activeFlag=StatusFlag.No;
      this.selectedAddress.endDate= new Date();
      this.contactFacade.showLoader();
      this.contactFacade.updateAddress(this.clientId ?? 0, this.caseEligibilityId ?? '', this.selectedAddress).subscribe({
        next: (response: any) => {
          if(response){
            this.contactFacade.hideLoader();
            this.createNewMailingAddress();
          }
        },
        error: (error: any) => {
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
        }
      })
    }
  }

  deleteAndAdd(){
    this.addressForm.controls["addressType"].setValue(AddressType.Mailing);
    this.addressForm.controls["effectiveDate"].setValue(new Date());
    this.validateForm();
    this.populateModel();
    if (this.clientAddress && this.addressForm.valid) {
      this.contactFacade.showLoader();
      this.contactFacade.deleteClientAddress(this.clientId, this.clientAddressId).subscribe({
        next: (response: any) => {
          if(response){
            this.contactFacade.hideLoader();
            this.createNewMailingAddress();
          }
        },
        error: (error: any) => {
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
        }
      })
    }
  }

  createNewMailingAddress(){
    this.loaderService.show();
      this.contactFacade.createAddress(this.clientId ?? 0, this.caseEligibilityId ?? '', this.clientAddress).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.detailModalCloseEvent.emit(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Client Address Saved Successfully.")
        },
        error:(error)=>{
          this.loggingService.logException(error);
           this.loaderService.hide();
        }
      });
  }
}
