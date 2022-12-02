/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Contact, ContactInfo } from '../entities/contact';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { LovType, LovFacade, ZipCodeFacade } from '@cms/system-config/domain'

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  /** Private properties **/
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private ddlCountriesSubject = new BehaviorSubject<any>([]);
  private ddlRelationshipsSubject = new BehaviorSubject<any>([]);
  private ddlPreferredContactMethodsSubject = new BehaviorSubject<any>([]);
  private ddlAddressTypesSubject = new BehaviorSubject<any>([]);
  private ddlPhoneTypesSubject = new BehaviorSubject<any>([]);
  private ddlrelationshipToClientSubject = new BehaviorSubject<any>([]);
  private friendsOrFamilySubject = new BehaviorSubject<any>([]);
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private addressesSubject = new BehaviorSubject<any>([]);
  private phoneNumbersSubject = new BehaviorSubject<any>([]);
  private emailAddressesSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  ddlCountries$ = this.ddlCountriesSubject.asObservable();
  ddlRelationships$ = this.ddlRelationshipsSubject.asObservable();
  ddlPreferredContactMethods$ =
    this.ddlPreferredContactMethodsSubject.asObservable();
  ddlAddressTypes$ = this.ddlAddressTypesSubject.asObservable();
  ddlPhoneTypes$ = this.ddlPhoneTypesSubject.asObservable();
  ddlRelationshipToClient$ = this.ddlrelationshipToClientSubject.asObservable();
  friendsOrFamily$ = this.friendsOrFamilySubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  address$ = this.addressesSubject.asObservable();
  phoneNumbers$ = this.phoneNumbersSubject.asObservable();
  emailAddress$ = this.emailAddressesSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly contactDataService: ContactDataService,
    private readonly lovFacade: LovFacade,
    private readonly zipCodeFacade: ZipCodeFacade
  ) { }

  /** Public methods **/
  loadDdlStates(): void {
    this.zipCodeFacade.getStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlCountries(stateCode: string): void {
    this.zipCodeFacade.getCounties(stateCode).subscribe({
      next: (ddlCountriesResponse) => {
        this.ddlCountriesSubject.next(ddlCountriesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlRelationships(): void {
    // this.contactDataService.loadDdlRelationships().subscribe({
    //   next: (ddlRelationshipsResponse) => {
    //     this.ddlRelationshipsSubject.next(ddlRelationshipsResponse);
    //   },
    //   error: (err) => {
    //     console.error('err', err);
    //   },
    // });

    this.lovFacade.getLov(LovType.RelationshipCode).subscribe({
      next: (lovResp) => {
        console.log(lovResp);
        this.ddlRelationshipsSubject.next(lovResp);
      },
      error: (err) => {
        console.error('err', err);
      },
    })
  }

  loadDdlPreferredContactMethods(): void {
    this.contactDataService.loadDdlPreferredContactMethods().subscribe({
      next: (ddlPreferredContactMethodsResponse) => {
        this.ddlPreferredContactMethodsSubject.next(
          ddlPreferredContactMethodsResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadAddress(): void {
    this.contactDataService.loadAddresses().subscribe({
      next: (addressesResponse) => {
        this.addressesSubject.next(addressesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlAddressType(): void {
    this.contactDataService.loadDdlAddressTypes().subscribe({
      next: (ddlAddressTypesResponse) => {
        this.ddlAddressTypesSubject.next(ddlAddressTypesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadPhoneNumbers(): void {
    this.contactDataService.loadPhoneNumbers().subscribe({
      next: (phoneNumbersResponse) => {
        this.phoneNumbersSubject.next(phoneNumbersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlPhoneType(): void {
    this.contactDataService.loadDdlPhoneTypes().subscribe({
      next: (ddlPhoneTypesResponse) => {
        this.ddlPhoneTypesSubject.next(ddlPhoneTypesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadEmailAddress(): void {
    this.contactDataService.loadEmailAddresses().subscribe({
      next: (emailAddressesResponse) => {
        this.emailAddressesSubject.next(emailAddressesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlRelationshipToClient(): void {
    this.contactDataService.loadDdlRelationshipToClient().subscribe({
      next: (ddlrelationshipToClientResponse) => {
        this.ddlrelationshipToClientSubject.next(
          ddlrelationshipToClientResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadFriendsorFamily(): void {
    this.contactDataService.loadFriendsorFamily().subscribe({
      next: (friendsOrFamilyResponse) => {
        this.friendsOrFamilySubject.next(friendsOrFamilyResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  save(): Observable<boolean> {
    //TODO: save api call   
    return of(true);
  }

  loadContactInfo(clientId: number, clientCaseEligibilityId: string) {
    return this.contactDataService.loadContactInfo(clientId, clientCaseEligibilityId);
  }

  createContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    return this.contactDataService.createContactInfo(clientId, clientCaseEligibilityId, contactInfo);
  }

  updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    return this.contactDataService.updateContactInfo(clientId, clientCaseEligibilityId, contactInfo);
  }
}
