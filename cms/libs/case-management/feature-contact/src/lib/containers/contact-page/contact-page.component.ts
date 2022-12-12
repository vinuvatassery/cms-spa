/** Angular **/
import { ElementRef, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
/** External Libraries **/
import { Subscription, of, mergeMap, forkJoin, distinctUntilChanged, startWith, pairwise, BehaviorSubject, filter, Observable } from 'rxjs';

/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, ContactFacade, NavigationType, ContactInfo, ClientAddress, AddressTypeCode, ClientPhone, deviceTypeCode, ClientEmail, FriedsOrFamilyContact, CompletionChecklist, ClientDocument } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { StatusFlag } from 'libs/case-management/domain/src/lib/enums/status-flag.enum';
import { AddressValidationFacade, MailAddress, AddressValidation, LovFacade } from '@cms/system-config/domain';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { LoaderService } from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'case-management-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})

export class ContactPageComponent implements OnInit, OnDestroy {

  public formUiStyle: UIFormStyle = new UIFormStyle();

  /** Public properties **/
  ddlStates$ = this.contactFacade.ddlStates$;
  ddlCountries$ = this.contactFacade.ddlCountries$;
  ddlRelationships$ = this.lovFacade.lovCntRelationship$;
  isNoHomePhoneChecked!: boolean;
  isNoCellPhoneChecked!: boolean;
  isNoWorkPhoneChecked!: boolean;
  isNoOtherPhoneChecked!: boolean;
  isNoEmailChecked = true;
  isNoProofOfHomeChecked!: boolean;
  isNoFriendsOrFamilyChecked!: boolean;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  contactInfoForm!: FormGroup;
  contactInfo!: ContactInfo;
  preferredContactMethods: string[] = [];
  isEdit = false;
  mailingAddressIsNotValid: boolean = false;
  homeAddressIsNotValid: boolean = false;
  mailAddressValidationPopupVisibility$ = new BehaviorSubject(false);
  homeAddressValidationPopupVisibility$ = new BehaviorSubject(false);
  mailAddressEntered: MailAddress | undefined;
  mailAddressSuggested: MailAddress | undefined;
  homeAddressEntered: MailAddress | undefined;
  homeAddressSuggested: MailAddress | undefined;
  selectedAddressForm!: FormGroup;
  isSkipMailAddressValidation: boolean = false;
  isSkipHomeAddressValidation: boolean = false;
  isHomeAddressFirstLoads: boolean = false;
  uploadedHomeAddressProof!: File | undefined;
  fileUploadRestrictions: FileRestrictions = {
    maxFileSize: 25000000,
  };
  showCountyLoader: boolean = false;

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private currentSessionSubscription !: Subscription;

  constructor(
    private readonly contactFacade: ContactFacade,
    private readonly completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly addressValidationFacade: AddressValidationFacade,
    private readonly lovFacade: LovFacade,
    private readonly elementRef: ElementRef,
    private readonly loaderService: LoaderService,
    private route: ActivatedRoute
  ) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadCurrentSession();
    this.loadDdlRelationships();
    this.loadDdlStates();
    this.buildContactInfoForm();
    this.buildAddressvalidationForm();
    this.addSubscriptions();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.currentSessionSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));      
    });   
  }

  /** Private methods **/

  private addSubscriptions() {
    this.addSaveSubscription();
    this.addContactInfoFormChangeSubscription();
    this.addMailingAddressChangeSubscription();
    this.addHomeAddressChangeSubscription();
    this.sameAsMailingAddressChangeSubscription();
    this.homelessFlagChangeSubscription();
    this.addStateChangesubscription();
    this.homePhoneApplicableFlagChangeSubscription();
    this.cellPhoneApplicableFlagChangeSubscription();
    this.workPhoneApplicableFlagChangeSubscription();
    this.otherPhoneApplicableFlagChangeSubscription();
    this.emailApplicableFlagChangeSubscription();
    this.noFriendsOrFamilyChangeSubscription();
    this.contactRelationshipChangeSubscription();
  }

  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$.subscribe((resp) => {
      if(resp){
        this.loadContactInfo();
      }
    });
  }

  private buildAddressvalidationForm() {
    this.selectedAddressForm = new FormGroup({
      choosenAddress: new FormControl('', Validators.required),
    });
  }

  private adjustAttributeChanged(event: Event) {
    const data: CompletionChecklist = {
      dataPointName: (event.target as HTMLInputElement).name,
      status: (event.target as HTMLInputElement).checked ? StatusFlag.Yes : StatusFlag.No
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
  }

  private adjustAttributeInit(){
    const initialAjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {     
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };

      initialAjustment.push(data);
    });

    if (initialAjustment.length > 0) {
      this.workflowFacade.updateBasedOnDtAttrChecklist(initialAjustment);
    }
  }

  private loadDdlRelationships() {
    this.lovFacade.getContactRelationShipsLovs();
  }

  private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }

  private loadDdlCountries(stateCode: string) {
    this.showCountyLoader = true;
    this.contactFacade.loadDdlCountries(stateCode);
    this.showCountyLoader = false;
  }

  private addContactInfoFormChangeSubscription() {
    this.contactInfoForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(null), pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
        if (prev) {
          if (prev['homePhone']['phoneNbr'] !== curr['homePhone']['phoneNbr']
            || prev['cellPhone']['phoneNbr'] !== curr['cellPhone']['phoneNbr']
            || prev['workPhone']['phoneNbr'] !== curr['workPhone']['phoneNbr']
            || prev['otherPhone']['phoneNbr'] !== curr['otherPhone']['phoneNbr']
            || prev['email']['email'] !== curr['email']['email']) {
            this.loadPreferredContactMethod();
          }
        }
      });
  }

  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.contactInfoForm.controls).forEach(groupkey => {
      if (prev && curr) {
        if (prev[groupkey] !== curr[groupkey]) {
          Object.keys((this.contactInfoForm?.get(`${groupkey}`) as FormGroup)?.controls).forEach(key => {
            if (prev[groupkey][key] !== curr[groupkey][key]) {
              let item: CompletionChecklist = {
                dataPointName: `${groupkey}_${key}`,
                status: curr[groupkey][key] ? StatusFlag.Yes : StatusFlag.No
              };
              completedDataPoints.push(item);
            }
          });
        }
      }
      else {
        Object.keys((this.contactInfoForm?.get(`${groupkey}`) as FormGroup)?.controls).forEach(key => {
          if (this.contactInfoForm?.get(`${groupkey}.${key}`)?.value && this.contactInfoForm?.get(`${groupkey}.${key}`)?.valid) {
            let item: CompletionChecklist = {
              dataPointName: `${groupkey}_${key}`,
              status: StatusFlag.Yes
            };
            completedDataPoints.push(item);
          }
        });
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private loadPreferredContactMethod() {
    const preferredContact: string[] = [];
    const homePhone = (this.contactInfoForm.get('homePhone') as FormGroup)?.controls['phoneNbr'];
    const cellPhone = (this.contactInfoForm.get('cellPhone') as FormGroup)?.controls['phoneNbr'];
    const workPhone = (this.contactInfoForm.get('workPhone') as FormGroup)?.controls['phoneNbr'];
    const otherPhone = (this.contactInfoForm.get('otherPhone') as FormGroup)?.controls['phoneNbr'];
    const email = (this.contactInfoForm.get('email') as FormGroup)?.controls['email'];
    const homePhoneIsNotApplicable = (this.contactInfoForm.get('homePhone') as FormGroup)?.controls['applicableFlag']?.value ?? false;
    const cellPhoneIsNotApplicable = (this.contactInfoForm.get('cellPhone') as FormGroup)?.controls['applicableFlag']?.value ?? false;
    const workPhoneIsNotApplicable = (this.contactInfoForm.get('workPhone') as FormGroup)?.controls['applicableFlag']?.value ?? false
    const otherPhoneIsNotApplicable = (this.contactInfoForm.get('otherPhone') as FormGroup)?.controls['applicableFlag']?.value ?? false;
    const emailIsNotApplicable = (this.contactInfoForm.get('email') as FormGroup)?.controls['applicableFlag']?.value ?? false;


    if (homePhone?.value && homePhone.valid && !homePhoneIsNotApplicable) {
      preferredContact.push(homePhone?.value);
    }
    if (cellPhone?.value && cellPhone.valid && !cellPhoneIsNotApplicable) {
      preferredContact.push(cellPhone?.value);
    }
    if (workPhone?.value && workPhone.valid && !workPhoneIsNotApplicable) {
      preferredContact.push(workPhone?.value);
    }
    if (otherPhone?.value && otherPhone.valid && !otherPhoneIsNotApplicable) {
      preferredContact.push(otherPhone?.value);
    }
    if (email?.value && email.valid && !emailIsNotApplicable) {
      preferredContact.push(email?.value);
    }
    this.preferredContactMethods = preferredContact;

    if (this.preferredContactMethods.length > 0) {
      this.contactInfoForm?.get('email.preferredContactMethod')?.setValidators(Validators.required);
      this.contactInfoForm?.get('email.preferredContactMethod')?.updateValueAndValidity();
      const selectPreferredCode = this.contactInfoForm?.get('email.preferredContactMethod')?.value;
      if (!this.preferredContactMethods?.includes(selectPreferredCode)) {
        this.contactInfoForm?.get('email.preferredContactMethod')?.reset();
      }
    }
    else {
      this.contactInfoForm?.get('email.preferredContactMethod')?.removeValidators(Validators.required);
      this.contactInfoForm?.get('email.preferredContactMethod')?.reset();
    }
  }

  private buildContactInfoForm() {
    this.contactInfoForm = new FormGroup({
      maillingAddress: new FormGroup({
        address1: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        address2: new FormControl('', { updateOn: 'blur' }),
        city: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        state: new FormControl('OR', { validators: Validators.required, updateOn: 'blur' }),
        zip: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      homeAddress: new FormGroup({
        address1: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        address2: new FormControl('', { updateOn: 'blur' }),
        city: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        state: new FormControl('OR', { validators: Validators.required, updateOn: 'blur' }),
        zip: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9]{5}(-[0-9]{4})?$')], updateOn: 'blur' }),
        county: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        homelessFlag: new FormControl(false, { validators: Validators.required }),
        noHomeAddressProofFlag: new FormControl(false, { validators: Validators.required, updateOn: 'blur' }),
        sameAsMailingAddressFlag: new FormControl(false, { validators: Validators.required }),
        housingStabilityCode: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      homePhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]+')], updateOn: 'blur' }),
        applicableFlag: new FormControl(''),
        detailMsgConsentFlag: new FormControl('', { updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { updateOn: 'blur' }),
      }),
      cellPhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]+')], updateOn: 'blur' }),
        applicableFlag: new FormControl(''),
        detailMsgConsentFlag: new FormControl('', { updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { updateOn: 'blur' }),
      }),
      workPhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]+')], updateOn: 'blur' }),
        applicableFlag: new FormControl(''),
        detailMsgConsentFlag: new FormControl('', { updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { updateOn: 'blur' }),
      }),
      otherPhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]+')], updateOn: 'blur' }),
        otherPhoneNote: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        applicableFlag: new FormControl(''),
        detailMsgConsentFlag: new FormControl('', { updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { updateOn: 'blur' }),
      }),
      email: new FormGroup({
        email: new FormControl('', { validators: [Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,20}')], updateOn: 'blur' }),
        applicableFlag: new FormControl(''),
        detailMsgFlag: new FormControl('', { updateOn: 'blur' }),
        goPapperlessFlag: new FormControl('', { updateOn: 'blur' }),
        preferredContactMethod: new FormControl('', { updateOn: 'blur' }),
      }),
      familyAndFriendsContact: new FormGroup({
        noFriendOrFamilyContactFlag: new FormControl(''),
        contactName: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        contactRelationshipCode: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        otherDesc: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        contactPhoneNbr: new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]+')], updateOn: 'blur' }),
      }),
    });
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
        this.loaderService.hide();
      }
    });
  }

  private save() {
    this.contactInfoForm.markAllAsTouched();
    if (this.contactInfoForm.valid) {
      this.loaderService.show();
      return this.saveContactInfo();
    }

    return of(false)
  }

  addMailingAddressChangeSubscription() {
    (this.contactInfoForm.get('maillingAddress') as FormGroup).valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        mergeMap(([prev, curr]: [any, any]) =>
          forkJoin([of(prev), of(curr), this.validateMailAddress(prev, curr, AddressTypeCode.Mail)]))
      ).subscribe(([prev, curr, validationResp]: [any, any, AddressValidation | null]) => {
        this.isSkipMailAddressValidation = false;
        if (validationResp) {
          if (prev != null) {
            this.mailAddressValidationPopupVisibility$.next(true);
          }
          if (validationResp?.isValid ?? false) {
            this.mailAddressSuggested = validationResp?.address;
            this.mailingAddressIsNotValid = false;
          }
          else {
            this.mailingAddressIsNotValid = true;
          }
        }

        if (this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.value ?? false) {
          this.setSameAsMailingAddressFlagChanges(true);
        }
      });
  }

  addHomeAddressChangeSubscription() {
    (this.contactInfoForm.get('homeAddress') as FormGroup).valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        filter(([prev, curr]: [any, any]) =>
          curr['homelessFlag'] !== true
          && curr['sameAsMailingAddressFlag'] !== true
          && curr['address1'] && curr['city'] && curr['state'] && curr['zip']
          && (prev == null
            || (prev['address1'] !== curr['address1'] || prev['address2'] !== curr['address2']
              || prev['city'] !== curr['city'] || prev['state'] !== curr['state']
              || prev['zip'] !== curr['zip']))
        ),
        mergeMap(([prev, curr]: [any, any]) =>
          forkJoin([of(prev), of(curr), this.validateMailAddress(prev, curr, AddressTypeCode.Home)]))
      ).subscribe(([prev, curr, response]: [any, any, AddressValidation | null]) => {
        this.isSkipHomeAddressValidation = false;
        if (response) {
          if (prev != null && !this.isHomeAddressFirstLoads) {
            this.homeAddressValidationPopupVisibility$.next(true);
          }
          if (response?.isValid ?? false) {
            this.homeAddressSuggested = response?.address;
            this.homeAddressIsNotValid = false;
          }
          else {
            this.homeAddressIsNotValid = true;
          }
          this.isHomeAddressFirstLoads = false;
        }
      });
  }

  validateMailAddress(prev: any, curr: any, type: AddressTypeCode) {
    if (curr['address1'] && curr['city'] && curr['state'] && curr['zip']
      && ((!this.isSkipMailAddressValidation && type === AddressTypeCode.Mail) || (!this.isSkipHomeAddressValidation && type === AddressTypeCode.Home))
      && (prev == null
        || (prev['address1'] !== curr['address1'] || prev['address2'] !== curr['address2']
          || prev['city'] !== curr['city'] || prev['state'] !== curr['state']
          || prev['zip'] !== curr['zip']))) {
      const address: MailAddress = {
        address1: curr['address1'],
        address2: curr['address2'],
        city: curr['city'],
        state: curr['state'],
        zip5: curr['zip']
      };

      if (type == AddressTypeCode.Mail) { this.mailAddressEntered = address; }
      else if (type == AddressTypeCode.Home) { this.homeAddressEntered = address; }

      return this.addressValidationFacade.validate(address);
    }

    return of(null);
  }

  private saveContactInfo() {
    const contactInfoData: ContactInfo = {};
    const homeAddressGroup = this.contactInfoForm?.get('homeAddress') as FormGroup;
    const homeAddress: ClientAddress = {
      address1: homeAddressGroup?.controls['address1']?.value,
      address2: homeAddressGroup?.controls['address2']?.value,
      city: homeAddressGroup?.controls['city']?.value,
      state: homeAddressGroup?.controls['state']?.value,
      county: homeAddressGroup?.controls['county']?.value,
      zip: homeAddressGroup?.controls['zip']?.value,
      addressTypeCode: AddressTypeCode.Home,
      sameAsMailingAddressFlag: this.getFlag(homeAddressGroup?.controls['sameAsMailingAddressFlag']?.value),
    }
    const maillingAddressGroup = this.contactInfoForm.get('maillingAddress') as FormGroup;
    const maillingAddress: ClientAddress = {
      address1: maillingAddressGroup?.controls['address1']?.value,
      address2: maillingAddressGroup?.controls['address2']?.value,
      city: maillingAddressGroup?.controls['city']?.value,
      state: maillingAddressGroup?.controls['state']?.value,
      zip: maillingAddressGroup?.controls['zip']?.value,
      addressTypeCode: AddressTypeCode.Mail,
    }
    const homePhoneGroup = this.contactInfoForm.get('homePhone') as FormGroup;
    const homePhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.HomePhone,
      applicableFlag: this.getFlag(homePhoneGroup.controls['applicableFlag']?.value),
      phoneNbr: homePhoneGroup.controls['phoneNbr']?.value,
      detailMsgConsentFlag: this.getFlag(homePhoneGroup.controls['detailMsgConsentFlag']?.value),
      smsTextConsentFlag: this.getFlag(homePhoneGroup.controls['smsTextConsentFlag']?.value),
    }

    const cellPhoneGroup = this.contactInfoForm.get('cellPhone') as FormGroup;
    const cellPhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.CellPhone,
      applicableFlag: this.getFlag(cellPhoneGroup.controls['applicableFlag']?.value),
      phoneNbr: cellPhoneGroup.controls['phoneNbr']?.value,
      detailMsgConsentFlag: this.getFlag(cellPhoneGroup.controls['detailMsgConsentFlag']?.value),
      smsTextConsentFlag: this.getFlag(cellPhoneGroup.controls['smsTextConsentFlag']?.value),
    }

    const workPhoneGroup = this.contactInfoForm.get('workPhone') as FormGroup;
    const workPhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.WorkPhone,
      applicableFlag: this.getFlag(workPhoneGroup.controls['applicableFlag']?.value),
      phoneNbr: workPhoneGroup.controls['phoneNbr']?.value,
      detailMsgConsentFlag: this.getFlag(workPhoneGroup.controls['detailMsgConsentFlag']?.value),
      smsTextConsentFlag: this.getFlag(workPhoneGroup.controls['smsTextConsentFlag']?.value),
    }

    const otherPhoneGroup = this.contactInfoForm.get('otherPhone') as FormGroup;
    const otherPhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.OtherPhone,
      applicableFlag: this.getFlag(otherPhoneGroup.controls['applicableFlag']?.value),
      phoneNbr: otherPhoneGroup.controls['phoneNbr']?.value,
      detailMsgConsentFlag: this.getFlag(otherPhoneGroup.controls['detailMsgConsentFlag']?.value),
      smsTextConsentFlag: this.getFlag(otherPhoneGroup.controls['smsTextConsentFlag']?.value),
      otherPhoneNote: otherPhoneGroup.controls['otherPhoneNote']?.value,
    }

    const emailGroup = this.contactInfoForm.get('email') as FormGroup;
    const email: ClientEmail = {
      email: emailGroup.controls['email']?.value,
      detailMsgFlag: this.getFlag(emailGroup.controls['detailMsgFlag']?.value),
      applicableFlag: this.getFlag(emailGroup.controls['applicableFlag']?.value),
    }

    const ffContactGroup = this.contactInfoForm.get('familyAndFriendsContact') as FormGroup;
    const friedsOrFamilyContact: FriedsOrFamilyContact = {
      noFriendOrFamilyContactFlag: this.getFlag(ffContactGroup.controls['noFriendOrFamilyContactFlag']?.value),
      contactName: ffContactGroup.controls['contactName']?.value,
      contactPhoneNbr: ffContactGroup.controls['contactPhoneNbr']?.value,
      contactRelationshipCode: ffContactGroup.controls['contactRelationshipCode']?.value,
      otherDesc: ffContactGroup.controls['otherDesc']?.value,
    }

    if (this.isEdit) {
      const homeAddress1 = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Home)[0];
      const mailingAddress1 = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Mail)[0];
      const homePhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.HomePhone)[0];
      const cellPhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.CellPhone)[0];
      const workPhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.WorkPhone)[0];
      const otherPhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.OtherPhone)[0];
      maillingAddress.clientAddressId = mailingAddress1?.clientAddressId;
      maillingAddress.concurrencyStamp = mailingAddress1?.concurrencyStamp;
      homeAddress.clientAddressId = homeAddress1?.clientAddressId;
      homeAddress.concurrencyStamp = homeAddress1?.concurrencyStamp;

      homeAddress.clientAddressId = homeAddress1?.clientAddressId;
      homeAddress.concurrencyStamp = homeAddress1?.concurrencyStamp;

      homePhone.clientPhoneId = homePhone1?.clientPhoneId;
      homePhone.concurrencyStamp = homePhone1?.concurrencyStamp;

      cellPhone.clientPhoneId = cellPhone1?.clientPhoneId;
      cellPhone.concurrencyStamp = cellPhone1?.concurrencyStamp;

      workPhone.clientPhoneId = workPhone1?.clientPhoneId;
      workPhone.concurrencyStamp = workPhone1?.concurrencyStamp;

      otherPhone.clientPhoneId = otherPhone1?.clientPhoneId;
      otherPhone.concurrencyStamp = otherPhone1?.concurrencyStamp;

      email.clientEmailId = this.contactInfo?.email?.clientEmailId;
      email.concurrencyStamp = this.contactInfo?.email?.concurrencyStamp;

      friedsOrFamilyContact.clientDependentId = this.contactInfo?.friedsOrFamilyContact?.clientDependentId;
      friedsOrFamilyContact.concurrencyStamp = this.contactInfo?.friedsOrFamilyContact?.concurrencyStamp;
      contactInfoData.elgbtyflagConcurrencyStamp = this.contactInfo?.elgbtyflagConcurrencyStamp;
      contactInfoData.elgbtyConcurrencyStamp = this.contactInfo?.elgbtyConcurrencyStamp;

    }

    contactInfoData.address = [maillingAddress, homeAddress];
    contactInfoData.phone = [homePhone, cellPhone, workPhone, otherPhone];
    contactInfoData.email = email;
    contactInfoData.friedsOrFamilyContact = friedsOrFamilyContact;
    contactInfoData.homelessFlag = this.getFlag(homeAddressGroup?.get('homelessFlag')?.value);
    contactInfoData.housingStabilityCode = homeAddressGroup?.get('housingStabilityCode')?.value;
    contactInfoData.papperlessFlag = this.getFlag(emailGroup?.get('papperlessFlag')?.value);
    contactInfoData.homeAddressProofFlag = this.getFlag(homeAddressGroup?.get('noHomeAddressProofFlag')?.value);
    contactInfoData.elgbtyflagConcurrencyStamp = this.contactInfo?.elgbtyflagConcurrencyStamp;
    const preferredContactCode = emailGroup.controls['preferredContactMethod']?.value;

    if (preferredContactCode === homePhone?.phoneNbr) {
      homePhone.preferredFlag = StatusFlag.Yes;
    }
    else if (preferredContactCode === cellPhone?.phoneNbr) {
      cellPhone.preferredFlag = StatusFlag.Yes;
    }
    else if (preferredContactCode === workPhone?.phoneNbr) {
      workPhone.preferredFlag = StatusFlag.Yes;
    }
    else if (preferredContactCode === otherPhone?.phoneNbr) {
      otherPhone.preferredFlag = StatusFlag.Yes;
    }
    else if (preferredContactCode === email?.email) {
      email.preferredFlag = StatusFlag.Yes;
    }


    if (this.isEdit) {
      return this.updateContactInfo(this.workflowFacade.clientId ?? 0, this.workflowFacade.clientCaseEligibilityId ?? '', contactInfoData);
    }
    return this.contactFacade.createContactInfo(this.workflowFacade.clientId ?? 0, this.workflowFacade.clientCaseEligibilityId ?? '', contactInfoData);
  }

  private updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfoData: ContactInfo) {
    return this.contactFacade.updateContactInfo(clientId, clientCaseEligibilityId, contactInfoData);
  }

  private getFlag(flag?: boolean) {
    return flag ? StatusFlag.Yes : StatusFlag.No;
  }

  private loadContactInfo() {
    this.contactFacade.loadContactInfo(this.workflowFacade.clientId ?? 0, this.workflowFacade.clientCaseEligibilityId ?? '').subscribe((data: ContactInfo) => {
      if (data) {
        this.isEdit = (data?.address && data?.address?.length > 0 && data?.phone && data?.phone?.length > 0) ?? false;
        this.contactInfo = data;
        this.setFormValues();
      }
    });
  }

  private setFormValues() {
    if (this.contactInfo) {
      const homeAddress = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Home)[0];
      const mailingAddress = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Mail)[0];
      const homePhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.HomePhone)[0];
      const cellPhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.CellPhone)[0];
      const workPhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.WorkPhone)[0];
      const otherPhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.OtherPhone)[0];
      if (homeAddress) {
        this.isHomeAddressFirstLoads = true;
        this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.patchValue(homeAddress?.sameAsMailingAddressFlag === StatusFlag.Yes);
        this.contactInfoForm.get('homeAddress.address1')?.patchValue(homeAddress?.address1);
        this.contactInfoForm.get('homeAddress.address2')?.patchValue(homeAddress?.address2);
        this.contactInfoForm.get('homeAddress.city')?.patchValue(homeAddress?.city);
        this.contactInfoForm.get('homeAddress.state')?.patchValue(homeAddress?.state);
        this.contactInfoForm.get('homeAddress.zip')?.patchValue(homeAddress?.zip);
        this.contactInfoForm.get('homeAddress.county')?.patchValue(homeAddress?.county);
        this.contactInfoForm?.get('homeAddress.homelessFlag')?.patchValue(this.contactInfo?.homelessFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.patchValue(this.contactInfo?.homeAddressProofFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('homeAddress.housingStabilityCode')?.patchValue(this.contactInfo?.housingStabilityCode);
      }
      if (mailingAddress) {
        this.contactInfoForm.get('maillingAddress')?.patchValue(mailingAddress);
      }

      if (homePhone) {
        this.contactInfoForm.get('homePhone.phoneNbr')?.patchValue(homePhone?.phoneNbr);
        this.contactInfoForm?.get('homePhone.applicableFlag')?.patchValue(homePhone?.applicableFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.patchValue(homePhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.patchValue(homePhone?.smsTextConsentFlag === StatusFlag.Yes);
      }

      if (cellPhone) {
        this.contactInfoForm.get('cellPhone.phoneNbr')?.patchValue(cellPhone?.phoneNbr);
        this.contactInfoForm?.get('cellPhone.applicableFlag')?.patchValue(cellPhone?.applicableFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.patchValue(cellPhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.patchValue(cellPhone?.smsTextConsentFlag === StatusFlag.Yes);
      }

      if (workPhone) {
        this.contactInfoForm.get('workPhone.phoneNbr')?.patchValue(workPhone?.phoneNbr);
        this.contactInfoForm?.get('workPhone.applicableFlag')?.patchValue(workPhone?.applicableFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.patchValue(workPhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.patchValue(workPhone?.smsTextConsentFlag === StatusFlag.Yes);
      }

      if (otherPhone) {
        this.contactInfoForm.get('otherPhone.phoneNbr')?.patchValue(otherPhone?.phoneNbr);
        this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.patchValue(otherPhone?.otherPhoneNote);
        this.contactInfoForm?.get('otherPhone.applicableFlag')?.patchValue(otherPhone?.applicableFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.patchValue(otherPhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.patchValue(otherPhone?.smsTextConsentFlag === StatusFlag.Yes);
      }


      this.contactInfoForm.get('email.email')?.patchValue(this.contactInfo?.email?.email);
      this.contactInfoForm?.get('email.applicableFlag')?.patchValue(this.contactInfo?.email?.applicableFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('email.detailMsgConsentFlag')?.patchValue(this.contactInfo?.email?.detailMsgFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('email.papperlessFlag')?.patchValue(this.contactInfo?.papperlessFlag === StatusFlag.Yes);
      //this.contactInfoForm?.get('email.preferredContactMethod')?.patchValue(this.contactInfo?.preferredContactCode);
      this.setPreferredContact(this.contactInfoForm.get('email.preferredContactMethod'),
        homePhone,
        cellPhone,
        workPhone,
        otherPhone,
        this.contactInfo?.email);


      this.contactInfoForm.get('familyAndFriendsContact')?.patchValue(this.contactInfo?.friedsOrFamilyContact);
      this.contactInfoForm.get('familyAndFriendsContact.noFriendOrFamilyContactFlag')?.patchValue(this.contactInfo?.friedsOrFamilyContact?.noFriendOrFamilyContactFlag === StatusFlag.Yes);
      this.adjustAttributeInit();
    }
  }

  private homePhoneApplicableFlagChangeSubscription() {
    (this.contactInfoForm.get('homePhone') as FormGroup)?.controls['applicableFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByHomePhoneNotApplicable(value);
    });
  }

  private cellPhoneApplicableFlagChangeSubscription() {
    (this.contactInfoForm.get('cellPhone') as FormGroup)?.controls['applicableFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByCellPhoneNotApplicable(value);
    });
  }

  private workPhoneApplicableFlagChangeSubscription() {
    (this.contactInfoForm.get('workPhone') as FormGroup)?.controls['applicableFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByWorkPhoneNotApplicable(value);
    });
  }

  private otherPhoneApplicableFlagChangeSubscription() {
    (this.contactInfoForm.get('otherPhone') as FormGroup)?.controls['applicableFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByOtherPhoneNotApplicable(value);
    });
  }

  private noFriendsOrFamilyChangeSubscription() {
    (this.contactInfoForm.get('familyAndFriendsContact') as FormGroup)?.controls['noFriendOrFamilyContactFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByNoFriendsOrFamily(value);
    });
  }

  private sameAsMailingAddressChangeSubscription() {
    //this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.valueChanges
    (this.contactInfoForm.get('homeAddress') as FormGroup)
    ?.controls['sameAsMailingAddressFlag']?.valueChanges
      .pipe(
        startWith(null),
        pairwise()
      ).subscribe(([prValue, curValue]: [boolean, boolean]) => {
        if ((prValue ?? false) !== curValue) {
          this.setSameAsMailingAddressFlagChanges(curValue);
        }
      });
  }

  private addStateChangesubscription() {
    (this.contactInfoForm.get('homeAddress') as FormGroup)?.controls['state']?.valueChanges.subscribe(value => {
      this.loadDdlCountries(value);
    })
  }

  private homelessFlagChangeSubscription() {
    this.contactInfoForm?.get('homeAddress.homelessFlag')?.valueChanges
      .subscribe((value: boolean) => {
        this.setVisibilityByHomelessFlag(value);
      });
  }

  private setVisibilityByNoEmailCheckbox(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('email.email')?.disable();
      this.contactInfoForm?.get('email.detailMsgFlag')?.disable();
      this.contactInfoForm?.get('email.detailMsgFlag')?.reset();
      this.contactInfoForm?.get('email.email')?.reset();
      this.loadPreferredContactMethod();
    }
    else {
      this.contactInfoForm?.get('email.email')?.enable();
      this.contactInfoForm?.get('email.detailMsgFlag')?.enable();
    }
  }

  private setVisibilityByNoHomeAddressProofFlag(isChecked: boolean) {
    this.isNoProofOfHomeChecked = isChecked;
  }

  private setVisibilityByHomePhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('homePhone.phoneNbr')?.disable();
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('homePhone.phoneNbr')?.reset();
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.reset();
      this.loadPreferredContactMethod();
    }
    else {
      this.contactInfoForm?.get('homePhone.phoneNbr')?.enable();
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.enable();
    }
  }

  private setVisibilityByCellPhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('cellPhone.phoneNbr')?.disable();
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('cellPhone.phoneNbr')?.reset();
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.reset();
      this.loadPreferredContactMethod();
    }
    else {
      this.contactInfoForm?.get('cellPhone.phoneNbr')?.enable();
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.enable();
    }
  }

  private setVisibilityByWorkPhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('workPhone.phoneNbr')?.disable();
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('workPhone.phoneNbr')?.reset();
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.reset();
      this.loadPreferredContactMethod();
    }
    else {
      this.contactInfoForm?.get('workPhone.phoneNbr')?.enable();
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.enable();
    }
  }

  private setVisibilityByOtherPhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('otherPhone.phoneNbr')?.disable();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.disable();
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('otherPhone.phoneNbr')?.reset();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.reset();
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.reset();
      this.loadPreferredContactMethod();
    }
    else {
      this.contactInfoForm?.get('otherPhone.phoneNbr')?.enable();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.enable();
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.enable();
    }
  }

  private setVisibilityByNoFriendsOrFamily(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.setValidators(Validators.required);
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.updateValueAndValidity();

    }
    else {
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.removeValidators(Validators.required);

    }
  }

  private setVisibilityByHomelessFlag(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('homeAddress.address1')?.disable();
      this.contactInfoForm?.get('homeAddress.address2')?.disable();
      this.contactInfoForm?.get('homeAddress.zip')?.disable();
      this.contactInfoForm?.get('homeAddress.address1')?.reset();
      this.contactInfoForm?.get('homeAddress.address2')?.reset();
      this.contactInfoForm?.get('homeAddress.zip')?.reset();

    }
    else {
      this.contactInfoForm?.get('homeAddress.address1')?.enable();
      this.contactInfoForm?.get('homeAddress.address2')?.enable();
      this.contactInfoForm?.get('homeAddress.zip')?.enable();
      if (this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.value ?? false) {
        this.setSameAsMailingAddressFlagChanges(true);
      }
    }
  }

  private setVisibilitybyRelationship(selectedValue: any) {
    if (selectedValue === 'O') {
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.enable();
    }
    else {
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.disable();
    }
  }

  private emailApplicableFlagChangeSubscription() {
    (this.contactInfoForm.get('email') as FormGroup)?.controls['applicableFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByNoEmailCheckbox(value);
    });
  }

  private setAddress(address: MailAddress | undefined, type: AddressTypeCode) {
    if (!address) return;
    var selectedAddress: ClientAddress = {
      address1: address?.address1 == '' ? address?.address2 : address?.address1,
      address2: address?.address1 == '' ? '' : address?.address2,
      city: address?.city,
      state: address?.state,
      zip: address?.zip5,
    };
    if (type === AddressTypeCode.Mail) {
      this.isSkipMailAddressValidation = true;
      this.contactInfoForm.get('maillingAddress')?.patchValue(selectedAddress);
    }
    else if (type === AddressTypeCode.Home) {
      this.isSkipHomeAddressValidation = true;

      //this.setHomeAddress(mailAddress);
      var sameAsFlag = this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.value;
      var homelessFlag = this.contactInfoForm?.get('homeAddress.homelessFlag')?.value;
      var noHomeAddressProofFlag = this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.value;
      var housingStabilityCode = this.contactInfoForm?.get('homeAddress.housingStabilityCode')?.value;
      const homeAddress: any = {
        address1: selectedAddress?.address1,
        address2: selectedAddress?.address2,
        city: selectedAddress?.city,
        state: selectedAddress?.state,
        zip: selectedAddress?.zip,
        sameAsMailingAddressFlag: sameAsFlag,
        homelessFlag: homelessFlag,
        noHomeAddressProofFlag: noHomeAddressProofFlag,
        housingStabilityCode: housingStabilityCode
      };

      this.contactInfoForm.get('homeAddress')?.patchValue(homeAddress);
    }
  }

  private setPreferredContact(control: AbstractControl | null,
    homePhone: ClientPhone | undefined, cellPhone: ClientPhone | undefined,
    workPhone: ClientPhone | undefined, otherPhone: ClientPhone | undefined,
    email: ClientEmail | undefined) {
    if (!control) return;
    if (homePhone?.preferredFlag ?? false) {
      control?.patchValue(homePhone?.phoneNbr);
    }
    else if (cellPhone?.preferredFlag ?? false) {
      control?.patchValue(cellPhone?.phoneNbr);
    }
    else if (workPhone?.preferredFlag ?? false) {
      control?.patchValue(workPhone?.phoneNbr);
    }
    else if (otherPhone?.preferredFlag ?? false) {
      control?.patchValue(otherPhone?.phoneNbr);
    }
    else if (email?.preferredFlag ?? false) {
      control?.patchValue(email?.email);
    }

    return '';
  }


  private setSameAsMailingAddressFlagChanges(value: boolean) {
    const homeAddressGroup = this.contactInfoForm.get('homeAddress') as FormGroup;
    if (value) {
      const maillingAddressGroup = this.contactInfoForm.get('maillingAddress') as FormGroup;
      const address: ClientAddress = {
        address1: maillingAddressGroup?.controls['address1']?.value,
        address2: maillingAddressGroup?.controls['address2']?.value,
        city: maillingAddressGroup?.controls['city']?.value,
        state: maillingAddressGroup?.controls['state']?.value,
        zip: maillingAddressGroup?.controls['zip']?.value
      };
      this.setHomeAddress(address);
      if (!(homeAddressGroup?.controls['homelessFlag']?.value ?? false)) {
        this.homeAddressIsNotValid = this.mailingAddressIsNotValid;
      }
      homeAddressGroup?.controls['address1']?.disable();
      homeAddressGroup?.controls['address2']?.disable();
      homeAddressGroup?.controls['city']?.disable();
      homeAddressGroup?.controls['state']?.disable();
      homeAddressGroup?.controls['zip']?.disable();
      this.isSkipHomeAddressValidation = true;
    }
    else {
      if (!(homeAddressGroup?.controls['homelessFlag']?.value ?? false)) {
        homeAddressGroup?.controls['address1']?.enable();
        homeAddressGroup?.controls['address2']?.enable();
        homeAddressGroup?.controls['zip']?.enable();
      }

      homeAddressGroup?.controls['city']?.enable();
      homeAddressGroup?.controls['state']?.enable();
      homeAddressGroup?.controls['address1']?.reset();
      homeAddressGroup?.controls['address2']?.reset();
      homeAddressGroup?.controls['city']?.reset();
      homeAddressGroup?.controls['state']?.reset();
      homeAddressGroup?.controls['zip']?.reset();
    }
  }

  private setHomeAddress(address: ClientAddress) {
    const homeAddressGroup = this.contactInfoForm.get('homeAddress') as FormGroup;
    homeAddressGroup?.controls['city']?.patchValue(address?.city);
    homeAddressGroup?.controls['state']?.patchValue(address?.state);

    if (!(homeAddressGroup?.controls['homelessFlag']?.value ?? false)) {
      homeAddressGroup?.controls['address1']?.patchValue(address?.address1);
      homeAddressGroup?.controls['address2']?.patchValue(address?.address2);
      homeAddressGroup?.controls['zip']?.patchValue(address?.zip);
    }
  }

  private uploadAddressProof() {

    const document: ClientDocument = {
      document: this.uploadedHomeAddressProof,
      clientId: this.workflowFacade.clientId,
      clientCaseId: this.workflowFacade.clientCaseId,
      clientCaseEligibilityId: this.workflowFacade.clientCaseEligibilityId,
      entityId: '',
      entityTypeCode: 'HomeAddress',
      documentTypeCode: 'PDF',
      documentTemplateId: '',
    }

  }

  private closeValidationPopup(type: string) {
    if (type === AddressTypeCode.Home) {
      this.homeAddressValidationPopupVisibility$.next(false);
      this.homeAddressEntered = undefined;
      this.homeAddressSuggested = undefined;
    }
    else if (type === AddressTypeCode.Mail) {
      this.mailAddressValidationPopupVisibility$.next(false);
      this.mailAddressEntered = undefined;
      this.mailAddressSuggested = undefined;
    }
    this.selectedAddressForm.reset();
  }

  /** Internal event methods **/
  onNoHomeAddressProofFlagChecked(event: Event) {
    this.setVisibilityByNoHomeAddressProofFlag((event.target as HTMLInputElement).checked);
  }

  contactRelationshipChangeSubscription() {
    this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.valueChanges
      .subscribe((value: boolean) => {
        this.setVisibilitybyRelationship(value);
      });
  }

  onStateChange(event: Event) {
    this.contactInfoForm?.get('homeAddress.county')?.reset();
  }

  onAddressValidationCloseClicked(type: string) {
    this.closeValidationPopup(type);
  }

  onUseSelectedAddressClicked(type: string) {
    this.selectedAddressForm.markAllAsTouched();
    if (this.selectedAddressForm.valid) {
      if (this.selectedAddressForm.controls['choosenAddress']?.value === 'addressSuggested') {
        this.setAddress(type === AddressTypeCode.Mail ? this.mailAddressSuggested : this.homeAddressSuggested, type as AddressTypeCode);
      }
      this.closeValidationPopup(type);
    }
  }
  onFileSelected(e: SelectEvent) {
    this.uploadedHomeAddressProof = e.files[0].rawFile;
  }

  onFileRemoved(e: SelectEvent) {
  }
}
