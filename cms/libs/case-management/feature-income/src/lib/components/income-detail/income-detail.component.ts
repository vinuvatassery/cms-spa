/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
/** Facades **/
import { IncomeFacade, StatusFlag } from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { Lov, LovFacade } from '@cms/system-config/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeDetailComponent implements OnInit {
  public uploadRemoveUrl = "removeUrl";
  public uploadedIncomeFile: any[] = [ ];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  /** Input properties **/
  @Input() isEditValue!: boolean;
  @Input() clientCaseEligibilityId: string = "";
  @Input() clientId: string = "";
  @Input() clientCaseId: string = "";
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
  incomeTypesOther = '';
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
    // incomeUploadedProof: new FormControl('', []),
    proofIncomeTypeCode: new FormControl('', []),
    otherProofOfIncome: new FormControl('', []),
  });


  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade, private lov: LovFacade, private readonly loaderService: LoaderService, private loggingService: LoggingService, private readonly notificationSnackbarService: NotificationSnackbarService,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {

    this.loadIncomeTypes();
    this.tareaJustificationWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();

    if(this.isEditValue){
      this.loadIncomeDetails();
    } else{
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

  loadProofOfIncomeTypes() {
    if (this.IncomeDetailsForm.controls['incomeTypeCode'].value != null && this.IncomeDetailsForm.controls['incomeTypeCode'].value != '') {
      this.lov.getProofOfIncomeTypesLov(this.IncomeDetailsForm.controls['incomeTypeCode'].value).subscribe((proofOfIncomeTypesLov: Lov[]) => {
        this.proofOfIncomeTypes$ = proofOfIncomeTypesLov;
        this.IncomeDetailsForm.controls['proofIncomeTypeCode'].updateValueAndValidity();
      });
    }
  }

    // loading employment detail based on emploerid
    loadIncomeDetails(){ 
      this.incomeFacade.loadIncomeDetails(this.selectedIncome.clientIncomeId).subscribe({
        next: (response) => {
   
          if (response) {
           
            this.loadingIncomeDetailsIntoForm(response);
          }
        },
        error: (err) => {
          console.log(err)
        },
      }
      );
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

  onProofofIncomeValueChangedUpdated(hasNoProofOfIncomeStatus: any){
    if (hasNoProofOfIncomeStatus) {
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValidators([]);
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].updateValueAndValidity();
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("Y");
      this.proofOfIncomeValidator = false;
    }
    else {
      this.loadProofOfIncomeTypes();
      this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("N");
    }
  }
  selectProofOfIncome(): void {
    this.incomeTypesOther = this.IncomeDetailsForm.controls['proofIncomeTypeCode'].value;

  }
  public submitIncomeDetailsForm(): void {
    this.setValidators();
    if(this.isEditValue){
      this.onProofofIncomeValueChangedUpdated(this.hasNoProofOfIncome);
      this.proofOfIncomeValidator = false;
    }
    if (this.IncomeDetailsForm.valid && !this.proofOfIncomeValidator) {

      let incomeData = this.IncomeDetailsForm.value 
      incomeData["clientCaseEligibilityId"] = this.clientCaseEligibilityId;
      incomeData["clientId"] = this.clientId;
      incomeData["clientCaseId"]=this.clientCaseId;
 
      if (this.incomeTypesOther == 'O') {
        incomeData.proofIncomeTypeCode = this.IncomeDetailsForm.controls['otherProofOfIncome'].value;
      }
     

      if(!this.isEditValue){ 
        this.incomeFacade.ShowLoader();
      this.incomeFacade.saveClientIncome(this.IncomeDetailsForm.value, this.proofOfIncomeFiles).subscribe({
        next: (incomeResponse) => {
          this.incomeFacade.loadIncomes(this.clientId, this.clientCaseEligibilityId);
          this.closeIncomeDetailPoup(); 
          this.incomeFacade.HideLoader();
          this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Income created successfully.')
        },
        error: (err) => { 
          this.incomeFacade.HideLoader();
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
    }

    if(this.isEditValue){

      this.incomeFacade.ShowLoader();
      incomeData["clientIncomeId"] = this.selectedIncome.clientIncomeId;
      incomeData["concurrencyStamp"]=this.selectedIncome.concurrencyStamp;
      incomeData["monthlyIncome"]=this.selectedIncome.monthlyIncome;
      if(this.selectedIncome.clientDocumentId != null){
        incomeData["clientDocumentId"]=this.selectedIncome.clientDocumentId; 
        incomeData["documentConcurrencyStamp"]=this.selectedIncome.documentConcurrencyStamp; 
      }
    
      incomeData["activeFlag"]=this.selectedIncome.activeFlag;
      this.incomeFacade.editClientIncome(this.IncomeDetailsForm.value, this.proofOfIncomeFiles).subscribe({
        next: (incomeResponse) => {
          this.incomeFacade.loadIncomes(this.clientId, this.clientCaseEligibilityId);
          this.closeIncomeDetailPoup(); 
          this.incomeFacade.HideLoader();
          this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Income updated successfully.') 
        },
        error: (err) => { 
          this.incomeFacade.HideLoader();
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR, err) 
        },
      });
    }
    }
  }
  closeIncomeDetailPoup(): void {
    this.IncomeDetailsForm.reset();
    this.closePopup.emit(this.isIncomeDetailsPopupOpen);
  }

  handleFileSelected(event: any) {
 
    this.proofOfIncomeFiles = event.files[0].rawFile
    this.proofOfIncomeValidator = false;
    console.log(this.proofOfIncomeFiles)
  }

  handleFileRemoved(event: any) {
    this.proofOfIncomeFiles = null;
    console.log(this.proofOfIncomeFiles)
  }
  setValidators() {
    this.IncomeDetailsForm.markAllAsTouched();
    this.IncomeDetailsForm.controls['incomeSourceCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeTypeCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeAmt'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeStartDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeEndDate'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeNote'].setValidators([Validators.required,]);
    this.IncomeDetailsForm.controls['incomeSourceCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeTypeCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeAmt'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeFrequencyCode'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
    this.IncomeDetailsForm.controls['incomeNote'].updateValueAndValidity();
    if (!this.hasNoProofOfIncome) {
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValidators([Validators.required,]);
      this.IncomeDetailsForm.controls['proofIncomeTypeCode'].updateValueAndValidity();

      if (!this.proofOfIncomeFiles) {
        this.proofOfIncomeValidator = true;
      }
      else {
        this.proofOfIncomeValidator = false;
      }
    }
  }
loadingIncomeDetailsIntoForm(response: any){
  this.selectedIncome = response[0];
  this.IncomeDetailsForm.controls['incomeSourceCode'].setValue(this.selectedIncome.incomeSourceCode);
  this.IncomeDetailsForm.controls['incomeTypeCode'].setValue(this.selectedIncome.incomeTypeCode);
  this.IncomeDetailsForm.controls['incomeAmt'].setValue(this.selectedIncome.incomeAmt);
  this.IncomeDetailsForm.controls['incomeFrequencyCode'].setValue(this.selectedIncome.incomeFrequencyCode);
  this.IncomeDetailsForm.controls['incomeStartDate'].setValue(new Date(this.selectedIncome.incomeStartDate));
  this.IncomeDetailsForm.controls['incomeEndDate'].setValue(new Date(this.selectedIncome.incomeEndDate));
  this.IncomeDetailsForm.controls['incomeNote'].setValue(this.selectedIncome.incomeNote);
  this.IncomeDetailsForm.controls['incomeSourceCode'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['incomeTypeCode'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['incomeAmt'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['incomeFrequencyCode'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['incomeStartDate'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['incomeEndDate'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['incomeNote'].updateValueAndValidity();
  this.IncomeDetailsForm.controls['noIncomeProofFlag'].setValue("Y");
  if(this.selectedIncome?.noIncomeProofFlag =="Y"){
    this.IncomeDetailsForm.controls["noProofOfIncome"].setValue(true);
    this.hasNoProofOfIncome = this.IncomeDetailsForm.controls["noProofOfIncome"].value;
  } else{
    this.IncomeDetailsForm.controls["noProofOfIncome"].setValue(false);
    this.hasNoProofOfIncome = this.IncomeDetailsForm.controls["noProofOfIncome"].value;
  }

  if (!this.hasNoProofOfIncome) {
    this.loadProofOfIncomeTypes();
    this.IncomeDetailsForm.controls['proofIncomeTypeCode'].setValue(this.selectedIncome.proofIncomeTypeCode);
    this.incomeTypesOther = this.selectedIncome.proofIncomeTypeCode;
    this.IncomeDetailsForm.controls['proofIncomeTypeCode'].updateValueAndValidity(); 
  }

  if (this.incomeTypesOther == 'O') {
    this.IncomeDetailsForm.controls['otherProofOfIncome'].setValue(this.selectedIncome.otherProofOfIncome);
    this.IncomeDetailsForm.controls['otherProofOfIncome'].updateValueAndValidity();
 
  }
 
  if( this.selectedIncome?.clientDocumentId  && this.selectedIncome?.documentName && this.selectedIncome?.documentPath){
    this.proofOfIncomeValidator = false;
    this.proofOfIncomeFiles = true;
    this.uploadedIncomeFile  = [
      { name: this.selectedIncome.documentName,
          src: this.selectedIncome.documentPath,
          uid: this.selectedIncome.clientDocumentId
      },
  ];
    
  }


}
  ShowHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.loaderService.hide();
  }
  onDeleteIncomeClicked(){
    this.isRemoveIncomeConfirmationPopupOpened = true;
  }
  onRemoveIncomeConfirmationClosed() {
    this.closeIncomeDetailPoup();
    this.isRemoveIncomeConfirmationPopupOpened = false;
}
}
