/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Contact, ContactInfo } from '../entities/contact';
/** Data services **/
import { ContactDataService } from '../infrastructure/contact.data.service';
import { LovFacade, ZipCodeFacade } from '@cms/system-config/domain'
import { catchError, of } from 'rxjs';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  /** Private properties **/
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private ddlCountriesSubject = new BehaviorSubject<any>([]);
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
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly zipCodeFacade: ZipCodeFacade
  ) { }

  /** Public methods **/
  loadDdlStates(): void {
    this.zipCodeFacade.getStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlCountries(stateCode: string): void {
    this.zipCodeFacade.getCounties(stateCode).subscribe({
      next: (ddlCountriesResponse) => {
        this.ddlCountriesSubject.next(ddlCountriesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlPreferredContactMethods(): void {
    this.contactDataService.loadDdlPreferredContactMethods().subscribe({
      next: (ddlPreferredContactMethodsResponse) => {
        this.ddlPreferredContactMethodsSubject.next(
          ddlPreferredContactMethodsResponse
        );
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadAddress(): void {
    this.contactDataService.loadAddresses().subscribe({
      next: (addressesResponse) => {
        this.addressesSubject.next(addressesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlAddressType(): void {
    this.contactDataService.loadDdlAddressTypes().subscribe({
      next: (ddlAddressTypesResponse) => {
        this.ddlAddressTypesSubject.next(ddlAddressTypesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadPhoneNumbers(): void {
    this.contactDataService.loadPhoneNumbers().subscribe({
      next: (phoneNumbersResponse) => {
        this.phoneNumbersSubject.next(phoneNumbersResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlPhoneType(): void {
    this.contactDataService.loadDdlPhoneTypes().subscribe({
      next: (ddlPhoneTypesResponse) => {
        this.ddlPhoneTypesSubject.next(ddlPhoneTypesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadEmailAddress(): void {
    this.contactDataService.loadEmailAddresses().subscribe({
      next: (emailAddressesResponse) => {
        this.emailAddressesSubject.next(emailAddressesResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
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
        this.loggingService.logException(err);
      },
    });
  }

  loadFriendsorFamily(): void {
    this.contactDataService.loadFriendsorFamily().subscribe({
      next: (friendsOrFamilyResponse) => {
        this.friendsOrFamilySubject.next(friendsOrFamilyResponse);
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadContactInfo(clientId: number, clientCaseEligibilityId: string) {
    return this.contactDataService.loadContactInfo(clientId, clientCaseEligibilityId);
  }

  createContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    return this.contactDataService.createContactInfo(clientId, clientCaseEligibilityId, contactInfo)
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

  updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    return this.contactDataService.updateContactInfo(clientId, clientCaseEligibilityId, contactInfo).pipe(
      catchError((err: any) => {
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
        }
        return of(false);
      })
    );
  }
}
