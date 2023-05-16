/** Angular **/
import { AfterViewInit, ElementRef, OnDestroy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
/** External Libraries **/
import { Subscription, of, mergeMap, forkJoin, distinctUntilChanged, startWith, pairwise, BehaviorSubject, catchError, tap, debounceTime } from 'rxjs';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
/** Internal Libraries **/
import {
  WorkflowFacade, ContactFacade,
  NavigationType, ContactInfo, ClientAddress, AddressTypeCode,
  ClientPhone, deviceTypeCode, ClientEmail, FriendsOrFamilyContact,
  CompletionChecklist, ClientDocument, ClientCaseElgblty,
  ClientDocumentFacade, HomeAddressProof, StatesInUSA, StatusFlag
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { AddressValidationFacade, MailAddress, AddressValidation, LovFacade } from '@cms/system-config/domain';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})

export class ContactPageComponent implements OnInit, OnDestroy, AfterViewInit {

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
  uploadedHomeAddressProof!: File | undefined;
  fileUploadRestrictions: FileRestrictions = {
    maxFileSize: this.configurationProvider.appSettings.uploadFileSizeLimit,
  };
  showCountyLoader = this.contactFacade.showloaderOnCounty$;
  showMailAddressValidationLoader$ = new BehaviorSubject(false);
  showHomeAddressValidationLoader$ = new BehaviorSubject(false);
  showRelationshipOtherDec: boolean = false;
  showAddressProofRequiredValidation: boolean = false;
  showPreferredContactLoader = false;
  isHomeAddressStateOregon$ = new BehaviorSubject(true);;
  public homeAddressProofFile: any = undefined;
  showAddressProofSizeValidation = false;
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  oldContactInfo!: ContactInfo;
  oldMailingAddress?: ClientAddress;
  oldHomeAddress?: ClientAddress;
  oldHomePhone?: ClientPhone;
  oldCellPhone?: ClientPhone;
  oldWorkPhone?: ClientPhone;
  oldOtherPhone?: ClientPhone;
  oldEmail?: ClientEmail;
  oldPreferredContact?: string;
  oldFriendsOrFamilyContact?: FriendsOrFamilyContact;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private currentSessionSubscription !: Subscription;
  private isNoMailAddressValidationRequired = true;
  private allowWorkflowCountUpdate = false;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;

  constructor(
    private readonly contactFacade: ContactFacade,
    private workflowFacade: WorkflowFacade,
    private readonly addressValidationFacade: AddressValidationFacade,
    private readonly lovFacade: LovFacade,
    private readonly elementRef: ElementRef,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly route: ActivatedRoute,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly router: Router,
    private readonly configurationProvider: ConfigurationProvider,
  ) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadCurrentSession();
    this.loadDdlRelationships();
    this.loadDdlStates();
    this.loadDdlCounties(StatesInUSA.Oregon);
    this.buildContactInfoForm();
    this.buildAddressValidationForm();
    this.addSubscriptions();
    this.addDiscardChangesSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.currentSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    });

    this.workflowFacade.enableSaveButton();
  }

  /** Private methods **/

  private addSubscriptions() {
    this.addSaveSubscription();
    this.addContactInfoFormChangeSubscription();
    this.sameAsMailingAddressChangeSubscription();
    this.addMailingAddressChangeSubscription();
    this.homelessFlagChangeSubscription();
    this.homePhoneApplicableFlagChangeSubscription();
    this.cellPhoneApplicableFlagChangeSubscription();
    this.workPhoneApplicableFlagChangeSubscription();
    this.otherPhoneApplicableFlagChangeSubscription();
    this.emailApplicableFlagChangeSubscription();
    this.noFriendsOrFamilyChangeSubscription();
    this.homeAddressProofFlagChangeSubscription();
    this.contactRelationshipChangeSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.loaderService.show();
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$.subscribe((resp) => {
      if (resp) {
        this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true
        }
        this.loadContactInfo();
        this.loaderService.hide();
      }
    });
  }

  private buildAddressValidationForm() {
    this.selectedAddressForm = new FormGroup({
      chosenAddress: new FormControl('', Validators.required),
    });
  }

  private adjustAttributeChanged(event: Event) {
    const data: CompletionChecklist = {
      dataPointName: (event.target as HTMLInputElement).name,
      status: (event.target as HTMLInputElement).checked ? StatusFlag.Yes : StatusFlag.No
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
  }

  private adjustAttributeInit(updateOnWorkflow: boolean) {
    const initialAdjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };

      initialAdjustment.push(data);
    });

    if (initialAdjustment.length > 0) {
      this.workflowFacade.updateBasedOnDtAttrChecklist(initialAdjustment);
    }

    this.updateWorkflowChecklist(updateOnWorkflow);
  }

  private loadDdlRelationships() {
    this.lovFacade.getContactRelationShipsLovs();
  }

  private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }

  private loadDdlCounties(stateCode: string) {
    this.contactFacade.loadDdlCounties(stateCode);
  }

  private addContactInfoFormChangeSubscription() {
    this.contactInfoForm.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        startWith(null), pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        if (this.allowWorkflowCountUpdate === true) {
          this.updateFormCompleteCount(prev, curr);
        }
      });
  }

  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.contactInfoForm.controls).forEach(groupKey => {
      const isFormChanged = prev && curr && prev[groupKey] !== curr[groupKey];
      if (isFormChanged) {
        if (groupKey === 'homeAddress' && (this.contactInfoForm.get('homeAddress.sameAsMailingAddressFlag')?.value ?? false)) {
          this.getHomeAddressChanges(completedDataPoints);
        }
        else {
          this.getFieldChanges(completedDataPoints, groupKey, prev, curr);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private getHomeAddressChanges(completedDataPoints: CompletionChecklist[]) {
    const homeAddressGroup = this.contactInfoForm.get('homeAddress') as FormGroup;
    completedDataPoints.push({ dataPointName: 'homeAddress_address1', status: homeAddressGroup?.controls['address1']?.value ? StatusFlag.Yes : StatusFlag.No });
    completedDataPoints.push({ dataPointName: 'homeAddress_address2', status: homeAddressGroup?.controls['address2']?.value ? StatusFlag.Yes : StatusFlag.No });
    completedDataPoints.push({ dataPointName: 'homeAddress_city', status: homeAddressGroup?.controls['city']?.value ? StatusFlag.Yes : StatusFlag.No });
    completedDataPoints.push({ dataPointName: 'homeAddress_state', status: homeAddressGroup?.controls['state']?.value ? StatusFlag.Yes : StatusFlag.No });
    completedDataPoints.push({ dataPointName: 'homeAddress_zip', status: homeAddressGroup?.controls['zip']?.value ? StatusFlag.Yes : StatusFlag.No });
    completedDataPoints.push({ dataPointName: 'homeAddress_county', status: homeAddressGroup?.controls['county']?.value ? StatusFlag.Yes : StatusFlag.No });
    completedDataPoints.push({ dataPointName: 'homeAddress_housingStabilityCode', status: homeAddressGroup?.controls['housingStabilityCode']?.value ? StatusFlag.Yes : StatusFlag.No });
  }

  private getFieldChanges(completedDataPoints: CompletionChecklist[], groupKey: string, prev: any, curr: any) {
    Object.keys((this.contactInfoForm?.get(`${groupKey}`) as FormGroup)?.controls).forEach(key => {
      const isValueChanged = prev[groupKey][key] !== curr[groupKey][key];
      const dataPointName = `${groupKey}_${key}`;
      if (isValueChanged) {
        let item: CompletionChecklist = {
          dataPointName: dataPointName,
          status: curr[groupKey][key] ? StatusFlag.Yes : StatusFlag.No
        };
        completedDataPoints.push(item);
      }
    });
  }

  private updateWorkflowChecklist(updateOnWorkflow: boolean) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.contactInfoForm.controls).forEach(groupkey => {
      Object.keys((this.contactInfoForm?.get(`${groupkey}`) as FormGroup)?.controls).forEach(key => {
        if (this.contactInfoForm?.get(`${groupkey}.${key}`)?.value) {
          let item: CompletionChecklist = {
            dataPointName: `${groupkey}_${key}`,
            status: StatusFlag.Yes
          };
          completedDataPoints.push(item);
        }
      })
    });

    const addressProof: CompletionChecklist = {
      dataPointName: 'homeAddress_proof',
      status: this.contactInfo?.homeAddressProof?.documentName ? StatusFlag.Yes : StatusFlag.No
    };
    completedDataPoints.push(addressProof);

    const otherDesc: CompletionChecklist = {
      dataPointName: 'relationshipCodeOther',
      status: this.contactInfo?.friendsOrFamilyContact?.contactRelationshipCode === 'O' ? StatusFlag.Yes : StatusFlag.No
    };
    completedDataPoints.push(otherDesc);

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints, true);
    }
    this.allowWorkflowCountUpdate = true;
  }

  loadPreferredContactMethod() {
    this.showPreferredContactLoader = true;
    const homePhone = (this.contactInfoForm.get('homePhone') as FormGroup)?.controls['phoneNbr'];
    const cellPhone = (this.contactInfoForm.get('cellPhone') as FormGroup)?.controls['phoneNbr'];
    const workPhone = (this.contactInfoForm.get('workPhone') as FormGroup)?.controls['phoneNbr'];
    const otherPhone = (this.contactInfoForm.get('otherPhone') as FormGroup)?.controls['phoneNbr'];
    const email = (this.contactInfoForm.get('email') as FormGroup)?.controls['email'];
    const isValidHomePhone = homePhone?.value && homePhone?.valid && !((this.contactInfoForm.get('homePhone') as FormGroup)?.controls['applicableFlag']?.value ?? false);
    const isValidCellPhone = cellPhone?.value && cellPhone?.valid && !((this.contactInfoForm.get('cellPhone') as FormGroup)?.controls['applicableFlag']?.value ?? false);
    const isValidWorkPhone = workPhone?.value && workPhone?.valid && !((this.contactInfoForm.get('workPhone') as FormGroup)?.controls['applicableFlag']?.value ?? false);
    const isValidOtherPhone = otherPhone?.value && otherPhone?.valid && !((this.contactInfoForm.get('otherPhone') as FormGroup)?.controls['applicableFlag']?.value ?? false);
    const isValidEmail = email?.value && email?.valid && !((this.contactInfoForm.get('email') as FormGroup)?.controls['applicableFlag']?.value ?? false);
    this.setMessageConsentVisibility(isValidHomePhone, isValidCellPhone, isValidWorkPhone, isValidOtherPhone, isValidEmail);
    this.addPreferredContact({
      isValidHomePhone, homePhone,
      isValidCellPhone, cellPhone,
      isValidWorkPhone, workPhone,
      isValidOtherPhone, otherPhone,
      isValidEmail, email
    });
  }

  private addPreferredContact(contact: any) {
    const preferredContact: string[] = [];
    if (contact?.isValidHomePhone) {
      this.addPreferredList(preferredContact, contact?.homePhone?.value);
    }
    if (contact?.isValidCellPhone) {
      this.addPreferredList(preferredContact, contact?.cellPhone?.value);
    }
    if (contact?.isValidWorkPhone) {
      this.addPreferredList(preferredContact, contact?.workPhone?.value);
    }
    if (contact?.isValidOtherPhone) {
      this.addPreferredList(preferredContact, contact?.otherPhone?.value);
    }
    if (contact?.isValidEmail) {
      const match = contact?.email?.value?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/);
      if (match) {
        preferredContact.push(contact?.email?.value ?? '');
      }
    }
    this.preferredContactMethods = preferredContact;
    this.resetPreferredContact(preferredContact);
  }

  private addPreferredList(preferredContact: string[], phone: any) {
    const formattedPhone = this.formatPhoneNumber(phone ?? '');
    if (formattedPhone) {
      preferredContact.push(formattedPhone);
    }
  }

  private resetPreferredContact(preferredContact: string[]) {
    if (preferredContact?.length > 0) {
      this.contactInfoForm?.get('email.preferredContactMethod')?.enable();
      const selectPreferredCode = this.contactInfoForm?.get('email.preferredContactMethod')?.value;
      if (selectPreferredCode && !this.preferredContactMethods?.includes(selectPreferredCode)) {
        this.contactInfoForm?.get('email.preferredContactMethod')?.reset();
      }
      this.updatePreferredContactCount(true);
      this.showPreferredContactLoader = false;
    }
    else {
      this.contactInfoForm?.get('email.preferredContactMethod')?.removeValidators(Validators.required);
      this.contactInfoForm?.get('email.preferredContactMethod')?.reset();
      this.contactInfoForm?.get('email.preferredContactMethod')?.disable();
      this.updatePreferredContactCount(false);
      this.showPreferredContactLoader = false;
    }
  }

  private setMessageConsentVisibility(isValidHomePhone: boolean, isValidCellPhone: boolean, isValidWorkPhone: boolean, isValidOtherPhone: boolean, isValidEmail: boolean,) {

    if (isValidHomePhone === true) {
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.enable();
    }
    else {
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.reset();
    }

    if (isValidCellPhone === true) {
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.enable();
    }
    else {
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.reset();
    }

    if (isValidWorkPhone === true) {
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.enable();
    }
    else {
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.reset();
    }

    if (isValidOtherPhone === true) {
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.enable();
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.enable();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.enable();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.setValidators(Validators.required);
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.updateValueAndValidity();
    }
    else {
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.disable();
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.disable();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.disable();
      this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.reset();
      this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.reset();
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.removeValidators(Validators.required);
      this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.updateValueAndValidity();
    }

    if (isValidEmail === true) {
      this.contactInfoForm?.get('email.detailMsgFlag')?.enable();
      this.contactInfoForm?.get('email.paperlessFlag')?.enable();
    }
    else {
      this.contactInfoForm?.get('email.detailMsgFlag')?.disable();
      this.contactInfoForm?.get('email.paperlessFlag')?.disable();
      this.contactInfoForm?.get('email.detailMsgFlag')?.reset();
      this.contactInfoForm?.get('email.paperlessFlag')?.reset();
    }
  }

  private formatPhoneNumber(phoneNumberString: string) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned?.match(/^(1)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return '';
  }

  private setValidation() {
    if (this.isCerForm) {
      this.removeValidators();
    }
    this.validateCerFields();
    const ffContactGroup = this.contactInfoForm.get('familyAndFriendsContact') as FormGroup;
    this.setAddressValidation();
    this.setPhoneEmailValidation();
    const isFfRequired = (ffContactGroup.controls['friendFamilyChangedFlag']?.value === StatusFlag.Yes) && this.isCerForm || !this.isCerForm;
    if ((ffContactGroup.controls['noFriendOrFamilyContactFlag']?.value ?? false) === false && isFfRequired) {
      ffContactGroup.controls['contactName'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')]);
      ffContactGroup.controls['contactName'].updateValueAndValidity();
      ffContactGroup.controls['contactRelationshipCode'].setValidators([Validators.required]);
      ffContactGroup.controls['contactRelationshipCode'].updateValueAndValidity();
      ffContactGroup.controls['contactPhoneNbr'].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      ffContactGroup.controls['contactPhoneNbr'].updateValueAndValidity();

      if (ffContactGroup.controls['contactRelationshipCode']?.value === 'O') {
        ffContactGroup.controls['otherDesc'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]);
        ffContactGroup.controls['otherDesc'].updateValueAndValidity();
      }
    }
  }

  private validateCerFields() {
    if (this.isCerForm) {
      this.contactInfoForm?.get('mailingAddress.mailingAddressChangedFlag')?.setValidators(Validators.required);
      this.contactInfoForm?.get('mailingAddress.mailingAddressChangedFlag')?.updateValueAndValidity();
      this.contactInfoForm?.get('homeAddress.homeAddressChangedFlag')?.setValidators(Validators.required);
      this.contactInfoForm?.get('homeAddress.homeAddressChangedFlag')?.updateValueAndValidity();
      this.contactInfoForm?.get('homePhone.phoneNumberChangedFlag')?.setValidators(Validators.required);
      this.contactInfoForm?.get('homePhone.phoneNumberChangedFlag')?.updateValueAndValidity();
      this.contactInfoForm?.get('email.emailAddressChangedFlag')?.setValidators(Validators.required);
      this.contactInfoForm?.get('email.emailAddressChangedFlag')?.updateValueAndValidity();
      this.contactInfoForm?.get('familyAndFriendsContact.friendFamilyChangedFlag')?.setValidators(Validators.required);
      this.contactInfoForm?.get('familyAndFriendsContact.friendFamilyChangedFlag')?.updateValueAndValidity();
    }
  }

  private setAddressValidation() {
    const homeAddressGroup = this.contactInfoForm?.get('homeAddress') as FormGroup;
    const mailingAddressGroup = this.contactInfoForm.get('mailingAddress') as FormGroup;
    const isMailAddressRequired = (mailingAddressGroup.controls['mailingAddressChangedFlag']?.value === StatusFlag.Yes) && this.isCerForm || !this.isCerForm;
    const isHomeAddressRequired = (homeAddressGroup.controls['homeAddressChangedFlag']?.value === StatusFlag.Yes) && this.isCerForm || !this.isCerForm;
    if (isMailAddressRequired) {
      mailingAddressGroup.controls['address1'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+[/]?[A-Za-z0-9 ]+$')]);
      mailingAddressGroup.controls['address1'].updateValueAndValidity();
      mailingAddressGroup.controls['address2'].setValidators([Validators.pattern('^[A-Za-z0-9 ]+[/]?[A-Za-z0-9 ]+$')]);
      mailingAddressGroup.controls['address2'].updateValueAndValidity();
      mailingAddressGroup.controls['city'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+')]);
      mailingAddressGroup.controls['city'].updateValueAndValidity();
      mailingAddressGroup.controls['state'].setValidators([Validators.required]);
      mailingAddressGroup.controls['state'].updateValueAndValidity();
      mailingAddressGroup.controls['zip'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]);
      mailingAddressGroup.controls['zip'].updateValueAndValidity();
    }
    if (isHomeAddressRequired) {
      if ((homeAddressGroup.controls['homelessFlag']?.value ?? false) === false) {
        homeAddressGroup.controls['address1'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+[/]?[A-Za-z0-9 ]+$')]);
        homeAddressGroup.controls['address1'].updateValueAndValidity();
        homeAddressGroup.controls['address2'].setValidators([Validators.pattern('^[A-Za-z0-9 ]+[/]?[A-Za-z0-9 ]+$')]);
        homeAddressGroup.controls['address2'].updateValueAndValidity();
        homeAddressGroup.controls['zip'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]);
        homeAddressGroup.controls['zip'].updateValueAndValidity();
      }

      // For validating the home address proof.
      this.showAddressProofRequiredValidation = (homeAddressGroup.controls['noHomeAddressProofFlag']?.value ?? false) === false
        && (this.uploadedHomeAddressProof === undefined
          && (this.homeAddressProofFile === undefined || this.homeAddressProofFile[0]?.name === undefined));

      homeAddressGroup.controls['city'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+')]);
      homeAddressGroup.controls['city'].updateValueAndValidity();
      homeAddressGroup.controls['state'].setValidators([Validators.required, Validators.pattern('^OR$')]);
      homeAddressGroup.controls['state'].updateValueAndValidity();
      this.isHomeAddressStateOregon$.next(homeAddressGroup.controls['state']?.value === StatesInUSA.Oregon);
      homeAddressGroup.controls['county'].setValidators([Validators.required]);
      homeAddressGroup.controls['county'].updateValueAndValidity();
    }

    if (!this.isCerForm) {
      homeAddressGroup.controls['housingStabilityCode'].setValidators([Validators.required]);
      homeAddressGroup.controls['housingStabilityCode'].updateValueAndValidity();
    }
  }

  private setPhoneEmailValidation() {
    const emailGroup = this.contactInfoForm.get('email') as FormGroup;
    const isPhoneChangedInCer = this.contactInfoForm.controls['homePhone.phoneNumberChangedFlag']?.value === StatusFlag.Yes && this.isCerForm;
    const isEmailChangedInCer = (emailGroup.controls['emailAddressChangedFlag']?.value === StatusFlag.Yes) && this.isCerForm;
    const isPreferredFlagRequired = (((isPhoneChangedInCer || isEmailChangedInCer) && this.isCerForm) || !this.isCerForm);
    this.setHomePhone(isPhoneChangedInCer);
    this.setCellPhone(isPhoneChangedInCer);
    this.setWorkPhone(isPhoneChangedInCer);
    this.setOtherPhone(isPhoneChangedInCer);

    if ((emailGroup.controls['applicableFlag']?.value ?? false) === false && (isEmailChangedInCer || !this.isCerForm)) {
      emailGroup.controls['email'].setValidators([Validators.required, Validators.email]);
      emailGroup.controls['email'].updateValueAndValidity();
    }

    if (this.preferredContactMethods.length > 0 && isPreferredFlagRequired) {
      this.contactInfoForm?.get('email.preferredContactMethod')?.setValidators(Validators.required);
      this.contactInfoForm?.get('email.preferredContactMethod')?.updateValueAndValidity();
    }
  }

  private setHomePhone(isPhoneChangedInCer: boolean) {
    const homePhoneGroup = this.contactInfoForm.get('homePhone') as FormGroup;
    if ((homePhoneGroup.controls['applicableFlag']?.value ?? false) === false && (isPhoneChangedInCer || !this.isCerForm)) {
      homePhoneGroup.controls['phoneNbr'].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      homePhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }
  }

  private setCellPhone(isPhoneChangedInCer: boolean) {
    const cellPhoneGroup = this.contactInfoForm.get('cellPhone') as FormGroup;
    if ((cellPhoneGroup.controls['applicableFlag']?.value ?? false) === false && (isPhoneChangedInCer || !this.isCerForm)) {
      cellPhoneGroup.controls['phoneNbr'].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      cellPhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }
  }

  private setWorkPhone(isPhoneChangedInCer: boolean) {
    const workPhoneGroup = this.contactInfoForm.get('workPhone') as FormGroup;
    if ((workPhoneGroup.controls['applicableFlag']?.value ?? false) === false && (isPhoneChangedInCer || !this.isCerForm)) {
      workPhoneGroup.controls['phoneNbr'].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      workPhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }
  }

  private setOtherPhone(isPhoneChangedInCer: boolean) {
    const otherPhoneGroup = this.contactInfoForm.get('otherPhone') as FormGroup;
    if ((otherPhoneGroup.controls['applicableFlag']?.value ?? false) === false && (isPhoneChangedInCer || !this.isCerForm)) {
      otherPhoneGroup.controls['phoneNbr'].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      otherPhoneGroup.controls['phoneNbr'].updateValueAndValidity();

      if (otherPhoneGroup.controls['phoneNbr']?.valid) {
        otherPhoneGroup.controls['otherPhoneNote'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]);
        otherPhoneGroup.controls['otherPhoneNote'].updateValueAndValidity();
      }
    }
  }

  private buildContactInfoForm() {
    this.contactInfoForm = new FormGroup({
      mailingAddress: new FormGroup({
        address1: new FormControl(''),
        address2: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(),
        zip: new FormControl(''),
        mailingAddressChangedFlag: new FormControl(),
      }),
      homeAddress: new FormGroup({
        address1: new FormControl(''),
        address2: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl({ value: StatesInUSA.Oregon, disabled: true }),
        zip: new FormControl(''),
        county: new FormControl(''),
        homelessFlag: new FormControl(false),
        noHomeAddressProofFlag: new FormControl(false),
        sameAsMailingAddressFlag: new FormControl(false),
        housingStabilityCode: new FormControl(),
        homeAddressChangedFlag: new FormControl(),
      }),

      homePhone: new FormGroup({
        phoneNbr: new FormControl(''),
        applicableFlag: new FormControl(false),
        detailMsgConsentFlag: new FormControl({ value: false, disabled: true }),
        smsTextConsentFlag: new FormControl({ value: false, disabled: true }),
        phoneNumberChangedFlag: new FormControl(''),
      }),
      cellPhone: new FormGroup({
        phoneNbr: new FormControl(''),
        applicableFlag: new FormControl(false),
        detailMsgConsentFlag: new FormControl({ value: false, disabled: true }),
        smsTextConsentFlag: new FormControl({ value: false, disabled: true }),
      }),
      workPhone: new FormGroup({
        phoneNbr: new FormControl(''),
        applicableFlag: new FormControl(false),
        detailMsgConsentFlag: new FormControl({ value: false, disabled: true }),
        smsTextConsentFlag: new FormControl({ value: false, disabled: true }),
      }),
      otherPhone: new FormGroup({
        phoneNbr: new FormControl(''),
        otherPhoneNote: new FormControl({ value: '', disabled: true }),
        applicableFlag: new FormControl(false),
        detailMsgConsentFlag: new FormControl({ value: false, disabled: true }),
        smsTextConsentFlag: new FormControl({ value: false, disabled: true }),
      }),
      email: new FormGroup({
        email: new FormControl(''),
        applicableFlag: new FormControl(false),
        detailMsgFlag: new FormControl({ value: false, disabled: true }),
        paperlessFlag: new FormControl({ value: false, disabled: true }),
        preferredContactMethod: new FormControl(''),
        emailAddressChangedFlag: new FormControl()
      }),
      familyAndFriendsContact: new FormGroup({
        noFriendOrFamilyContactFlag: new FormControl(false),
        contactName: new FormControl(''),
        contactRelationshipCode: new FormControl(''),
        otherDesc: new FormControl(''),
        contactPhoneNbr: new FormControl(''),
        friendFamilyChangedFlag: new FormControl()
      }),
    });
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe({
      next: ([navigationType, isSaved]) => {
        this.loaderService.hide();
        if (isSaved) {
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Contact Info Saved Successfully!');
          this.workflowFacade.navigate(navigationType);
        }
        else {
          this.workflowFacade.enableSaveButton();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  private save() {
    this.setValidation();
    this.contactInfoForm.markAllAsTouched();
    const isLargeFile = !(this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.value ?? false) && (this.uploadedHomeAddressProof?.size ?? 0) > (this.configurationProvider?.appSettings.uploadFileSizeLimit ?? 0);
    const isHomeAddressStateOregon = this.contactInfoForm?.get('homeAddress.state')?.value == StatesInUSA.Oregon;
    const isValid = this.contactInfoForm.valid && !this.showAddressProofRequiredValidation && !isLargeFile && isHomeAddressStateOregon === true
    if (isValid) {
      this.loaderService.show()
      return this.saveContactInfo();
    }

    return of(false);
  }

  validateMailingAddress(isNoPopup: boolean = false) {
    if (this.isNoMailAddressValidationRequired) return;
    const mailingAddressGroup = this.contactInfoForm.get('mailingAddress') as FormGroup;
    const changedMailingAddress: MailAddress = {
      address1: mailingAddressGroup?.controls['address1']?.value ?? '',
      address2: mailingAddressGroup?.controls['address2']?.value ?? '',
      city: mailingAddressGroup?.controls['city']?.value ?? '',
      state: mailingAddressGroup?.controls['state']?.value ?? '',
      zip5: mailingAddressGroup?.controls['zip']?.value ?? ''
    }

    const isValid = mailingAddressGroup?.controls['address1']?.valid && (mailingAddressGroup?.controls['address1']?.value !== '' && mailingAddressGroup?.controls['address1']?.value !== null)
      && mailingAddressGroup?.controls['city']?.valid && (mailingAddressGroup?.controls['city']?.value !== '' && mailingAddressGroup?.controls['city']?.value !== null)
      && mailingAddressGroup?.controls['state']?.valid && (mailingAddressGroup?.controls['state']?.value !== '' && mailingAddressGroup?.controls['state']?.value !== null)
      && mailingAddressGroup?.controls['zip']?.valid && (mailingAddressGroup?.controls['zip']?.value !== '' && mailingAddressGroup?.controls['zip']?.value !== null)

    if (!isValid) return;
    if (this.mailAddressEntered && !isNoPopup) {
      if (this.mailAddressEntered.address1 === changedMailingAddress?.address1
        && this.mailAddressEntered.address2 === changedMailingAddress?.address2
        && this.mailAddressEntered.city === changedMailingAddress?.city
        && this.mailAddressEntered.state === changedMailingAddress?.state
        && this.mailAddressEntered.zip5 === changedMailingAddress?.zip5) {
        return;
      }
    }
    this.mailAddressEntered = changedMailingAddress;
    this.showMailAddressValidationLoader$.next(true);
    this.uspsMailingAddressValidation(isNoPopup, changedMailingAddress);

  }

  private uspsMailingAddressValidation(isNoPopup: boolean, changedMailingAddress: MailAddress) {
    this.addressValidationFacade.validate(changedMailingAddress).subscribe({
      next: (validationResp: AddressValidation | null) => {
        this.showMailAddressValidationLoader$.next(false);
        if (validationResp?.isValid ?? false) {
          this.mailAddressSuggested = validationResp?.address;
          this.mailingAddressIsNotValid = false;
        }
        else {
          this.mailingAddressIsNotValid = true;
        }
        if (isNoPopup === false) {
          this.mailAddressValidationPopupVisibility$.next(true);
        }
      },
      error: (err: any) => {
        this.showMailAddressValidationLoader$.next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    })
  }

  validateHomeAddress(isNoPopup: boolean = false) {
    if (this.isNoMailAddressValidationRequired) return;
    const homeAddressGroup = this.contactInfoForm.get('homeAddress') as FormGroup;
    const changedMailingAddress: MailAddress = {
      address1: homeAddressGroup?.controls['address1']?.value ?? '',
      address2: homeAddressGroup?.controls['address2']?.value ?? '',
      city: homeAddressGroup?.controls['city']?.value ?? '',
      state: homeAddressGroup?.controls['state']?.value ?? '',
      zip5: homeAddressGroup?.controls['zip']?.value ?? ''
    }

    const isValid = homeAddressGroup?.controls['address1']?.valid && (changedMailingAddress?.address1 !== '' && changedMailingAddress?.address1 !== null)
      && homeAddressGroup?.controls['city']?.valid && (changedMailingAddress?.city !== '' && changedMailingAddress?.city !== null)
      && (changedMailingAddress?.state !== '' && changedMailingAddress?.state !== null)
      && homeAddressGroup?.controls['zip']?.valid && (changedMailingAddress?.zip5 !== '' && changedMailingAddress?.zip5 !== null)

    if (!isValid) return;
    if (this.homeAddressEntered && !isNoPopup) {
      if (this.homeAddressEntered.address1 === changedMailingAddress?.address1
        && this.homeAddressEntered.address2 === changedMailingAddress?.address2
        && this.homeAddressEntered.city === changedMailingAddress?.city
        && this.homeAddressEntered.state === changedMailingAddress?.state
        && this.homeAddressEntered.zip5 === changedMailingAddress?.zip5) {
        return;
      }
    }
    this.homeAddressEntered = changedMailingAddress;
    this.showHomeAddressValidationLoader$.next(true);
    this.uspsHomeAddressValidation(isNoPopup, changedMailingAddress);
  }

  private uspsHomeAddressValidation(isNoPopup: boolean, changedHomeAddress: MailAddress) {
    this.addressValidationFacade.validate(changedHomeAddress).subscribe({
      next: (validationResp: AddressValidation | null) => {
        this.showHomeAddressValidationLoader$.next(false);
        if (validationResp?.isValid ?? false) {
          this.homeAddressSuggested = validationResp?.address;
          this.homeAddressIsNotValid = false;
        }
        else {
          this.homeAddressIsNotValid = true;
        }
        if (isNoPopup === false) {
          this.homeAddressValidationPopupVisibility$.next(true);
        }
      },
      error: (err: any) => {
        this.showHomeAddressValidationLoader$.next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    })
  }

  private getHomeAddress() {
    const homeAddressGroup = this.contactInfoForm?.get('homeAddress') as FormGroup;
    const homeAddress: ClientAddress = {
      city: homeAddressGroup?.controls['city']?.value,
      state: homeAddressGroup?.controls['state']?.value,
      county: homeAddressGroup?.controls['county']?.value,
      addressTypeCode: AddressTypeCode.Home,
      sameAsMailingAddressFlag: this.getFlag(homeAddressGroup?.controls['sameAsMailingAddressFlag']?.value),
    }
    const homelessFlag = this.getFlag(homeAddressGroup?.get('homelessFlag')?.value);
    if (homelessFlag !== StatusFlag.Yes) {
      homeAddress.address1 = homeAddressGroup?.controls['address1']?.value;
      homeAddress.address2 = homeAddressGroup?.controls['address2']?.value;
      homeAddress.zip = homeAddressGroup?.controls['zip']?.value;
    }

    return homeAddress;
  }

  private getPhoneAndEmail() {
    const homePhoneGroup = this.contactInfoForm.get('homePhone') as FormGroup;
    const homePhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.HomePhone,
      applicableFlag: this.getFlag(!(homePhoneGroup.controls['applicableFlag']?.value ?? false)),
    }

    if (homePhone.applicableFlag !== StatusFlag.No) {
      homePhone.phoneNbr = homePhoneGroup.controls['phoneNbr']?.value;
      homePhone.detailMsgConsentFlag = this.getFlag(homePhoneGroup.controls['detailMsgConsentFlag']?.value);
      homePhone.smsTextConsentFlag = this.getFlag(homePhoneGroup.controls['smsTextConsentFlag']?.value);
    }

    const cellPhoneGroup = this.contactInfoForm.get('cellPhone') as FormGroup;
    const cellPhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.CellPhone,
      applicableFlag: this.getFlag(!(cellPhoneGroup.controls['applicableFlag']?.value ?? false)),
    }

    if (cellPhone.applicableFlag !== StatusFlag.No) {
      cellPhone.phoneNbr = cellPhoneGroup.controls['phoneNbr']?.value;
      cellPhone.detailMsgConsentFlag = this.getFlag(cellPhoneGroup.controls['detailMsgConsentFlag']?.value);
      cellPhone.smsTextConsentFlag = this.getFlag(cellPhoneGroup.controls['smsTextConsentFlag']?.value);
    }

    const workPhoneGroup = this.contactInfoForm.get('workPhone') as FormGroup;
    const workPhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.WorkPhone,
      applicableFlag: this.getFlag(!(workPhoneGroup.controls['applicableFlag']?.value ?? false)),
    }

    if (workPhone.applicableFlag !== StatusFlag.No) {
      workPhone.phoneNbr = workPhoneGroup.controls['phoneNbr']?.value;
      workPhone.detailMsgConsentFlag = this.getFlag(workPhoneGroup.controls['detailMsgConsentFlag']?.value);
      workPhone.smsTextConsentFlag = this.getFlag(workPhoneGroup.controls['smsTextConsentFlag']?.value);
    }

    const otherPhoneGroup = this.contactInfoForm.get('otherPhone') as FormGroup;
    const otherPhone: ClientPhone = {
      deviceTypeCode: deviceTypeCode.OtherPhone,
      applicableFlag: this.getFlag(!(otherPhoneGroup.controls['applicableFlag']?.value ?? false)),
    }

    if (otherPhone.applicableFlag !== StatusFlag.No) {
      otherPhone.phoneNbr = otherPhoneGroup.controls['phoneNbr']?.value;
      otherPhone.detailMsgConsentFlag = this.getFlag(otherPhoneGroup.controls['detailMsgConsentFlag']?.value);
      otherPhone.smsTextConsentFlag = this.getFlag(otherPhoneGroup.controls['smsTextConsentFlag']?.value);
      otherPhone.otherPhoneNote = otherPhoneGroup.controls['otherPhoneNote']?.value;
    }

    const emailGroup = this.contactInfoForm.get('email') as FormGroup;
    const email: ClientEmail = {
      applicableFlag: this.getFlag(!(emailGroup.controls['applicableFlag']?.value ?? false)),
    }

    if (email.applicableFlag !== StatusFlag.No) {
      email.email = emailGroup.controls['email']?.value;
      email.detailMsgFlag = this.getFlag(emailGroup.controls['detailMsgFlag']?.value);
    }

    let preferredContactCode = emailGroup.controls['preferredContactMethod']?.value;
    preferredContactCode = preferredContactCode?.replace(/[- )(]/g, '');
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

    return {
      homePhone: homePhone,
      cellPhone: cellPhone,
      workPhone: workPhone,
      otherPhone: otherPhone,
      email: email
    };
  }

  private saveContactInfo() {
    const contactInfoData: ContactInfo = {};
    const homeAddressGroup = this.contactInfoForm?.get('homeAddress') as FormGroup;
    const homelessFlag = this.getFlag(homeAddressGroup?.get('homelessFlag')?.value);
    const homeAddress = this.getHomeAddress();
    const phoneAndEmail = this.getPhoneAndEmail();

    const mailingAddressGroup = this.contactInfoForm.get('mailingAddress') as FormGroup;
    const mailingAddress: ClientAddress = {
      address1: mailingAddressGroup?.controls['address1']?.value,
      address2: mailingAddressGroup?.controls['address2']?.value,
      city: mailingAddressGroup?.controls['city']?.value,
      state: mailingAddressGroup?.controls['state']?.value,
      zip: mailingAddressGroup?.controls['zip']?.value,
      addressTypeCode: AddressTypeCode.Mail,
    }

    const ffContactGroup = this.contactInfoForm.get('familyAndFriendsContact') as FormGroup;
    const friendsOrFamilyContact: FriendsOrFamilyContact = {
      noFriendOrFamilyContactFlag: this.getFlag(ffContactGroup.controls['noFriendOrFamilyContactFlag']?.value),
    }

    if (friendsOrFamilyContact.noFriendOrFamilyContactFlag !== StatusFlag.Yes) {
      friendsOrFamilyContact.contactName = ffContactGroup.controls['contactName']?.value;
      friendsOrFamilyContact.contactPhoneNbr = ffContactGroup.controls['contactPhoneNbr']?.value;
      friendsOrFamilyContact.contactRelationshipCode = ffContactGroup.controls['contactRelationshipCode']?.value;
      friendsOrFamilyContact.otherDesc = ffContactGroup.controls['otherDesc']?.value;
    }

    const clientCaseEligibility: ClientCaseElgblty = {
      homelessFlag: homelessFlag,
      housingStabilityCode: homeAddressGroup?.get('housingStabilityCode')?.value,
      paperlessFlag: this.getFlag(this.contactInfoForm?.get('email.paperlessFlag')?.value),
      homeAddressProofFlag: this.getFlag(homeAddressGroup?.get('noHomeAddressProofFlag')?.value),
      mailingAddressChangedFlag: this.contactInfoForm.get('mailingAddress.mailingAddressChangedFlag')?.value,
      homeAddressChangedFlag: this.contactInfoForm.get('homeAddress.homeAddressChangedFlag')?.value,
      phoneNumberChangedFlag: this.contactInfoForm.get('homePhone.phoneNumberChangedFlag')?.value,
      emailAddressChangedFlag: this.contactInfoForm.get('email.emailAddressChangedFlag')?.value,
      friendFamilyChangedFlag: this.contactInfoForm.get('familyAndFriendsContact.friendFamilyChangedFlag')?.value,
      elgbtyFlagConcurrencyStamp: this.contactInfo?.clientCaseEligibility?.elgbtyFlagConcurrencyStamp,
      elgbtyConcurrencyStamp: this.contactInfo?.clientCaseEligibility?.elgbtyConcurrencyStamp,
      previousClientEligibilityId: this.prevClientCaseEligibilityId
    };

    let addressProofDoc: HomeAddressProof | undefined = undefined;
    if (this.uploadedHomeAddressProof != null && !homeAddressGroup?.get('noHomeAddressProofFlag')?.value) {
      addressProofDoc = {
        clientCaseId: this.workflowFacade.clientCaseId,
        documentName: this.uploadedHomeAddressProof.name,
        document: this.uploadedHomeAddressProof,
        documentSize: this.uploadedHomeAddressProof.size
      };
    }

    if (this.isEdit) {
      const homeAddress1 = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Home)[0];
      const mailingAddress1 = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Mail)[0];
      const homePhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.HomePhone)[0];
      const cellPhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.CellPhone)[0];
      const workPhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.WorkPhone)[0];
      const otherPhone1 = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.OtherPhone)[0];
      mailingAddress.clientAddressId = mailingAddress1?.clientAddressId;
      mailingAddress.concurrencyStamp = mailingAddress1?.concurrencyStamp;
      homeAddress.clientAddressId = homeAddress1?.clientAddressId;
      homeAddress.concurrencyStamp = homeAddress1?.concurrencyStamp;

      homeAddress.clientAddressId = homeAddress1?.clientAddressId;
      homeAddress.concurrencyStamp = homeAddress1?.concurrencyStamp;

      phoneAndEmail.homePhone.clientPhoneId = homePhone1?.clientPhoneId;
      phoneAndEmail.homePhone.concurrencyStamp = homePhone1?.concurrencyStamp;

      phoneAndEmail.cellPhone.clientPhoneId = cellPhone1?.clientPhoneId;
      phoneAndEmail.cellPhone.concurrencyStamp = cellPhone1?.concurrencyStamp;

      phoneAndEmail.workPhone.clientPhoneId = workPhone1?.clientPhoneId;
      phoneAndEmail.workPhone.concurrencyStamp = workPhone1?.concurrencyStamp;

      phoneAndEmail.otherPhone.clientPhoneId = otherPhone1?.clientPhoneId;
      phoneAndEmail.otherPhone.concurrencyStamp = otherPhone1?.concurrencyStamp;

      phoneAndEmail.email.clientEmailId = this.contactInfo?.email?.clientEmailId;
      phoneAndEmail.email.concurrencyStamp = this.contactInfo?.email?.concurrencyStamp;

      friendsOrFamilyContact.clientDependentId = this.contactInfo?.friendsOrFamilyContact?.clientDependentId;
      friendsOrFamilyContact.concurrencyStamp = this.contactInfo?.friendsOrFamilyContact?.concurrencyStamp;

      if (addressProofDoc && !homeAddressGroup?.get('noHomeAddressProofFlag')?.value) {
        addressProofDoc.concurrencyStamp = this.contactInfo?.homeAddressProof?.concurrencyStamp ?? '';
        addressProofDoc.documentId = this.contactInfo?.homeAddressProof?.documentId ?? '';
      }
    }

    contactInfoData.address = [mailingAddress, homeAddress];
    contactInfoData.phone = [phoneAndEmail.homePhone, phoneAndEmail.cellPhone, phoneAndEmail.workPhone, phoneAndEmail.otherPhone];
    contactInfoData.email = phoneAndEmail.email;
    contactInfoData.friendsOrFamilyContact = friendsOrFamilyContact;
    contactInfoData.clientCaseEligibility = clientCaseEligibility;
    contactInfoData.isCer = this.isCerForm;
    if (addressProofDoc) {
      contactInfoData.homeAddressProof = addressProofDoc;
    }

    return this.saveContact(this.workflowFacade.clientId, this.workflowFacade.clientCaseEligibilityId, contactInfoData);
  }

  private saveContact(clientId: number | undefined, clientCaseEligibilityId: string | undefined, contactInfo: ContactInfo) {
    if (this.isEdit) {
      return this.updateContactInfo(clientId ?? 0, clientCaseEligibilityId ?? '', contactInfo);
    }

    return this.contactFacade.createContactInfo(clientId ?? 0, clientCaseEligibilityId ?? '', contactInfo);
  }

  private updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfoData: ContactInfo) {
    return this.contactFacade.updateContactInfo(clientId, clientCaseEligibilityId, contactInfoData);
  }

  private getFlag(flag?: boolean) {
    return flag ? StatusFlag.Yes : StatusFlag.No;
  }

  private loadContactInfo(isFormFillRequired = true) {
    this.loaderService.show()
    this.contactFacade.loadContactInfo(this.workflowFacade.clientId ?? 0, this.workflowFacade.clientCaseEligibilityId ?? '').subscribe({
      next: (data: ContactInfo) => {
        this.loaderService.hide();
        if (data) {
          this.isEdit = (data?.address && data?.address?.length > 0 && data?.phone && data?.phone?.length > 0) ?? false;
          this.contactInfo = data;
          if (isFormFillRequired) {
            if (this.isCerForm) {
              this.loadOldContactInfo();
            } else {
              this.setFormValues();
            }
          }
          if (!this.isEdit) {
            this.loadDdlCounties(StatesInUSA.Oregon);
          }
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  private loadOldContactInfo() {
    this.loaderService.show()
    this.contactFacade.loadContactInfo(this.workflowFacade.clientId ?? 0, this.workflowFacade.clientCaseEligibilityId ?? '', this.prevClientCaseEligibilityId ?? '').subscribe({
      next: (data: ContactInfo) => {
        this.loaderService.hide();
        if (data) {
          this.oldContactInfo = data;
          this.oldHomeAddress = data?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Home)[0];
          this.oldMailingAddress = data?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Mail)[0];
          this.oldHomePhone = data?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.HomePhone)[0];
          this.oldCellPhone = data?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.CellPhone)[0];
          this.oldWorkPhone = data?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.WorkPhone)[0];
          this.oldOtherPhone = data?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.OtherPhone)[0];
          this.oldEmail = data?.email;
          if (this.oldHomePhone?.preferredFlag === StatusFlag.Yes) this.oldPreferredContact = this.formatPhoneNumber(this.oldHomePhone?.phoneNbr ?? '');
          else if (this.oldCellPhone?.preferredFlag === StatusFlag.Yes) this.oldPreferredContact = this.formatPhoneNumber(this.oldCellPhone?.phoneNbr ?? '');
          else if (this.oldWorkPhone?.preferredFlag === StatusFlag.Yes) this.oldPreferredContact = this.formatPhoneNumber(this.oldWorkPhone?.phoneNbr ?? '');
          else if (this.oldOtherPhone?.preferredFlag === StatusFlag.Yes) this.oldPreferredContact = this.formatPhoneNumber(this.oldOtherPhone?.phoneNbr ?? '');
          else if (this.oldEmail?.preferredFlag === StatusFlag.Yes) this.oldPreferredContact = this.oldEmail?.email;
          this.oldFriendsOrFamilyContact = data?.friendsOrFamilyContact;
          this.setFormValues();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  useOldOnClick(formName: string, value: string) {
    if (formName === 'email.preferredContactMethod') {
      if (!this.preferredContactMethods?.includes(value)) {
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, `${value} does not exist in preferred contact list.Please choose one form the list.`, NotificationSource.UI);
      }
    }
    this.contactInfoForm.get(formName)?.patchValue(value);
  }

  getPhoneUseOldText(phone: ClientPhone | undefined | null) {
    let text = '';
    if (phone?.applicableFlag === StatusFlag.No)
      return 'Not Applicable';
    else if (phone?.applicableFlag === StatusFlag.Yes && phone?.phoneNbr) {
      let text = this.formatPhoneNumber(phone?.phoneNbr);
      if (phone?.detailMsgConsentFlag === StatusFlag.Yes) {
        text += ', Detailed Message OK';
      }
      if (phone?.smsTextConsentFlag === StatusFlag.Yes) {
        text += ', SMS Text OK';
      }
      return text;
    }
    return '';
  }

  useOldPhone(formGroupName: string, phone: ClientPhone | undefined | null) {
    if (!phone) return;
    if (phone?.applicableFlag === StatusFlag.No) {
      this.contactInfoForm.get(`${formGroupName}.applicableFlag`)?.patchValue(phone?.applicableFlag === StatusFlag.No);
    }
    this.contactInfoForm.get(`${formGroupName}.phoneNbr`)?.patchValue(phone?.phoneNbr);
    this.contactInfoForm.get(`${formGroupName}.detailMsgConsentFlag`)?.patchValue(phone?.detailMsgConsentFlag === StatusFlag.Yes);
    this.contactInfoForm.get(`${formGroupName}.smsTextConsentFlag`)?.patchValue(phone?.smsTextConsentFlag === StatusFlag.Yes);
    if (formGroupName === 'otherPhone') {
      this.contactInfoForm.get(`${formGroupName}.otherPhoneNote`)?.patchValue(phone?.otherPhoneNote);
    }
    this.loadPreferredContactMethod();
  }

  getEmailUseOldText(email: ClientEmail | undefined | null) {
    let text = '';
    if (email?.applicableFlag === StatusFlag.No)
      return 'Not Applicable';
    else if (email?.applicableFlag === StatusFlag.Yes && email?.email) {
      let text = email?.email;
      if (email?.detailMsgFlag === StatusFlag.Yes) {
        text += ', Detailed Message OK';
      }
      if (this.oldContactInfo?.clientCaseEligibility?.paperlessFlag === StatusFlag.Yes) {
        text += ', Go paperless';
      }
      return text;
    }
    return '';
  }

  useOldEmail(phone: ClientEmail | undefined | null) {
    if (!phone) return;
    if (phone?.applicableFlag === StatusFlag.No) {
      this.contactInfoForm.get(`email.applicableFlag`)?.patchValue(phone?.applicableFlag === StatusFlag.No);
    }
    this.contactInfoForm.get(`email.email`)?.patchValue(phone?.email);
    this.contactInfoForm.get(`email.detailMsgFlag`)?.patchValue(phone?.detailMsgFlag === StatusFlag.Yes);
    this.contactInfoForm.get(`email.paperlessFlag`)?.patchValue(this.oldContactInfo?.clientCaseEligibility?.paperlessFlag === StatusFlag.Yes);
    this.loadPreferredContactMethod();
  }

  private setFormValues() {
    if (this.contactInfo) {
      this.isNoMailAddressValidationRequired = true;

      if (this.isCerForm) {
        this.contactInfoForm.get('mailingAddress.mailingAddressChangedFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.mailingAddressChangedFlag);
        this.contactInfoForm.get('homeAddress.homeAddressChangedFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.homeAddressChangedFlag);
        this.contactInfoForm.get('homePhone.phoneNumberChangedFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.phoneNumberChangedFlag);
        this.contactInfoForm.get('email.emailAddressChangedFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.emailAddressChangedFlag);
        this.contactInfoForm.get('familyAndFriendsContact.friendFamilyChangedFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.friendFamilyChangedFlag);
      }

      this.setMailAndHomeAddress();
      this.setPhoneEmailContact();

      if ((this.contactInfo?.clientCaseEligibility?.friendFamilyChangedFlag === StatusFlag.Yes || !this.isCerForm)) {
        this.contactInfoForm.get('familyAndFriendsContact')?.patchValue(this.contactInfo?.friendsOrFamilyContact);
        this.contactInfoForm.get('familyAndFriendsContact.noFriendOrFamilyContactFlag')?.patchValue(this.contactInfo?.friendsOrFamilyContact?.noFriendOrFamilyContactFlag === StatusFlag.Yes);
      }

      this.loadPreferredContactMethod();
      this.loaderService.hide();
      this.isNoMailAddressValidationRequired = false;
      this.validateMailingAddress(true);
      this.validateHomeAddress(true);
    }
    this.adjustAttributeInit(!this.isEdit);
  }

  private setMailAndHomeAddress() {
    const homeAddress = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Home)[0];
    const mailingAddress = this.contactInfo?.address?.filter((adrs: ClientAddress) => adrs.addressTypeCode === AddressTypeCode.Mail)[0];
    if (mailingAddress && (this.contactInfo?.clientCaseEligibility?.mailingAddressChangedFlag === StatusFlag.Yes || !this.isCerForm)) {
      this.contactInfoForm.get('mailingAddress')?.patchValue(mailingAddress);
      this.mailAddressEntered = {
        address1: mailingAddress?.address1,
        address2: mailingAddress?.address2,
        city: mailingAddress?.city,
        state: mailingAddress?.state,
        zip5: mailingAddress?.zip
      };
    }

    if (homeAddress && (this.contactInfo?.clientCaseEligibility?.homeAddressChangedFlag === StatusFlag.Yes || !this.isCerForm)) {
      this.contactInfoForm.get('homeAddress.address1')?.patchValue(homeAddress?.address1);
      this.contactInfoForm.get('homeAddress.address2')?.patchValue(homeAddress?.address2);
      this.contactInfoForm.get('homeAddress.city')?.patchValue(homeAddress?.city);
      this.contactInfoForm.get('homeAddress.state')?.patchValue(homeAddress?.state);
      this.contactInfoForm.get('homeAddress.zip')?.patchValue(homeAddress?.zip);
      this.contactInfoForm.get('homeAddress.county')?.patchValue(homeAddress?.county);
      this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.patchValue(homeAddress?.sameAsMailingAddressFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homeAddress.homelessFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.homelessFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.homeAddressProofFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('homeAddress.housingStabilityCode')?.patchValue(this.contactInfo?.clientCaseEligibility?.housingStabilityCode);
      this.homeAddressEntered = {
        address1: homeAddress?.address1,
        address2: homeAddress?.address2,
        city: homeAddress?.city,
        state: homeAddress?.state,
        zip5: homeAddress?.zip
      };

      if (this.contactInfo?.homeAddressProof?.documentName) {
        this.homeAddressProofFile = [
          {
            name: this.contactInfo?.homeAddressProof?.documentName,
            size: this.contactInfo?.homeAddressProof?.documentSize,
            src: this.contactInfo?.homeAddressProof?.documentPath,
            uid: this.contactInfo?.homeAddressProof?.documentId,
            documentId: this.contactInfo?.homeAddressProof?.documentId,
          },
        ];
      }
      else {
        this.homeAddressProofFile = [];
      }
    }
  }

  private setPhoneEmailContact() {
    let homePhone: any = undefined;
    let cellPhone: any = undefined;
    let workPhone: any = undefined;
    let otherPhone: any = undefined;
    if (this.contactInfo?.clientCaseEligibility?.phoneNumberChangedFlag === StatusFlag.Yes || !this.isCerForm) {
      homePhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.HomePhone)[0];
      cellPhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.CellPhone)[0];
      workPhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.WorkPhone)[0];
      otherPhone = this.contactInfo?.phone?.filter((ph: ClientPhone) => ph.deviceTypeCode === deviceTypeCode.OtherPhone)[0];
      if (homePhone) {
        this.contactInfoForm.get('homePhone.phoneNbr')?.patchValue(homePhone?.phoneNbr);
        this.contactInfoForm?.get('homePhone.applicableFlag')?.patchValue(homePhone?.applicableFlag === StatusFlag.No);
        this.contactInfoForm?.get('homePhone.detailMsgConsentFlag')?.patchValue(homePhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('homePhone.smsTextConsentFlag')?.patchValue(homePhone?.smsTextConsentFlag === StatusFlag.Yes);
      }

      if (cellPhone) {
        this.contactInfoForm.get('cellPhone.phoneNbr')?.patchValue(cellPhone?.phoneNbr);
        this.contactInfoForm?.get('cellPhone.applicableFlag')?.patchValue(cellPhone?.applicableFlag === StatusFlag.No);
        this.contactInfoForm?.get('cellPhone.detailMsgConsentFlag')?.patchValue(cellPhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('cellPhone.smsTextConsentFlag')?.patchValue(cellPhone?.smsTextConsentFlag === StatusFlag.Yes);
      }

      if (workPhone) {
        this.contactInfoForm.get('workPhone.phoneNbr')?.patchValue(workPhone?.phoneNbr);
        this.contactInfoForm?.get('workPhone.applicableFlag')?.patchValue(workPhone?.applicableFlag === StatusFlag.No);
        this.contactInfoForm?.get('workPhone.detailMsgConsentFlag')?.patchValue(workPhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('workPhone.smsTextConsentFlag')?.patchValue(workPhone?.smsTextConsentFlag === StatusFlag.Yes);
      }

      if (otherPhone) {
        this.contactInfoForm.get('otherPhone.phoneNbr')?.patchValue(otherPhone?.phoneNbr);
        this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.patchValue(otherPhone?.otherPhoneNote);
        if (otherPhone?.phoneNbr) {
          this.contactInfoForm?.get('otherPhone.otherPhoneNote')?.enable();
        }
        this.contactInfoForm?.get('otherPhone.applicableFlag')?.patchValue(otherPhone?.applicableFlag === StatusFlag.No);
        this.contactInfoForm?.get('otherPhone.detailMsgConsentFlag')?.patchValue(otherPhone?.detailMsgConsentFlag === StatusFlag.Yes);
        this.contactInfoForm?.get('otherPhone.smsTextConsentFlag')?.patchValue(otherPhone?.smsTextConsentFlag === StatusFlag.Yes);
      }
    }
    if (this.contactInfo?.clientCaseEligibility?.emailAddressChangedFlag === StatusFlag.Yes || !this.isCerForm) {
      this.contactInfoForm.get('email.email')?.patchValue(this.contactInfo?.email?.email);
      this.contactInfoForm?.get('email.applicableFlag')?.patchValue(this.contactInfo?.email?.applicableFlag === StatusFlag.No);
      this.contactInfoForm?.get('email.detailMsgFlag')?.patchValue(this.contactInfo?.email?.detailMsgFlag === StatusFlag.Yes);
      this.contactInfoForm?.get('email.paperlessFlag')?.patchValue(this.contactInfo?.clientCaseEligibility?.paperlessFlag === StatusFlag.Yes);
    }
    this.setPreferredContact(this.contactInfoForm.get('email.preferredContactMethod'),
      homePhone,
      cellPhone,
      workPhone,
      otherPhone,
      this.contactInfo?.email);

  }

  private addMailingAddressChangeSubscription() {
    (this.contactInfoForm.get('mailingAddress') as FormGroup).valueChanges
      .subscribe(() => {
        if ((this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.value ?? false) === true) {
          this.setSameAsMailingAddressFlagChanges(true);
        }
      });
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

  private homelessFlagChangeSubscription() {
    this.contactInfoForm?.get('homeAddress.homelessFlag')?.valueChanges
      .subscribe((value: boolean) => {
        this.setVisibilityByHomelessFlag(value);
      });
  }

  private setVisibilityByNoEmailCheckbox(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('email.email')?.disable();
    }
    else {
      this.contactInfoForm?.get('email.email')?.enable();
    }
    this.loadPreferredContactMethod();
  }

  private setVisibilityByNoHomeAddressProofFlag(isChecked: boolean) {
    this.isNoProofOfHomeChecked = isChecked;
    if (isChecked) {
      this.showAddressProofRequiredValidation = false;
      this.showAddressProofSizeValidation = false;
      const removeButton = this.elementRef.nativeElement.querySelectorAll('.k-delete');
      removeButton[0]?.click();
    }
    this.updateHomeAddressProofCount(this.homeAddressProofFile?.length > 0);
  }

  private setVisibilityByHomePhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('homePhone.phoneNbr')?.disable();
    }
    else {
      this.contactInfoForm?.get('homePhone.phoneNbr')?.enable();
    }
    this.loadPreferredContactMethod();
  }

  private setVisibilityByCellPhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('cellPhone.phoneNbr')?.disable();
    }
    else {
      this.contactInfoForm?.get('cellPhone.phoneNbr')?.enable();
    }
    this.loadPreferredContactMethod();
  }

  private setVisibilityByWorkPhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('workPhone.phoneNbr')?.disable();
    }
    else {
      this.contactInfoForm?.get('workPhone.phoneNbr')?.enable();
    }
    this.loadPreferredContactMethod();
  }

  private setVisibilityByOtherPhoneNotApplicable(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('otherPhone.phoneNbr')?.disable();
    }
    else {
      this.contactInfoForm?.get('otherPhone.phoneNbr')?.enable();
    }
    this.loadPreferredContactMethod();
  }

  private setVisibilityByNoFriendsOrFamily(isChecked: boolean) {
    if (isChecked) {
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.disable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.disable();
    }
    else {
      this.contactInfoForm?.get('familyAndFriendsContact.contactName')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.enable();
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.enable();

    }
  }

  private setVisibilityByHomelessFlag(isChecked: boolean) {
    this.isNoMailAddressValidationRequired = true;
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
    this.isNoMailAddressValidationRequired = false;
  }

  private setVisibilityByRelationship(selectedValue: any) {
    const otherDesc: CompletionChecklist = {
      dataPointName: 'relationshipCodeOther',
      status: StatusFlag.No
    };

    if (selectedValue === 'O') {
      this.showRelationshipOtherDec = true;
      otherDesc.status = StatusFlag.Yes;
    }
    else {
      this.showRelationshipOtherDec = false;
    }

    this.workflowFacade.updateBasedOnDtAttrChecklist([otherDesc]);
    this.contactInfoForm?.get('familyAndFriendsContact.otherDesc')?.updateValueAndValidity();
  }

  private emailApplicableFlagChangeSubscription() {
    (this.contactInfoForm.get('email') as FormGroup)?.controls['applicableFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByNoEmailCheckbox(value);
    });
  }

  private setAddress(address: MailAddress | undefined, type: AddressTypeCode) {
    if (!address) return;
    const selectedAddress: ClientAddress = {
      address1: address?.address1 == '' ? address?.address2 : address?.address1,
      address2: address?.address1 == '' ? '' : address?.address2,
      city: address?.city,
      state: address?.state,
      zip: address?.zip5,
    };
    if (type === AddressTypeCode.Mail) {
      this.mailAddressEntered = address;
      this.contactInfoForm.get('mailingAddress')?.patchValue(selectedAddress);
    }
    else if (type === AddressTypeCode.Home) {
      this.homeAddressEntered = address;
      const sameAsFlag = this.contactInfoForm?.get('homeAddress.sameAsMailingAddressFlag')?.value;
      const homelessFlag = this.contactInfoForm?.get('homeAddress.homelessFlag')?.value;
      const noHomeAddressProofFlag = this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.value;
      const housingStabilityCode = this.contactInfoForm?.get('homeAddress.housingStabilityCode')?.value;
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
      control?.patchValue(this.formatPhoneNumber(homePhone?.phoneNbr ?? ''));
    }
    else if (cellPhone?.preferredFlag ?? false) {
      control?.patchValue(this.formatPhoneNumber(cellPhone?.phoneNbr ?? ''));
    }
    else if (workPhone?.preferredFlag ?? false) {
      control?.patchValue(this.formatPhoneNumber(workPhone?.phoneNbr ?? ''));
    }
    else if (otherPhone?.preferredFlag ?? false) {
      control?.patchValue(this.formatPhoneNumber(otherPhone?.phoneNbr ?? ''));
    }
    else if (email?.preferredFlag ?? false) {
      control?.patchValue(email?.email);
    }

    return '';
  }


  private setSameAsMailingAddressFlagChanges(value: boolean) {
    this.isNoMailAddressValidationRequired = true;
    const homeAddressGroup = this.contactInfoForm.get('homeAddress') as FormGroup;
    if (value) {
      const mailingAddressGroup = this.contactInfoForm.get('mailingAddress') as FormGroup;
      let address: ClientAddress = {
        address1: mailingAddressGroup?.controls['address1']?.value,
        address2: mailingAddressGroup?.controls['address2']?.value,
        city: mailingAddressGroup?.controls['city']?.value,
        state: mailingAddressGroup?.controls['state']?.value,
        zip: mailingAddressGroup?.controls['zip']?.value
      };

      if (this.isCerForm && (mailingAddressGroup?.controls['mailingAddressChangedFlag']?.value != StatusFlag.Yes)) {
        address = {
          address1: this.oldMailingAddress?.address1,
          address2: this.oldMailingAddress?.address2,
          city: this.oldMailingAddress?.city,
          state: this.oldMailingAddress?.state,
          zip: this.oldMailingAddress?.zip
        };
      }

      this.setHomeAddress(address);
      if (!(homeAddressGroup?.controls['homelessFlag']?.value ?? false)) {
        this.homeAddressIsNotValid = this.mailingAddressIsNotValid;
      }
      homeAddressGroup?.controls['address1']?.disable();
      homeAddressGroup?.controls['address2']?.disable();
      homeAddressGroup?.controls['city']?.disable();
      homeAddressGroup?.controls['state']?.disable();
      homeAddressGroup?.controls['zip']?.disable();
      this.isHomeAddressStateOregon$.next(address?.state === StatesInUSA.Oregon);
    }
    else {
      if (!(homeAddressGroup?.controls['homelessFlag']?.value ?? false)) {
        homeAddressGroup?.controls['address1']?.enable();
        homeAddressGroup?.controls['address2']?.enable();
        homeAddressGroup?.controls['zip']?.enable();
      }

      homeAddressGroup?.controls['city']?.enable();
      homeAddressGroup?.controls['state']?.setValue(StatesInUSA.Oregon);
      this.isHomeAddressStateOregon$.next(true);
    }
    this.isNoMailAddressValidationRequired = false;
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

  private updateHomeAddressProofCount(isCompleted: boolean) {
    const workFlowData: CompletionChecklist[] = [{
      dataPointName: 'homeAddress_proof',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowData);
  }

  private updatePreferredContactCount(isCompleted: boolean) {
    const data: CompletionChecklist[] = [{
      dataPointName: 'preferredContactMethod_applicableFlag',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateBasedOnDtAttrChecklist(data);
  }

  private closeValidationPopup(type: string) {
    if (type === AddressTypeCode.Home) {
      this.homeAddressValidationPopupVisibility$.next(false);
      this.homeAddressSuggested = undefined;
    }
    else if (type === AddressTypeCode.Mail) {
      this.mailAddressValidationPopupVisibility$.next(false);
      this.mailAddressSuggested = undefined;
    }
    this.selectedAddressForm.reset();
  }

  /** Internal event methods **/
  homeAddressProofFlagChangeSubscription() {
    (this.contactInfoForm.get('homeAddress') as FormGroup)?.controls['noHomeAddressProofFlag']?.valueChanges.subscribe(value => {
      this.setVisibilityByNoHomeAddressProofFlag(value);

    });
  }

  contactRelationshipChangeSubscription() {
    this.contactInfoForm?.get('familyAndFriendsContact.contactRelationshipCode')?.valueChanges
      .subscribe((value: boolean) => {
        this.setVisibilityByRelationship(value);
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
      if (this.selectedAddressForm.controls['chosenAddress']?.value === 'addressSuggested') {
        this.setAddress(type === AddressTypeCode.Mail ? this.mailAddressSuggested : this.homeAddressSuggested, type as AddressTypeCode);
      }
      this.closeValidationPopup(type);
    }
  }
  handleFileSelected(e: SelectEvent) {
    this.homeAddressProofFile = undefined;
    this.uploadedHomeAddressProof = undefined;
    this.uploadedHomeAddressProof = e.files[0].rawFile;
    this.showAddressProofRequiredValidation = false;
    this.showAddressProofSizeValidation = (this.uploadedHomeAddressProof?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    this.updateHomeAddressProofCount(true);
  }

  handleFileRemoved(e: SelectEvent) {
    this.showAddressProofSizeValidation = false;
    if (this.homeAddressProofFile !== undefined && this.homeAddressProofFile[0]?.uid) {
      this.loaderService.show();
      this.clientDocumentFacade.removeDocument(this.contactInfo?.homeAddressProof?.documentId ?? '').subscribe({
        next: (response) => {
          if (response === true) {
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Home Address Proof Removed Successfully!")
            this.homeAddressProofFile = undefined;
            this.uploadedHomeAddressProof = undefined;
            this.loadContactInfo(false);
            this.updateHomeAddressProofCount(false);
            this.loaderService.hide();
          }
        },
        error: (err) => {
          this.loggingService.logException(err);
          this.loaderService.hide();
        },
      });
    }
    else {
      this.homeAddressProofFile = undefined;
      this.uploadedHomeAddressProof = undefined;
      this.updateHomeAddressProofCount(false);
      this.loaderService.hide();
    }

  }

  uploadEventHandler(e: SelectEvent) {
    if (this.uploadedHomeAddressProof) {
      const document: ClientDocument = {
        clientId: this.workflowFacade.clientId,
        clientCaseId: this.workflowFacade.clientCaseId,
        clientCaseEligibilityId: this.workflowFacade.clientCaseEligibilityId,
        documentName: this.uploadedHomeAddressProof.name,
        document: this.uploadedHomeAddressProof
      };

      return this.clientDocumentFacade.uploadDocument(document)
        .pipe(
          catchError((err: any) => {
            this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
            if (!(err?.error ?? false)) {
              this.loggingService.logException(err);
            }
            return of(false);
          })
        );
    }
    return of({});
  }

  get email() {
    return (this.contactInfoForm.get('email') as FormGroup).controls as any;
  }

  get homePhone() {
    return (this.contactInfoForm.get('homePhone') as FormGroup).controls as any;
  }
  get cellPhone() {
    return (this.contactInfoForm.get('cellPhone') as FormGroup).controls as any;
  }
  get workPhone() {
    return (this.contactInfoForm.get('workPhone') as FormGroup).controls as any;
  }
  get otherPhone() {
    return (this.contactInfoForm.get('otherPhone') as FormGroup).controls as any;
  }

  get fAfContact() {
    return (this.contactInfoForm.get('familyAndFriendsContact') as FormGroup).controls as any;
  }

  get homeAddress() {
    return (this.contactInfoForm.get('homeAddress') as FormGroup).controls as any;

  }
  get mailingAddress() {
    return (this.contactInfoForm.get('mailingAddress') as FormGroup).controls as any;
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      if (this.checkValidations()) {
        this.save().subscribe((response: any) => {
          if (response) {
            this.loaderService.hide();
            this.workflowFacade.handleSendNewsLetterpopup(statusResponse)
          }
        })
      }
      else {
        this.workflowFacade.handleSendNewsLetterpopup(statusResponse)
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        this.checkValidations()
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

  checkValidations() {
    this.setValidation();
    this.contactInfoForm.markAllAsTouched();
    const isAddressProofRequired = !(this.contactInfoForm?.get('homeAddress.noHomeAddressProofFlag')?.value ?? false) && (this.uploadedHomeAddressProof == undefined && this.homeAddressProofFile[0]?.name == undefined)
    if (isAddressProofRequired) {
      this.showAddressProofRequiredValidation = true;
    }
    if (this.contactInfoForm.valid && !this.showAddressProofRequiredValidation) {
      return true;
    }
    return false;
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
      if (response) {
        this.contactInfoForm.reset();
        this.removeValidators();
        this.loadContactInfo();
      }
    });
  }

  public removeValidators() {
    const homeAddressGroup = this.contactInfoForm?.get('homeAddress') as FormGroup;
    const mailingAddressGroup = this.contactInfoForm.get('mailingAddress') as FormGroup;

    const ffContactGroup = this.contactInfoForm.get('familyAndFriendsContact') as FormGroup;
    mailingAddressGroup.controls['address1'].setValidators(null);
    mailingAddressGroup.controls['address1'].updateValueAndValidity();
    mailingAddressGroup.controls['address2'].setValidators(null);
    mailingAddressGroup.controls['address2'].updateValueAndValidity();
    mailingAddressGroup.controls['city'].setValidators(null);
    mailingAddressGroup.controls['city'].updateValueAndValidity();
    mailingAddressGroup.controls['state'].setValidators(null);
    mailingAddressGroup.controls['state'].updateValueAndValidity();
    mailingAddressGroup.controls['zip'].setValidators(null);
    mailingAddressGroup.controls['zip'].updateValueAndValidity();

    if ((homeAddressGroup.controls['homelessFlag']?.value ?? false) === false) {
      homeAddressGroup.controls['address1'].setValidators(null);
      homeAddressGroup.controls['address1'].updateValueAndValidity();
      homeAddressGroup.controls['address2'].setValidators(null);
      homeAddressGroup.controls['address2'].updateValueAndValidity();
      homeAddressGroup.controls['zip'].setValidators(null);
      homeAddressGroup.controls['zip'].updateValueAndValidity();
    }

    // For validating the home address proof.
    this.showAddressProofRequiredValidation = false;

    homeAddressGroup.controls['city'].setValidators(null);
    homeAddressGroup.controls['city'].updateValueAndValidity();
    homeAddressGroup.controls['state'].setValidators(null);
    homeAddressGroup.controls['state'].updateValueAndValidity();
    this.isHomeAddressStateOregon$.next(homeAddressGroup.controls['state']?.value === StatesInUSA.Oregon);
    homeAddressGroup.controls['county'].setValidators(null);
    homeAddressGroup.controls['county'].updateValueAndValidity();


    this.removePhoneEmailValidation();
    if ((ffContactGroup.controls['noFriendOrFamilyContactFlag']?.value ?? false) === false) {
      ffContactGroup.controls['contactName'].setValidators(null);
      ffContactGroup.controls['contactName'].updateValueAndValidity();
      ffContactGroup.controls['contactRelationshipCode'].setValidators(null);
      ffContactGroup.controls['contactRelationshipCode'].updateValueAndValidity();
      ffContactGroup.controls['contactPhoneNbr'].setValidators(null);
      ffContactGroup.controls['contactPhoneNbr'].updateValueAndValidity();

      if (ffContactGroup.controls['contactRelationshipCode']?.value === 'O') {
        ffContactGroup.controls['otherDesc'].setValidators(null);
        ffContactGroup.controls['otherDesc'].updateValueAndValidity();
      }
    }
  }

  private removePhoneEmailValidation() {
    const homePhoneGroup = this.contactInfoForm.get('homePhone') as FormGroup;
    const cellPhoneGroup = this.contactInfoForm.get('cellPhone') as FormGroup;
    const workPhoneGroup = this.contactInfoForm.get('workPhone') as FormGroup;
    const otherPhoneGroup = this.contactInfoForm.get('otherPhone') as FormGroup;
    const emailGroup = this.contactInfoForm.get('email') as FormGroup;
    if ((homePhoneGroup.controls['applicableFlag']?.value ?? false) === false) {
      homePhoneGroup.controls['phoneNbr'].setValidators(null);
      homePhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }

    if ((homePhoneGroup.controls['applicableFlag']?.value ?? false) === false) {
      homePhoneGroup.controls['phoneNbr'].setValidators(null);
      homePhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }

    if ((cellPhoneGroup.controls['applicableFlag']?.value ?? false) === false) {
      cellPhoneGroup.controls['phoneNbr'].setValidators(null);
      cellPhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }

    if ((workPhoneGroup.controls['applicableFlag']?.value ?? false) === false) {
      workPhoneGroup.controls['phoneNbr'].setValidators(null);
      workPhoneGroup.controls['phoneNbr'].updateValueAndValidity();
    }

    if ((otherPhoneGroup.controls['applicableFlag']?.value ?? false) === false) {
      otherPhoneGroup.controls['phoneNbr'].setValidators(null);
      otherPhoneGroup.controls['phoneNbr'].updateValueAndValidity();

      if (otherPhoneGroup.controls['phoneNbr']?.valid) {
        otherPhoneGroup.controls['otherPhoneNote'].setValidators(null);
        otherPhoneGroup.controls['otherPhoneNote'].updateValueAndValidity();
      }
    }

    if ((emailGroup.controls['applicableFlag']?.value ?? false) === false) {
      emailGroup.controls['email'].setValidators(null);
      emailGroup.controls['email'].updateValueAndValidity();
    }

    this.contactInfoForm?.get('email.preferredContactMethod')?.setValidators(null);
    this.contactInfoForm?.get('email.preferredContactMethod')?.updateValueAndValidity();
  }

  removePhoneNumberValidation(phoneType: string) {
    if (this.contactInfoForm?.get(`${phoneType}.phoneNbr`)?.hasValidator) {
      this.contactInfoForm?.get(`${phoneType}.phoneNbr`)?.setValidators(null);
      this.contactInfoForm?.get(`${phoneType}.phoneNbr`)?.updateValueAndValidity();
      return;
    }
    if (phoneType === 'contactPhoneNbr') {
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.setValidators(null);
      this.contactInfoForm?.get('familyAndFriendsContact.contactPhoneNbr')?.updateValueAndValidity();
    }
  }
}
