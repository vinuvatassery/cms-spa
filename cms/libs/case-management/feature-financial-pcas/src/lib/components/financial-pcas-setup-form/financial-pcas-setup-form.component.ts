/** External libraries **/
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';

/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { PcaDetails } from '@cms/case-management/domain';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cms-financial-pcas-setup-form',
  templateUrl: './financial-pcas-setup-form.component.html',
})

export class FinancialPcasSetupFormComponent implements OnInit, OnDestroy {

  /* Input Properties */
  @Input() pcaId?: string | null;
  @Input() fundingSourceLookup$: any;
  @Input() pcaData$ = new Observable<PcaDetails | null>();
  /* Output Properties */
  @Output() savePcaEvent = new EventEmitter<{ pcaId?: string | null, pcaDetails: PcaDetails }>();
  @Output() closeAddEditPcaSetupClickedEvent = new EventEmitter();

  /* Public properties */
  formUiStyle: UIFormStyle = new UIFormStyle();
  counter = '0/300';
  pcaForm !: FormGroup;
  pcaDetails!: PcaDetails;
  saveButtonText = 'Add';
  loader = false;
  private pcaDataSubscription!: Subscription;
  /* Constructor */
  constructor(private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider) {

  }

  /* Lifecycle Events */
  ngOnInit(): void {
    this.buildForm();
    this.initializePca();    
  }

  ngOnDestroy(): void {
    if (this.pcaId) {
      this.pcaDataSubscription.unsubscribe();
    }
  }

  /*Public methods */
  closeAddEditPcaSetupClicked() {
    this.closeAddEditPcaSetupClickedEvent.emit(true);
  }

  pcaDescChangeHandler(ev: string): void {
    const charactersCount = ev.length;
    this.counter = `${charactersCount}/300`;
  }

  savePca() {
    this.pcaForm.markAllAsTouched();
    const isOpenCloseDatesValid = this.validateOpenAndCloseDates();
    const isPcaValid = this.pcaForm?.valid && isOpenCloseDatesValid;
    if (isPcaValid) {
      this.pcaDetails = this.getPcaDetails();
      this.savePcaEvent.emit({ pcaId: this.pcaId, pcaDetails: this.pcaDetails });
    }
  }

  validateOpenAndCloseDates() {
    this.pcaFormControls?.openDate?.setErrors(Validators.required);
    this.pcaFormControls?.openDate?.updateValueAndValidity();
    this.pcaFormControls?.closeDate?.setErrors(Validators.required);
    this.pcaFormControls?.closeDate?.updateValueAndValidity();

    const openDate = this.pcaFormControls?.openDate?.value;
    const closeDate = this.pcaFormControls?.closeDate?.value;
    if (!openDate || !closeDate) {
      return false;
    }

    if (Date.parse(openDate) >= Date.parse(closeDate)) {
      this.pcaFormControls?.openDate.markAllAsTouched();
      this.pcaFormControls?.closeDate.markAllAsTouched();
      this.pcaFormControls?.openDate?.setErrors({ incorrect: true, message: 'Open date must be before close date' });
      this.pcaFormControls?.closeDate?.setErrors({ incorrect: true, message: 'Close date must be after open date' });
      return false;
    }

    return true;
  }

  get pcaFormControls() {
    return (this.pcaForm)?.controls as any;
  }

  /*Private methods */
  private initializePca() {
    this.saveButtonText = 'Add';
    if (this.pcaId) {
      this.configurePcaEditView();
    }
  }

  private buildForm() {    
    this.pcaForm = new FormGroup({
      pcaCode: new FormControl('', Validators.required),
      appropriationYear: new FormControl('', Validators.required),
      fundingSourceId: new FormControl('', Validators.required),
      pcaDesc: new FormControl('', Validators.required),
      openDate: new FormControl('', Validators.required),
      closeDate: new FormControl('', Validators.required),
      totalAmount: new FormControl('', Validators.required)
    });
  }

  private getPcaDetails() {
    return {
      pcaCode: this.pcaFormControls?.pcaCode?.value.toString(),
      appropriationYear: this.pcaFormControls?.appropriationYear?.value,
      pcaDesc: this.pcaFormControls?.pcaDesc?.value,
      openDate: this.intl.formatDate(this.pcaFormControls?.openDate?.value, this.configProvider?.appSettings?.dateFormat),
      closeDate: this.intl.formatDate(this.pcaFormControls?.closeDate?.value, this.configProvider?.appSettings?.dateFormat),
      totalAmount: this.pcaFormControls?.totalAmount?.value,
      fundingSourceId: this.pcaFormControls?.fundingSourceId?.value
    };
  }

  private addPcaDataSubscription() {
    this.pcaDataSubscription = this.pcaData$.subscribe((data: any) => {
        if(data){
          this.loader = false;
          data.openDate = new Date(data?.openDate);
          data.closeDate = new Date(data?.closeDate);
          data.pcaCode = Number(data.pcaCode)
          this.pcaForm?.patchValue(data);
          this.pcaDescChangeHandler(data?.pcaDesc);
        }
    });
  }

  private configurePcaEditView(){
      this.loader = true;
      this.saveButtonText = 'Update';
      this.addPcaDataSubscription();
      this.pcaFormControls?.pcaCode?.disable();
      this.pcaFormControls?.appropriationYear?.disable();
      this.pcaFormControls?.fundingSourceId?.disable();
  }

  public disabledDates = (date: Date): boolean => {        
    return date.getDate() != 1;
  }

  public disabledLastDates = (date: Date): boolean => {        
    return !this.isLastDay(date);
  }

  public isLastDay(dt : Date) {
    let test = new Date(dt.getTime()),
      month = test.getMonth();

    test.setDate(test.getDate() + 1);
    return test.getMonth() !== month;
   }

   restrictSpecialChar(event: KeyboardEvent): boolean {
    const key = event.key;
    return (
        (key >= '0' && key <= '9') ||  
        key === 'Backspace'  
    );
}

}

