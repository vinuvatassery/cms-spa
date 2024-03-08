/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnInit, ElementRef, } from '@angular/core';
/** Facades **/
import { IncomeFacade, IncomeTypeCode,ClientDocumentFacade } from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Validators, FormGroup, FormControl, } from '@angular/forms';
import { SnackBar,StatusFlag } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { Lov, LovFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType,ConfigurationProvider } from '@cms/shared/util-core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'case-management-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeDetailComponent implements OnInit {
  btnDisabled = false;
  public uploadRemoveUrl = 'removeUrl';
  public uploadedIncomeFile: any[] = [];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions =
    new UploadFileRistrictionOptions();
  /** Input properties **/
  @Input() isEditValue!: boolean;
  @Input() clientCaseEligibilityId: string = '';
  @Input() clientId: string = '';
  @Input() clientCaseId: string = '';
  @Input() selectedIncome: any;
  isRemoveIncomeConfirmationPopupOpened = false;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  @Output() public sendDetailToIncomeList = new EventEmitter<any>();
  @Output() public closePopup = new EventEmitter<any>();
  @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
  isIncomeDetailsPopupOpen = false;
  proofOfIncomeFiles: any;
  proofOfIncomeValidator: boolean = false;
  proofOfIncomeValidatorSize: boolean = false;
  noProofOfIncomeFlag!: StatusFlag;
  currentDate = new Date();
  /** Public properties **/
  incomeTypes$: Lov[] = [];
  incomeSources$: Lov[] = [];
  frequencies$: Lov[] = [];
  proofOfIncomeTypes$: Lov[] = [];
  hasNoProofOfIncome = false;
  tareaJustificationCounter!: string;
  tareaJustification = '';
  tareaJustificationCharachtersCount!: number;
  tareaJustificationMaxLength = 300;
  startDate!:any;
  incomeTypesOther = '';
  documentTypeCode!: string;
  public IncomeDetailsFormData: { incomeAmount: number } = {
    incomeAmount: 0,
  };
  public IncomeDetailsForm: FormGroup = new FormGroup({
    incomeSourceCode: new FormControl('', []),
    incomeTypeCode: new FormControl('', []),
    incomeAmt: new FormControl('', []),
    incomeFrequencyCode: new FormControl('', []),
    incomeStartDate: new FormControl('', []),
    incomeEndDate: new FormControl('', []),
    noIncomeProofFlag: new FormControl('', []),
    noProofOfIncome: new FormControl('', []),
    incomeNote: new FormControl('', []),
    proofIncomeTypeCode: new FormControl('', []),
    otherDesc: new FormControl('', []),
  });

  /** Constructor **/
  constructor(
    private readonly elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private readonly incomeFacade: IncomeFacade,
    private lov: LovFacade,
    private readonly loaderService: LoaderService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly configurationProvider: ConfigurationProvider,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomeTypes();
    this.tareaJustificationWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();

    if (this.isEditValue) {
      this.loaderService.show();
      this.loadIncomeDetails();
    } else {
      this.selectedIncome = [];
    }
  }

  /** Private methods **/
  private tareaJustificationWordCount() {
    this.tareaJustificationCharachtersCount = this.tareaJustification
      ? this.tareaJustification.length
      : 0;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  private loadIncomeTypes() {
    this.lov.incomeTypelov$.subscribe((incomeTypesLov: Lov[]) => {
      this.incomeTypes$ = incomeTypesLov;
    });
  }

  private loadIncomeSources() {
    this.lov.incomeSourcelov$.subscribe((incomeSourceLov: Lov[]) => {
      this.incomeSources$ = incomeSourceLov;
    });
  }

  private loadFrequencies() {
    this.lov.incomeFrequencylov$.subscribe((incomeFrequencyLov: Lov[]) => {
      this.frequencies$ = incomeFrequencyLov;
    });
  }

  loadProofOfIncomeTypes(proofIncomeTypeStatus: boolean = false) {
    if(proofIncomeTypeStatus)
    {
      this.IncomeDetailsForm.controls[
        'proofIncomeTypeCode'
      ].setValue(null);
    }
    if (
      this.IncomeDetailsForm.controls['incomeTypeCode'].value != null &&
      this.IncomeDetailsForm.controls['incomeTypeCode'].value != ''
    ) {
      let incomeType = this.IncomeDetailsForm.controls['incomeTypeCode'].value;
      if(this.IncomeDetailsForm.controls['incomeTypeCode'].value === IncomeTypeCode.SocialSecurityDisabilityInsurance)
      {
        incomeType = IncomeTypeCode.SupplementalSecurityIncome;
      }
      this.lov
        .getProofOfIncomeTypesLov(
          incomeType
        )
        .subscribe((proofOfIncomeTypesLov: Lov[]) => {
          this.proofOfIncomeTypes$ = proofOfIncomeTypesLov;
          this.IncomeDetailsForm.controls[
            'proofIncomeTypeCode'
          ].updateValueAndValidity();
        });
    }
  }

  // loading Income detail based on id service call
  loadIncomeDetails() {
    this.incomeFacade
      .loadIncomeDetails(this.clientId, this.selectedIncome.clientIncomeId)
      .subscribe({
        next: (response) => {
          if (response) {
            this.loadingIncomeDetailsIntoForm(response);
            this.loaderService.hide();
          }
        },
        error: (err) => {
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
  /** Internal event methods **/
  onTareaJustificationValueChange(event: any): void {
    this.tareaJustificationCharachtersCount = event.length;
    this.tareaJustificationCounter = `${this.tareaJustificationCharachtersCount}/${this.tareaJustificationMaxLength}`;
  }

  onProofOfIncomeValueChanged() {
    this.hasNoProofOfIncome = !this.hasNoProofOfIncome;
    this.onProofofIncomeValueChangedUpdated(this.hasNoProofOfIncome);
  }

  onProofofIncomeValueChangedUpdated(hasNoProofOfIncomeStatus: any) {
    if (hasNoProofOfIncomeStatus) {
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValidators([]);
      this.IncomeDetailsForm.controls[
        'proofIncomeTypeCode'
      ].updateValueAndValidity();
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue('Y');
      this.proofOfIncomeValidator = false;
    } else {
      this.loadProofOfIncomeTypes();
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue('N');
    }
  }
  selectProofOfIncome(): void {
    this.incomeTypesOther =
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].value;
  }
  public submitIncomeDetailsForm(): void {
    this.setValidators();
    if (this.isEditValue) {
      this.onProofofIncomeValueChangedUpdated(this.hasNoProofOfIncome);
    }
    if (this.IncomeDetailsForm.valid && !this.proofOfIncomeValidator && !this.proofOfIncomeValidatorSize) {
      let incomeData = this.IncomeDetailsForm.value;
      incomeData['clientCaseEligibilityId'] = this.clientCaseEligibilityId;
      incomeData['clientId'] = this.clientId;
      incomeData['clientCaseId'] = this.clientCaseId;

      if (this.incomeTypesOther == 'O') {
        incomeData.otherDesc = this.IncomeDetailsForm.controls['otherDesc'].value;
      } else {
        incomeData.otherDesc = this.IncomeDetailsForm.controls['otherDesc'].value == null;
      }
      this.btnDisabled =true;
      if (!this.isEditValue) {

        this.incomeFacade.showLoader();
        this.incomeFacade
          .saveClientIncome(
            this.clientId,
            this.IncomeDetailsForm.value,
            this.proofOfIncomeFiles,
            this.documentTypeCode
          )
          .subscribe({
            next: (incomeResponse) => {
              this.incomeFacade.incomeValidSubject.next(true);
              this.incomeFacade.hideLoader();
              this.incomeFacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Income created successfully.'
              );
              this.sendDetailToIncomeList.next(true);
              this.closeIncomeDetailPoup();
            },
            error: (err) => {
              this.btnDisabled =false;
              this.incomeFacade.hideLoader();
              this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            },
          });
      }

      if (this.isEditValue) {
        this.incomeFacade.showLoader();
        incomeData['clientIncomeId'] = this.selectedIncome.clientIncomeId;
        incomeData['concurrencyStamp'] = this.selectedIncome.concurrencyStamp;
        incomeData['monthlyIncome'] = this.selectedIncome.monthlyIncome;
        if (this.selectedIncome.clientDocumentId != null) {
          incomeData['clientDocumentId'] = this.selectedIncome.clientDocumentId;
          incomeData['documentConcurrencyStamp'] =
            this.selectedIncome.documentConcurrencyStamp;
        }

        incomeData['activeFlag'] = this.selectedIncome.activeFlag;

        this.incomeFacade
          .editClientIncome(
            this.clientId,
            this.selectedIncome.clientIncomeId,
            this.IncomeDetailsForm.value,
            this.proofOfIncomeFiles,
            this.documentTypeCode
          )
          .subscribe({
            next: (incomeResponse) => {
              this.closeIncomeDetailPoup();
              this.incomeFacade.hideLoader();
              this.incomeFacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Income updated successfully.'
              );
              this.sendDetailToIncomeList.next(true);
              this.closeIncomeDetailPoup();
            },
            error: (err) => {
              this.btnDisabled = false;
              this.incomeFacade.hideLoader();
              this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            },
          });
      }
    }else{
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.IncomeDetailsForm, this.elementRef.nativeElement,null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
    }
  }
  closeIncomeDetailPoup(): void {
    this.IncomeDetailsForm.reset();
    this.closePopup.emit(this.isIncomeDetailsPopupOpen);
  }

  handleFileSelected(event: any) {
    this.proofOfIncomeFiles = null;
    this.proofOfIncomeValidatorSize=false;
    this.proofOfIncomeFiles = event.files[0].rawFile;
    this.proofOfIncomeValidator = false;
   if(this.proofOfIncomeFiles.size>this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.proofOfIncomeValidatorSize=true;
   }
  }

  handleFileRemoved(event: any) {
    this.proofOfIncomeFiles = null;
    this.documentTypeCode='';
  }
  handleTypeCodeEvent(e:any)
  {
    this.documentTypeCode=e;
  }

  // checking the validation
  setValidators() {
    this.IncomeDetailsForm.markAllAsTouched();
    this.IncomeDetailsForm.controls['incomeSourceCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeTypeCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeAmt'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeStartDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeNote'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeSourceCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeTypeCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeAmt'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeNote'].updateValueAndValidity();
    const endDate=this.IncomeDetailsForm.controls['incomeEndDate'].value;
    const startDate= this.IncomeDetailsForm.controls['incomeStartDate'].value;
    if(endDate<=startDate && this.IncomeDetailsForm.controls['incomeEndDate'].value ){
      this.IncomeDetailsForm.controls['incomeEndDate'].setErrors({'incorrect':true})
    }


    if (!this.hasNoProofOfIncome) {
      if (this.IncomeDetailsForm.controls['proofIncomeTypeCode'].value === 'O') {
        this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValidators([Validators.required,]);
        this.IncomeDetailsForm.controls['proofIncomeTypeCode'].updateValueAndValidity();
        this.IncomeDetailsForm.controls['otherDesc'].setValidators([  Validators.required,]);
        this.IncomeDetailsForm.controls['otherDesc'].updateValueAndValidity();
      }
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls[
        'proofIncomeTypeCode'
      ].updateValueAndValidity();

      if (!this.proofOfIncomeFiles) {
        this.proofOfIncomeValidator = true;
      } else {
        this.proofOfIncomeValidator = false;
      }
    }
  }

  // Binding income details to the form
  loadingIncomeDetailsIntoForm(response: any) {
    this.selectedIncome = response[0];
    this.IncomeDetailsForm.controls['incomeSourceCode'].setValue(this.selectedIncome.incomeSourceCode);
    this.IncomeDetailsForm.controls['incomeTypeCode'].setValue(this.selectedIncome.incomeTypeCode);
    this.IncomeDetailsForm.controls['incomeAmt'].setValue(this.selectedIncome.incomeAmt);
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].setValue(this.selectedIncome.incomeFrequencyCode);
    this.IncomeDetailsForm.controls['incomeStartDate'].setValue(new Date(this.selectedIncome.incomeStartDate));
    this.IncomeDetailsForm.controls['incomeEndDate'].setValue(this.selectedIncome.incomeEndDate != null ? new Date(this.selectedIncome.incomeEndDate) : null);
    this.IncomeDetailsForm.controls['incomeNote'].setValue(this.selectedIncome.incomeNote);
    this.IncomeDetailsForm.controls['incomeSourceCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeTypeCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeAmt'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeNote'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue('Y');
    if (this.selectedIncome?.noIncomeProofFlag === 'Y') {
      this.IncomeDetailsForm.controls['noProofOfIncome'].setValue(true);
      this.hasNoProofOfIncome =
        this.IncomeDetailsForm.controls['noProofOfIncome'].value;
    } else {
      this.IncomeDetailsForm.controls['noProofOfIncome'].setValue(false);
      this.hasNoProofOfIncome =
        this.IncomeDetailsForm.controls['noProofOfIncome'].value;
    }

    if (!this.hasNoProofOfIncome) {
      this.loadProofOfIncomeTypes();
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValue(this.selectedIncome.proofIncomeTypeCode);
      this.incomeTypesOther = this.selectedIncome.proofIncomeTypeCode;
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].updateValueAndValidity();
    }

    if (this.incomeTypesOther === 'O') {
      this.IncomeDetailsForm.controls['otherDesc'].setValue(this.selectedIncome.otherDesc);
      this.IncomeDetailsForm.controls['otherDesc'].updateValueAndValidity();
    }

    if (
      this.selectedIncome?.clientDocumentId &&
      this.selectedIncome?.documentName &&
      this.selectedIncome?.documentPath
    ) {
      this.proofOfIncomeValidator = false;
      this.proofOfIncomeFiles = true;
      this.uploadedIncomeFile = [
        {
          name: this.selectedIncome.documentName,
          src: this.selectedIncome.documentPath,
          uid: this.selectedIncome.clientDocumentId,
          size: this.selectedIncome?.documentSize,
          documentId: this.selectedIncome.clientDocumentId
        },
      ];
    }

  }



  onDeleteIncomeClicked() {
    this.isRemoveIncomeConfirmationPopupOpened = true;
  }
  onRemoveIncomeConfirmationClosed() {
    this.closeIncomeDetailPoup();
    this.isRemoveIncomeConfirmationPopupOpened = false;
  }

  incomeDeleteHandle(event: any) {
    if (event) {
      this.sendDetailToIncomeList.next(true);
      this.onRemoveIncomeConfirmationClosed();
    }
  }
}
