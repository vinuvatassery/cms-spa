/** Angular **/
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
/** External Libraries **/
import { Subscription, of, mergeMap, forkJoin, distinctUntilChanged, startWith, pairwise } from 'rxjs';

/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, ContactFacade, NavigationType, ContactInfo, ClientAddress, AddressTypeCode, ClientPhone, deviceTypeCode, ClientEmail, FriedsOrFamilyContact, CompletionChecklist } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { StatusFlag } from 'libs/case-management/domain/src/lib/enums/status-flag.enum';
import { AddressValidationFacade, MailAddress, AddressValidation, LovFacade, ZipCodeFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})

export class ContactPageComponent implements OnInit, OnDestroy {

  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Public properties **/
  ddlPreferredContactMethods$ = this.contactFacade.ddlPreferredContactMethods$;
  ddlStates$ = this.contactFacade.ddlStates$;
  ddlCountries$ = this.contactFacade.ddlCountries$;
  ddlRelationships$ = this.contactFacade.ddlRelationships$;
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
  isAddressValidationPopup: boolean = false;
  addressEntered: MailAddress | undefined;
  addressSuggested: MailAddress | undefined;
  selectedAddressForm!: FormGroup;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  constructor(
    private readonly contactFacade: ContactFacade,
    private readonly completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly addressValidationFacade: AddressValidationFacade
  ) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadDdlRelationships();
    this.loadDdlStates();
    this.buildForm();
    this.addContactInfoFormChangeSubscription();
    this.addSaveSubscription();
    this.loadContactInfo();
    this.addMailingAddressChangeEvent();
    this.selectedAddressForm = new FormGroup({
      choosenAddress: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private methods **/
  private loadDdlRelationships() {
    this.contactFacade.loadDdlRelationships();
  }

  private updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  onChangeCounterButtonClick() {
    this.updateCompletionStatus({
      name: 'Contact Info',
      completed: 31,
      total: 31,
    });
  }

  private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }

  private loadDdlCountries(stateCode: string) {
    this.contactFacade.loadDdlCountries(stateCode);
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
    Object.keys(this.contactInfoForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
      else {
        if (this.contactInfoForm?.get(key)?.value && this.contactInfoForm?.get(key)?.valid) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: StatusFlag.Yes
          };

          completedDataPoints.push(item);
        }
      }
    });
  }

  private loadPreferredContactMethod() {
    const preferredContact: string[] = [];
    const homePhone = (this.contactInfoForm.get('homePhone') as FormGroup)?.controls['phoneNbr'];
    const cellPhone = (this.contactInfoForm.get('cellPhone') as FormGroup)?.controls['phoneNbr'];
    const workPhone = (this.contactInfoForm.get('workPhone') as FormGroup)?.controls['phoneNbr'];
    const otherPhone = (this.contactInfoForm.get('otherPhone') as FormGroup)?.controls['phoneNbr'];
    const email = (this.contactInfoForm.get('email') as FormGroup)?.controls['email'];

    if (homePhone?.value && homePhone.valid) {
      preferredContact.push(homePhone?.value);
    }
    if (cellPhone?.value && cellPhone.valid) {
      preferredContact.push(cellPhone?.value);
    }
    if (workPhone?.value && workPhone.valid) {
      preferredContact.push(workPhone?.value);
    }
    if (otherPhone?.value && otherPhone.valid) {
      preferredContact.push(otherPhone?.value);
    }
    if (email?.value && email.valid) {
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
  }

  private buildForm() {
    this.contactInfoForm = new FormGroup({
      maillingAddress: new FormGroup({
        address1: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        address2: new FormControl('', { updateOn: 'blur' }),
        city: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        state: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        zip: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      homeAddress: new FormGroup({
        address1: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        address2: new FormControl('', { updateOn: 'blur' }),
        city: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        state: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        zip: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        county: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        houselessFlag: new FormControl(false, { validators: Validators.required, updateOn: 'blur' }),
        noHomeAddressProofFlag: new FormControl(false, { validators: Validators.required, updateOn: 'blur' }),
        sameAsMailingAddressFlag: new FormControl(false, { validators: Validators.required, updateOn: 'blur' }),
      }),
      homePhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        applicableFlag: new FormControl('', { updateOn: 'blur' }),
        detailMsgConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      cellPhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        applicableFlag: new FormControl('N', { updateOn: 'blur' }),
        detailMsgConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      workPhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        applicableFlag: new FormControl('', { updateOn: 'blur' }),
        detailMsgConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      otherPhone: new FormGroup({
        phoneNbr: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        otherPhoneNote: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        applicableFlag: new FormControl('N', { updateOn: 'blur' }),
        detailMsgConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        smsTextConsentFlag: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
      }),
      email: new FormGroup({
        email: new FormControl('', { validators: [Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,20}')], updateOn: 'blur' }),
        applicableFlag: new FormControl('N', { updateOn: 'blur' }),
        detailMsgFlag: new FormControl('', { updateOn: 'blur' }),
        goPapperlessFlag: new FormControl('N', { validators: Validators.required, updateOn: 'blur' }),
        preferredContactMethod: new FormControl('', { updateOn: 'blur' }),
      }),
      familyAndFriendsContact: new FormGroup({
        noFriendOrFamilyContactFlag: new FormControl('N', { updateOn: 'blur' }),
        contactName: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        contactRelationshipCode: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
        contactPhoneNbr: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
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
      }
    });
  }

  private save() {
    // TODO: validate the form
    this.contactInfoForm.markAllAsTouched();
    if (this.contactInfoForm.valid) {
      return this.createContactInfo();
    }

    return of(false)
  }

  addMailingAddressChangeEvent() {
    (this.contactInfoForm.get('maillingAddress') as FormGroup).valueChanges
      .pipe(
        mergeMap(() => this.validateMailAddress())
      ).subscribe((response: AddressValidation | null) => {
        if (response) {
          if (response?.isValid ?? false) {
            //this.addressSuggested = (`${response?.address?.address1} ${response?.address?.address2} ${response?.address?.city}, ${response?.address?.state} ${response?.address?.zip5}-${response?.address?.zip4}`).toUpperCase();
            this.addressSuggested = response?.address;
            this.mailingAddressIsNotValid = false;
            this.isAddressValidationPopup = true;
          }
          else {
            this.mailingAddressIsNotValid = true;
            this.isAddressValidationPopup = true;
          }
        }
      });
  }

  validateMailAddress() {
    const maillingAddressGroup = this.contactInfoForm.get('maillingAddress') as FormGroup;
    const address: MailAddress = {
      address1: maillingAddressGroup?.controls['address1']?.value,
      address2: maillingAddressGroup?.controls['address2']?.value,
      city: maillingAddressGroup?.controls['city']?.value,
      state: maillingAddressGroup?.controls['state']?.value,
      zip5: maillingAddressGroup?.controls['zip']?.value,
    };

    if (address?.address1 && address?.address2 && address?.city && address?.state && address?.zip5) {
      // this.addressEntered = (`${address?.address1} ${address?.address2} ${address?.city}, ${address?.state} ${address?.zip5}`).toUpperCase();
      this.addressEntered = address;
      return this.addressValidationFacade.validate(address);
    }

    return of(null);

  }

  private createContactInfo() {
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
      clientId: 1,
    }
    const maillingAddressGroup = this.contactInfoForm.get('maillingAddress') as FormGroup;
    const maillingAddress: ClientAddress = {
      address1: maillingAddressGroup?.controls['address1']?.value,
      address2: maillingAddressGroup?.controls['address2']?.value,
      city: maillingAddressGroup?.controls['city']?.value,
      state: maillingAddressGroup?.controls['state']?.value,
      zip: maillingAddressGroup?.controls['zip']?.value,
      addressTypeCode: AddressTypeCode.Mail,
      clientId: 1,
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
    }

    contactInfoData.address = [maillingAddress, homeAddress];
    contactInfoData.phone = [homePhone, cellPhone, workPhone, otherPhone];
    contactInfoData.email = email;
    contactInfoData.friedsOrFamilyContact = friedsOrFamilyContact;
    contactInfoData.houseLessFlag = this.getFlag(homeAddressGroup?.get('houseLessFlag')?.value);
    contactInfoData.papperlessFlag = this.getFlag(homeAddressGroup?.get('papperlessFlag')?.value);
    contactInfoData.noProofOfResidency = this.getFlag(homeAddressGroup?.get('noHomeAddressProofFlag')?.value);
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
      return this.updateContactInfo(1918199376, this.workflowFacade.clientCaseEligibilityId, contactInfoData);
    }
    return this.contactFacade.createContactInfo(1918199376, this.workflowFacade.clientCaseEligibilityId, contactInfoData);
  }

  private updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfoData: ContactInfo) {
    return this.contactFacade.updateContactInfo(clientId, clientCaseEligibilityId, contactInfoData);
  }

  private getFlag(flag?: boolean) {
    return flag ? StatusFlag.Yes : StatusFlag.No;
  }

  private loadContactInfo() {
    this.contactFacade.loadContactInfo(1918199376, this.workflowFacade.clientCaseEligibilityId).subscribe((data: ContactInfo) => {
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
      this.contactInfoForm.get('homeAddress')?.patchValue(homeAddress,);
      this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.patchValue(homeAddress?.sameAsMailingAddressFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homeAddress.houselessFlag')?.patchValue(this.contactInfo?.houseLessFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.patchValue(this.contactInfo?.noProofOfResidency === StatusFlag.Yes);

      this.contactInfoForm.get('maillingAddress')?.patchValue(mailingAddress);

      this.contactInfoForm.get('homePhone')?.patchValue(homePhone);
      this.contactInfoForm?.get('homePhone.applicableFlag')?.patchValue(homePhone?.applicableFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.patchValue(homePhone?.detailMsgConsentFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.patchValue(homePhone?.smsTextConsentFlag === StatusFlag.Yes);

      this.contactInfoForm.get('cellPhone')?.patchValue(cellPhone);
      this.contactInfoForm?.get('cellPhone.applicableFlag')?.patchValue(cellPhone?.applicableFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.patchValue(cellPhone?.detailMsgConsentFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.patchValue(cellPhone?.smsTextConsentFlag === StatusFlag.Yes);

      this.contactInfoForm.get('workPhone')?.patchValue(workPhone);
      this.contactInfoForm?.get('workPhone.applicableFlag')?.patchValue(workPhone?.applicableFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.patchValue(workPhone?.detailMsgConsentFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.patchValue(workPhone?.smsTextConsentFlag === StatusFlag.Yes);

      this.contactInfoForm.get('otherPhone')?.patchValue(otherPhone);
      this.contactInfoForm?.get('otherPhone.applicableFlag')?.patchValue(otherPhone?.applicableFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.patchValue(otherPhone?.detailMsgConsentFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.patchValue(otherPhone?.smsTextConsentFlag === StatusFlag.Yes);

      this.contactInfoForm.get('email')?.patchValue(this.contactInfo?.email);
      this.contactInfoForm?.get('email.applicableFlag')?.patchValue(this.contactInfo?.email?.applicableFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('email.detailMsgConsentFlag')?.patchValue(this.contactInfo?.email?.detailMsgFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('email.papperlessFlag')?.patchValue(this.contactInfo?.papperlessFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('email.preferredContactMethod')?.patchValue(this.contactInfo?.preferredContactCode);
      this.setPreferredContact(this.contactInfoForm.get('email.preferredContactMethod'),
        homePhone,
        cellPhone,
        workPhone,
        otherPhone,
        this.contactInfo?.email);
      this.contactInfoForm.get('familyAndFriendsContact')?.patchValue(this.contactInfo?.friedsOrFamilyContact);
    }
  }

  /** Internal event methods **/
  onNoEmailCheckboxClicked(event: Event) {
    //this.isNoEmailChecked = !this.isNoEmailChecked;
    if ((event.target as HTMLInputElement).checked) {
      this.contactInfoForm?.get('email.email')?.disable();
      this.contactInfoForm?.get('email.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('email.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('email.email')?.reset();
      this.loadPreferredContactMethod();
    }
    else {
      this.contactInfoForm?.get('email.email')?.enable();
      this.contactInfoForm?.get('email.detailMsgConsentFlag')?.enable();
    }
  }

  onNoHomeAddressProofFlagChecked(event: Event) {
    this.isNoProofOfHomeChecked = (event.target as HTMLInputElement).checked;
  }

  onHomePhoneNotApplicableChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
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

  onCellPhoneNotApplicableChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
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
  onWorkPhoneNotApplicableChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
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
  onOtherPhoneNotApplicableChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
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
  onNoFriendsOrFamilyChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.reset();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.reset();
    }
    else {
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.enable();
    }
  }
  onsameAsMailingAddressFlagChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      const maillingAddressGroup = this.contactInfoForm.get('maillingAddress') as FormGroup;
      const maillingAddress: ClientAddress = {
        address1: maillingAddressGroup?.controls['address1']?.value,
        address2: maillingAddressGroup?.controls['address2']?.value,
        city: maillingAddressGroup?.controls['city']?.value,
        state: maillingAddressGroup?.controls['state']?.value,
        zip: maillingAddressGroup?.controls['zip']?.value,
      }

      this.contactInfoForm.get('homeAddress')?.patchValue(maillingAddress);
    }
    else {
      this.contactInfoForm.get('homeAddress')?.reset();
    }
  }

  onHomelessFlagChecked(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
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
    }
  }

  onAddressValidationOkClicked() {
    this.isAddressValidationPopup = false;
  }

  onUseSelectedAddressClicked() {
    this.selectedAddressForm.markAllAsTouched();
    if (this.selectedAddressForm.valid) {
      if (this.selectedAddressForm.controls['choosenAddress']?.value === 'addressSuggested') {
        this.setAddress(this.addressSuggested);
      }
      this.selectedAddressForm.reset();
      this.isAddressValidationPopup = false;

    }
  }

  onStateChange(value:any) {
    this.loadDdlCountries(value);
    this.contactInfoForm?.get('homeAddress.county')?.reset();
  }

  private setAddress(address: MailAddress | undefined) {
    if (!address) return;
    var mailAddress: ClientAddress = {
      address1: address?.address1 == '' ? address?.address2 : address?.address1,
      address2: address?.address1 == '' ? '' : address?.address2,
      city: address?.city,
      state: address?.state,
      zip: address?.zip5,
    }

    this.contactInfoForm.get('maillingAddress')?.patchValue(mailAddress);
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
}
