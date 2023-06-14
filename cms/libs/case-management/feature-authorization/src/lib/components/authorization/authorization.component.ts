/** Angular **/
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** Enums **/
import { AuthorizationApplicationSignature, AuthorizationFacade, ClientDocumentFacade, CommunicationEvents, ContactFacade, NavigationType, ScreenType, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';
import { IntlService, format, formatDate } from '@progress/kendo-angular-intl';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { BehaviorSubject, Subscription, forkJoin, mergeMap, of, tap } from 'rxjs';

@Component({
  selector: 'case-management-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {
  @Input() isCerForm: boolean = false;
  // @Input() clientId!: any;
  @Input() clientCaseEligibilityId!: any;
  @Input() templateNotice$ : any
  @Output() loadAuthorizationData = new EventEmitter();
  @Output() saveAuthorizationData = new EventEmitter<any>();
  @Output() loadAuthorizationNotice = new EventEmitter();
  // applicationSignedDate!: Date;
  // dateSignatureNoted: string = '';
  copyOfSignedApplication: any;
  uploadedCopyOfSignedApplication: any;

  /** Public properties **/
  currentDate = new Date();
  invalidSignatureDate$ = new BehaviorSubject(false);
  showCopyOfSignedApplicationRequiredValidation = new BehaviorSubject(false);
  showCopyOfSignedApplicationSizeValidation = new BehaviorSubject(false);
  documentTypeCode!: string;
  screenName = ScreenType.Authorization;
  isPrintClicked!: boolean;
  isSendEmailClicked!: boolean;
  isSendNewLetterPopupOpened = false;
  isSendNewEmailPopupOpened = false;
  isAuthorizationNoticePopupOpened = false;
  formUiStyle: UIFormStyle = new UIFormStyle();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  authorizationForm!: FormGroup;
  authApplicationSignatureDetails$ = this.authorizationFacade.authApplicationSignatureDetails$;
  signedApplication!: AuthorizationApplicationSignature;
  private saveClickSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;

  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly loggingService: LoggingService,
    private readonly contactFacade: ContactFacade,
    private readonly intl: IntlService,
    private readonly ref: ChangeDetectorRef,
    private readonly userDataService: UserDataService,
    private readonly authorizationFacade: AuthorizationFacade,
    private readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
  ) { }



  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addApplicationSignatureDetailsSubscription();
    this.addSaveSubscription();
    this.addSignedDateSubscription();
    this.addDiscardChangesSubscription();

  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  /* Private methods */
  private buildForm() {
    this.authorizationForm = new FormGroup({
      applicantSignedDate: new FormControl(''),
      signatureNotedDate: new FormControl({ value: '', disabled: true }, { validators: Validators.required }),
    });
  }

  private addApplicationSignatureDetailsSubscription() {
    this.authApplicationSignatureDetails$.subscribe((resp: AuthorizationApplicationSignature) => {
      if (resp?.applicantSignedDate) {
        this.signedApplication = resp;
        this.authorizationForm?.get('applicantSignedDate')?.patchValue(new Date(resp?.applicantSignedDate));
        var signatureNotedDate = resp?.signatureNotedDate ? formatDate(new Date(resp?.signatureNotedDate), 'MM-dd-yyyy') : '';
        this.authorizationForm?.get('signatureNotedDate')?.patchValue(signatureNotedDate);
        if (resp.signedApplication) {
          this.copyOfSignedApplication = [
            {
              name: resp?.signedApplication?.documentName,
              size: resp?.signedApplication?.documentSize,
              src: resp?.signedApplication?.documentPath,
              uid: resp?.signedApplication?.documentId,
              documentId: resp?.signedApplication?.documentId,
            },
          ];
        }
      }
    })
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => { this.workflowFacade.disableSaveButton(); this.loaderService.show(); }),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe({
      next: ([navigationType, isSaved]) => {
        if (!isSaved) {
          this.workflowFacade.enableSaveButton();
          this.loaderService.hide();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
      },
    });
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
      if (response) {
        this.authorizationForm.reset();
        this.reSetValidations();
        this.loadAuthorizationData.emit();
      }
    });
  }

  private save() {
    const isValid = this.validate();
    if (isValid) {
      const authorization = {
        clientCaseEligibilityId: this.clientCaseEligibilityId,
        applicantSignedDate: this.intl.formatDate(this.authorizationForm?.get('applicantSignedDate')?.value, this.dateFormat),
        signatureNotedDate: this.intl.formatDate(new Date(this.authorizationForm?.get('signatureNotedDate')?.value), this.dateFormat),
        signedApplicationDocument: this.uploadedCopyOfSignedApplication,
        signedApplication: {}
      }

      if (this.uploadedCopyOfSignedApplication) {
        var documentId = this.copyOfSignedApplication.length > 0 ? (this.copyOfSignedApplication[0]?.uid ?? null) : null;
        authorization.signedApplication = {
          documentId: documentId,
          documentName: this.uploadedCopyOfSignedApplication.name,
          documentSize: this.uploadedCopyOfSignedApplication.size,
          documentTypeCode: this.documentTypeCode,
        }
      }

      this.saveAuthorizationData.emit(authorization);
      return of(true);
    }

    return of(false);
  }

  private validate() {
    let isValid = true;
    this.reSetValidations();
    const applicationSignedDate = this.authorizationForm?.get('applicantSignedDate');
    applicationSignedDate?.setValidators(Validators.required);
    applicationSignedDate?.updateValueAndValidity();
    const isLargeFile = (this.uploadedCopyOfSignedApplication?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    if (applicationSignedDate?.value > new Date()) {
      this.invalidSignatureDate$.next(true);
      isValid = false;
    }
    if (!this.uploadedCopyOfSignedApplication && !this.copyOfSignedApplication) {
      this.showCopyOfSignedApplicationRequiredValidation.next(true);
      isValid = false;
    }
    else if (isLargeFile) {
      this.showCopyOfSignedApplicationSizeValidation.next(true);
      isValid = false;
    }

    return isValid && this.authorizationForm.valid;
  }

  private reSetValidations() {
    this.invalidSignatureDate$.next(false);
    this.showCopyOfSignedApplicationRequiredValidation.next(false);
    this.showCopyOfSignedApplicationSizeValidation.next(false);
    this.authorizationForm?.get('applicantSignedDate')?.setValidators(null);
    this.authorizationForm?.get('applicantSignedDate')?.updateValueAndValidity();
  }

  /** Internal event methods **/
  onSendNewLetterClicked() {
    this.isSendNewLetterPopupOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailPopupOpened = true;
  }

  onCloseAuthorizationNoticeClicked() {
    this.isAuthorizationNoticePopupOpened = false;
  }

  onAuthorizationNoticeClicked() {
    this.loadAuthorizationNotice.emit()
    this.isAuthorizationNoticePopupOpened = true;
  }

  addSignedDateSubscription() {
    this.authorizationForm?.get('applicantSignedDate')?.valueChanges?.subscribe((value: Date) => {
      if (value) {
        const today = new Date();
        this.authorizationForm?.get('signatureNotedDate')?.setValue(formatDate(today, 'MM-dd-yyyy'));
        this.invalidSignatureDate$.next(value > today);
      }
    })
  }

  /** External event methods **/
  handleCloseSendNewEmailClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendNewEmailPopupOpened = false;
        break;
      case CommunicationEvents.Print:
        this.isSendNewEmailPopupOpened = false;
        this.isSendEmailClicked = true;
        break;
      default:
        break;
    }
  }

  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendNewLetterPopupOpened = false;
        break;
      case CommunicationEvents.Print:
        this.isSendNewLetterPopupOpened = false;
        this.isPrintClicked = true;
        break;
      default:
        break;
    }
  }

  handleTypeCodeEvent(e: any) {
    this.documentTypeCode = e;
  }

  handleFileSelected(e: SelectEvent) {
    this.uploadedCopyOfSignedApplication = e.files[0].rawFile;
    this.showCopyOfSignedApplicationRequiredValidation.next(false);
    const isLargeFile = (this.uploadedCopyOfSignedApplication?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    this.showCopyOfSignedApplicationSizeValidation.next(isLargeFile);

  }

  handleFileRemoved(e: SelectEvent) {
    this.showCopyOfSignedApplicationRequiredValidation.next(false);
    this.showCopyOfSignedApplicationSizeValidation.next(false);
    if (this.copyOfSignedApplication !== undefined && this.copyOfSignedApplication[0]?.uid) {
      this.loaderService.show();
      this.clientDocumentFacade.removeDocument(this.signedApplication?.signedApplication?.documentId ?? '').subscribe({
        next: (response) => {
          if (response === true) {
            this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Copy of Signed Application Removed Successfully!")
            this.copyOfSignedApplication = undefined;
            this.uploadedCopyOfSignedApplication = undefined;
            this.signedApplication.signedApplication = undefined;
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
      this.copyOfSignedApplication = undefined;
      this.loaderService.hide();
    }

  }

  get authForm() { return this.authorizationForm.controls as any; }
}
