/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnInit, ElementRef, ChangeDetectorRef, } from '@angular/core';
/** Facades **/
import { IncomeFacade, IncomeTypeCode} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Validators, FormGroup, FormControl, } from '@angular/forms';
import { SnackBar,StatusFlag } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { Lov, LovFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
import { LoaderService, SnackBarNotificationType,ConfigurationProvider } from '@cms/shared/util-core';
import { DomSanitizer } from '@angular/platform-browser';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeDetailComponent implements OnInit {

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

    /** Output properties **/
  @Output() public sendDetailToIncomeList = new EventEmitter<any>();
  @Output() public loadIncomeList = new EventEmitter<any>();
  @Output() public closePopup = new EventEmitter<any>();
  @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();

    /** Public properties **/
  isIncomeDetailsPopupOpen = false;
  proofOfIncomeFiles: any;
  proofOfIncomeValidator: boolean = false;
  proofOfIncomeValidatorSize: boolean = false;
  noProofOfIncomeFlag!: StatusFlag;
  currentDate = new Date();
  isRemoveIncomeConfirmationPopupOpened = false;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  btnDisabled = false;
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
  insuranceStartDateIsLessThanEndDate: boolean = true;
  employers$ = this.incomeFacade.employers$;
  notApplicableId:any;
  NotApplicable = "Not Applicable";
  setNotApplicable:boolean = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  isAddNewEmployerOpen : boolean = false;
  public IncomeDetailsFormData: { incomeAmount: number } = {
    incomeAmount: 0,
  };
  incomeTypeDateLabel:any = 'Income Start Date';
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
    employerId : new FormControl(''),
  });

  /** Constructor **/
  constructor(
    private readonly elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private readonly incomeFacade: IncomeFacade,
    private lov: LovFacade,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade,
    private intl: IntlService,
    private readonly cdr: ChangeDetectorRef
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

    this.employers$.subscribe((response:any)=>{
      if(this.setNotApplicable){
        this.notApplicableId =response[0].employerId;   
        this.IncomeDetailsForm.controls['employerId'].setValue(this.notApplicableId);
        this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
      }
    })
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

  loadIncomeListGrid(event: any) {
    this.loadIncomeList.emit(true);

  }

  loadEmployers(employerName: any){

    if (!employerName || employerName.length == 0) {
      return;
    }
    this.incomeFacade.loadEmployers(employerName);
  }
  loadProofOfIncomeTypes(proofIncomeTypeStatus: boolean = false) {
    let incomeTypeEmployerRequired = ['W','SE','OI'];
    if(incomeTypeEmployerRequired.filter((x:any) => x === this.IncomeDetailsForm.controls['incomeTypeCode'].value).length === 0){
      this.setNotApplicable = true;      
      this.loadEmployers(this.NotApplicable);
      this.IncomeDetailsForm.controls['employerId'].disable();
      this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
    }
    else
    {
      if(this.setNotApplicable)
      {
        this.IncomeDetailsForm.controls['employerId'].setValue(null);
        this.IncomeDetailsForm.controls['employerId'].enable();
        this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
      }
      this.setNotApplicable = false;
    }
    switch (this.IncomeDetailsForm.controls['incomeTypeCode'].value.toUpperCase()) {
      case IncomeTypeCode.Work:
        this.incomeTypeDateLabel = 'Date of Hire (Default)';
        break;
      case IncomeTypeCode.UnemploymentInsurance:
      case IncomeTypeCode.ShortLongtermDisability:
      case IncomeTypeCode.AlimonyChildSupport:
      case IncomeTypeCode.OtherIncome:
        this.incomeTypeDateLabel = 'Initial Payment Received';
        break;
      case IncomeTypeCode.SupplementalSecurityIncome:
      case IncomeTypeCode.SocialSecurityDisabilityInsurance:
        this.incomeTypeDateLabel = 'Effective Start Date';
        break;
      case IncomeTypeCode.SelfEmployment:
      case IncomeTypeCode.RentalIncome:
        this.incomeTypeDateLabel = 'Tax Year';
        break;
      default: this.incomeTypeDateLabel = 'Income Start Date';
        break;
    }
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
        next: (response: any) => {
          if (response) {     
            this.incomeFacade.employerSubject.next(response);
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
      const validGuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      let incomeData = this.IncomeDetailsForm.value;
      if(!validGuidRegex.test(this.IncomeDetailsForm.controls['employerId'].value)){
        incomeData['employerName'] =this.IncomeDetailsForm.controls['employerId'].value;
        incomeData['employerId'] = null;       
      }
      else{
        incomeData['employerId'] = this.IncomeDetailsForm.controls['employerId'].value;
      }
      incomeData['clientCaseEligibilityId'] = this.clientCaseEligibilityId;
      incomeData['clientId'] = this.clientId;
      incomeData['clientCaseId'] = this.clientCaseId;
      incomeData['incomeStartDate'] = this.intl.formatDate(this.IncomeDetailsForm.controls['incomeStartDate'].value, this.dateFormat);
      incomeData['incomeEndDate'] = this.intl.formatDate(this.IncomeDetailsForm.controls['incomeEndDate'].value, this.dateFormat);

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
              this.loadIncomeList.next(true);
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
              this.loadIncomeList.next(true);
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

    let incomeTypeEmployerRequired = ['W','SE','OI'];
    if(incomeTypeEmployerRequired.filter((x:any) => x === this.IncomeDetailsForm.controls['incomeTypeCode'].value).length > 0){
      this.IncomeDetailsForm.controls['employerId'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
    }
    else{
      this.loadEmployers(this.NotApplicable);
      this.IncomeDetailsForm.controls['employerId'].removeValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
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

  changeMinDate() {
    this.startDate = this.IncomeDetailsForm.controls['incomeStartDate'].value;
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
  }
  endDateOnChange() {
    this.insuranceStartDateIsLessThanEndDate = true;
    if (this.IncomeDetailsForm.controls['incomeStartDate'].value === null) {
      this.IncomeDetailsForm.controls['incomeStartDate'].markAllAsTouched();
      this.IncomeDetailsForm.controls['incomeStartDate'].setValidators([Validators.required]);
      this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
      this.IncomeDetailsForm.controls['incomeEndDate'].setErrors({ 'incorrect': true });
      this.insuranceStartDateIsLessThanEndDate = false;
    }
    else if (this.IncomeDetailsForm.controls['incomeEndDate'].value !== null &&
    this.IncomeDetailsForm.controls['incomeEndDate'].value !== '') {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.IncomeDetailsForm.controls['incomeStartDate'].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.IncomeDetailsForm.controls['incomeEndDate'].value
        )
      );

      if (startDate < endDate) {   
        this.IncomeDetailsForm.controls['incomeEndDate'].setErrors(null);
        this.IncomeDetailsForm.controls['incomeStartDate'].setErrors(null);     
        this.insuranceStartDateIsLessThanEndDate = true;
      }
      else {
        this.IncomeDetailsForm.controls['incomeEndDate'].setErrors({ 'incorrect': true });
        this.IncomeDetailsForm.controls['incomeStartDate'].setErrors({ 'incorrect': true });
        this.insuranceStartDateIsLessThanEndDate = false;
        this.startDate = this.IncomeDetailsForm.controls['incomeStartDate'].value;
      }
    }
  }
  endDateValueChange(date: Date) {
    this.insuranceStartDateIsLessThanEndDate = true;
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();

  }
  startDateOnChange() {
    if (this.IncomeDetailsForm.controls['incomeEndDate'].value !== null) {
      this.endDateOnChange();
    }    
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
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
    this.IncomeDetailsForm.controls['employerId'].setValue(this.selectedIncome.employerId);
    this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
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

  addNewEmployerPopUpOpen(): void {
    this.isAddNewEmployerOpen = true;
  }
  addNewEmployerPopUpClose(event: any = null): void {
    this.isAddNewEmployerOpen = false;
  }
  addEmployer(employerName: string) {
    this.incomeFacade.showLoader();
    this.incomeFacade.addEmployer(employerName).subscribe({
      next: (response: any) => {
        if (response) {
          this.incomeFacade.hideLoader();
          if (response.status === 2) {
            this.incomeFacade.errorShowHideSnackBar(
              response.message,
            );
          }
          else {            
            this.incomeFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Employer added successfully.'
            );
            let employers = [];
            employers.push(response);
            this.incomeFacade.employerSubject.next(employers);
            this.IncomeDetailsForm.controls['employerId'].setValue(response.employerId);
            this.IncomeDetailsForm.controls['employerId'].updateValueAndValidity();
            this.addNewEmployerPopUpClose();
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) => {
        this.incomeFacade.hideLoader();
        this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    })
  }
}
