/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription, first, catchError, tap } from 'rxjs';
/** Internal Libraries **/
import { VerificationFacade, NavigationType, WorkflowFacade, EsignFacade, VerificationStatusCode } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { UserDataService } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  hivVerificationForm!: FormGroup;
  sessionId!: string;
  clientCaseId!: string;
  clientId!: number;
  userId!: any;
  clientCaseEligibilityId: any
  private loadSessionSubscription!: Subscription;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  saveForLaterClickSubscription !: Subscription;
  clientHivVerification: any;
  isNotUploaded = true;
  alreadyUploaded = false;
  showAttachmentOptions = true;
  healthCareProviderExists: boolean = false;
  isCaseManagerExists: boolean = false;
  providerEmail!: string;
  emailSentDate?: any = null;
  loginUserName!: any;
  loginUserId!: any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  errorMessage!: string;
  isSendEmailFailed: boolean = false;
  isSendEmailClicked: boolean = false;
  workflowTypeCode: any;
  isProviderAvailable: boolean = false;
  isHealthCareValid = true;
  currentHivUploadedDocument:any;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private verificationFacade: VerificationFacade, private formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef, private workFlowFacade: WorkflowFacade,
    private route: ActivatedRoute, private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly router: Router,
    private readonly esignFacade: EsignFacade,
    private readonly intl: IntlService,
    private readonly userDataService: UserDataService,
    private readonly configurationProvider: ConfigurationProvider,
    private elementRef: ElementRef
  ) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.buildForm();
    this.addSaveForLaterSubscription();
    this.addSaveSubscription();
    this.verificationFacade.isSaveandContinue$.subscribe(response => {
      this.isNotUploaded = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.showAttachmentOptions$.subscribe(response => {
      this.showAttachmentOptions = response;
      this.cdr.detectChanges();
    });
    this.verificationFacade.hivVerificationSave$.subscribe(data => {
      this.load();
    });

    this.getLoggedInUserProfile();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  /** Private Methods **/
  private buildForm() {
    this.hivVerificationForm = this.formBuilder.group({
      providerEmailAddress: [''],
      providerOption: [''],
      attachmentType: [''],
      verificationStatusDate: [''],
      requestedUserName: [''],
      userId: [''],
      clientsAttachment: [],
      computerAttachment: []
    });

  }
  private addSaveSubscription(): void {     
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved ]) => {
      if (isSaved) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'HIV Verification status updated')
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
    
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      this.validateForm();
      if (this.hivVerificationForm.valid) {
        this.save().subscribe((response: any) => {
          if (response) {
            this.workflowFacade.saveForLaterCompleted(true) 
            this.loaderService.hide();
          }
        })
      }
      else {
        this.workflowFacade.saveForLaterCompleted(true) 
      }
    });
  }

  private loadSessionData() {
    this.verificationFacade.showLoader();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session && session?.sessionData) {
          this.clientCaseId = JSON.parse(session.sessionData)?.ClientCaseId
          this.clientId = JSON.parse(session.sessionData)?.clientId ?? this.clientId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.verificationFacade.getClientHivDocuments(this.clientId);
          this.checkCaseManagerAndHealthCareProviderExists(false);
          this.cdr.detectChanges();
        }
      });
    this.verificationFacade.hideLoader();
  }



  checkCaseManagerAndHealthCareProviderExists(event: any) {
    this.loaderService.show();
    const caseManagerAndProvider = forkJoin({
      caseManager: this.caseManagerExists(),
      healthCareProvider: this.HealthCareProviderExists()
    });

    caseManagerAndProvider.subscribe((response: any) => {
      if (response) {
        //case manager check.
        if (response.caseManager != null) {
          this.isCaseManagerExists=true;
          this.elementRef.nativeElement.querySelector('#CASE_MANAGER').disabled = false;
        } else {
          this.isCaseManagerExists=false;
          this.elementRef.nativeElement.querySelector('#CASE_MANAGER').disabled = true;
        }

        //health care provider check.
        if (response.healthCareProvider) {
          const items = response.healthCareProvider["items"];
          if (items.length > 0) {
            this.healthCareProviderExists = true;
            items.forEach((item: any) => {
              this.providerEmail = item?.emailAddress;
            });
          } else {
            this.healthCareProviderExists = false;
          }
          if (!this.healthCareProviderExists && this.elementRef.nativeElement.querySelector('#HEALTHCARE_PROVIDER') != null) {
            this.elementRef.nativeElement.querySelector('#HEALTHCARE_PROVIDER').disabled = true;
          } else {
            if (this.elementRef.nativeElement.querySelector('#HEALTHCARE_PROVIDER') != null) {
              this.elementRef.nativeElement.querySelector('#HEALTHCARE_PROVIDER').disabled = false;
            }
          }
        }
        this.loaderService.hide();
        this.load();

      }
    })

  }

  caseManagerExists() {
    return this.verificationFacade.getHivCaseWorker(this.clientId).pipe(
      catchError((error: any) => {
        if (error) {
          this.verificationFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(false);
        }
        return of(false);
      })
    );
  }

  HealthCareProviderExists() {
    return this.verificationFacade.loadHealthCareProviders(this.clientId, 0, 10, '', 'asc', false).pipe(
      catchError((error: any) => {
        if (error) {
          this.verificationFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(false);
        }
        return of(false);
      })
    );

  }

  private load() {
    this.loaderService.show();
    this.verificationFacade.getHivVerificationWithAttachment(this.clientId, this.clientCaseEligibilityId).subscribe({
      next: (data) => {
        if (data?.clientHivVerificationId) {
          this.hivVerificationForm.controls["providerOption"].setValue(data?.verificationMethodCode);
          this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
          if (data?.verificationMethodCode === "HEALTHCARE_PROVIDER" && !this.healthCareProviderExists) {
            this.hivVerificationForm.controls["providerOption"].setValue("");
          }
          if (data?.verificationMethodCode == "UPLOAD_ATTACHMENT") {
            this.verificationFacade.showAttachmentOptions.next(false);
            if (data?.hivVerification?.documentName) {
              this.verificationFacade.hivVerificationUploadedDocument.next(data);
              this.alreadyUploaded = true;
            }
            else {
              this.verificationFacade.hivVerificationUploadedDocument.next(undefined);
              this.alreadyUploaded = false;
            }
            if (data?.verificationStatusCode === VerificationStatusCode.Accept) {
              this.elementRef.nativeElement.querySelector('#CASE_MANAGER').disabled = true;
              this.elementRef.nativeElement.querySelector('#HEALTHCARE_PROVIDER').disabled = true;
            }
            this.cdr.detectChanges();
          }
          else if (data?.verificationMethodCode === 'HEALTHCARE_PROVIDER') {
            this.currentHivUploadedDocument = data;
            if (data?.hivVerification?.documentName) {
              this.verificationFacade.hivVerificationUploadedDocument.next(data);
              this.alreadyUploaded = true;
            }
            else {
              this.verificationFacade.hivVerificationUploadedDocument.next(undefined);
              this.alreadyUploaded = false;
            }
          }
          else {
            this.verificationFacade.showAttachmentOptions.next(true);
          }
        }
        else {
          this.verificationFacade.showAttachmentOptions.next(true);
          this.verificationFacade.hivVerificationUploadedDocument.next(undefined);
          this.verificationFacade.healthcareInvalidSubject.next(false);
        }

        this.loaderService.hide();
      },
      error: (error) => {
        if (error) {
          this.verificationFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.loaderService.hide();
        }
      }
    });
  }

  private save() { 
    this.validateForm();
    this.cdr.detectChanges();
    if (this.hivVerificationForm.valid) {
      this.loaderService.show()
      if (this.hivVerificationForm.controls["providerOption"].value == 'UPLOAD_ATTACHMENT' && this.isNotUploaded) {
        this.loaderService.hide()
        this.verificationFacade.isSaveandContinueSubject.next(true);
        return of(true)
      }
      else if (this.hivVerificationForm.controls["providerOption"].value !== 'UPLOAD_ATTACHMENT') {
        let hivVerification = {'verificationMethodCode': this.hivVerificationForm.controls["providerOption"].value,
          'clientId':this.clientId, 'clientCaseEligibilityId': this.clientCaseEligibilityId};
        this.clientHivVerification = hivVerification;
        return this.saveHivVerification()
      }
      else{
        return this.saveHivVerification()
      }
      
    }
    return of(false)
  }

  private validateForm() {
    this.hivVerificationForm.markAllAsTouched();
    this.hivVerificationForm.controls["providerOption"].setValidators([Validators.required])
    this.hivVerificationForm.controls["providerOption"].updateValueAndValidity();
    if (this.hivVerificationForm.controls['providerOption'].value == 'UPLOAD_ATTACHMENT') {
      this.validateUploadAttachemnt();
      this.verificationFacade.formChangeEventSubject.next(true);
    }
    else {
      this.resetValidations();
    }

    this.hivVerificationForm.updateValueAndValidity();
  }

  onAttachmentConfirmationEvent(event: any) {
    this.clientHivVerification = event;
  }
  private saveHivVerification() {
    return this.verificationFacade.saveHivVerification(this.clientHivVerification)
      .pipe(
        catchError((error: any) => {
          if (error) {
            this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error)
            this.verificationFacade.healthcareInvalidSubject.next(true);
            return of(false);
          }
          this.verificationFacade.healthcareInvalidSubject.next(true);
          return of(false);
        }),

      )
  }
  validateUploadAttachemnt() {
    if (this.showAttachmentOptions) {
      this.hivVerificationForm.controls["attachmentType"].setValidators([Validators.required])
      this.hivVerificationForm.controls["attachmentType"].updateValueAndValidity();
    }
    if (this.hivVerificationForm.controls['attachmentType'].value == 'Attach From Client Attachments') {
      this.hivVerificationForm.controls["clientsAttachment"].setValidators([Validators.required])
      this.hivVerificationForm.controls["clientsAttachment"].updateValueAndValidity();
    }
    if (this.hivVerificationForm.controls['attachmentType'].value == 'Attach From Computer') {
      this.hivVerificationForm.controls["computerAttachment"].setValidators([Validators.required])
      this.hivVerificationForm.controls["computerAttachment"].updateValueAndValidity();
    }
  }
  resetValidations() {
    this.hivVerificationForm.controls["clientsAttachment"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['clientsAttachment'].updateValueAndValidity();
    this.hivVerificationForm.controls["computerAttachment"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['computerAttachment'].updateValueAndValidity();
    this.hivVerificationForm.controls["attachmentType"].removeValidators(Validators.required);
    this.hivVerificationForm.controls['attachmentType'].updateValueAndValidity();
  }

  getLoggedInUserProfile() {
    this.verificationFacade.showLoader();
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.loginUserName = profile[0]?.firstName + ' ' + profile[0]?.lastName;
        this.loginUserId = profile[0].loginUserId;
      }
    })
    this.verificationFacade.hideLoader();
  }
}
