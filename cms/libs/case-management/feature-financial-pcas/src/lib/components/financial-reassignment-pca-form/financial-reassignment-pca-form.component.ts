import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FinancialPcaFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'cms-financial-reassignment-pca-form',
  templateUrl: './financial-reassignment-pca-form.component.html',
  styleUrls: ['./financial-reassignment-pca-form.component.scss'],
  providers: [DatePipe],
})
export class FinancialreassignmentpcaFormComponent
  implements OnInit, OnChanges
{
  @Input() groupCodesData$: any;
  @Input() objectCodesData$: any;
  pcaCodesData$: any;
  @Input() pcaAssignOpenDatesList$: any;
  @Input() pcaAssignCloseDatesList$: any;
  @Input() objectCodeIdValue: any;
  @Input() groupCodeIdsdValue: any = [];
  @Input() pcaCodesInfoData$: any;
  @Input() pcaAssignmentData$: any;
  @Input() pcaAssignmentFormDataModel$: any;
  @Input() newForm: any;
  @Input() groupCodesDataFilter: any;

  groupCodeIdsdValueData: any = [];

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closePcaReAssignmentFormClickedEvent = new EventEmitter();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Output() reassignpcaEvent = new EventEmitter<any>();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  pcaAssignmentForm!: FormGroup;
  pcaCodesInfo: any;
  pcaCodeInfo: any;
  objectCodeControl!: FormControl;
  editPca = false;
  formSubmitted = false;
  startDate: any;
  endDate: any;
  ispcaCloseDateGreater: any = false;
  ispcaOpenDateGreater: any = false;
  isAssignmentpcaCloseDateGreater: any = false;
  isAssignmentpcaOpenDateGreater: any = false;
  openDateErrorMsg!: string;
  openDateError: boolean = false;
  closeDateErrorMsg!: string;
  closeDateError: boolean = false;
  totalAmount: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    public intl: IntlService,
    private datePipe: DatePipe,
    private financialPcaFacade: FinancialPcaFacade,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.formSubmitted = false;
    this.loadPcaEvent.emit();
    this.loaderService.show();
    this.financialPcaFacade
      .getPcaUnAssignments(
        this.pcaAssignmentFormDataModel$?.objectId,
        this.pcaAssignmentFormDataModel$?.pcaAssignmentId,
        this.pcaAssignmentFormDataModel$?.groupId
      )
      .subscribe((res: any) => {
        this.pcaCodesData$ = res;
        this.loaderService.hide();
      });

    this.getPcaInfoData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let date = new Date();
    this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.startDate = this.datePipe.transform(this.startDate, 'MM/dd/yyyy');
    this.endDate = this.datePipe.transform(this.endDate, 'MM/dd/yyyy');

    this.pcaAssignmentForm = this.formBuilder.group({
      pcaAssignmentId: [''],
      objectCode: ['', Validators.required],
      groupCodes: [[], Validators.required],
      pcaId: ['', Validators.required],
      openDate: [this.startDate, Validators.required],
      closeDate: [this.endDate, Validators.required],
      amount: [null, Validators.required],
      unlimited: [false],
      ay: [''],
    });

    this.pcaAssignmentForm.controls['objectCode'].disable();

    this.pcaAssignmentForm.controls['groupCodes'].disable();

    this.pcaAssignmentForm.controls['ay'].disable();

    if (this.pcaAssignmentFormDataModel$?.unlimited === true) {
      this.pcaAssignmentForm.controls['amount'].disable();
    }

    this.pcaAssignmentForm.patchValue({
      pcaAssignmentId: this.pcaAssignmentFormDataModel$?.pcaAssignmentId,
      objectCode: this.pcaAssignmentFormDataModel$?.objectId,
      pcaId: '',
      openDate: this.startDate,
      closeDate: this.endDate,
      amount: null,
      unlimited: false,
      groupCodes: this.groupCodesData$,
    });
  }

  getPcaInfoData() {
    this.pcaCodesInfoData$?.pipe().subscribe((data: any) => {
      this.pcaCodesInfo = data;
    });
  }
  closeAddEditPcaAssignmentClicked() {
    this.closePcaReAssignmentFormClickedEvent.emit(true);
  }
  get pcaAssignmentFormControls() {
    return this.pcaAssignmentForm?.controls as any;
  }

  onPcaAssignmentFormSubmit() {
    if (this.openDateError) {
      return;
    }

    if (this.closeDateError) {
      return;
    }

    this.formSubmitted = true;

    this.pcaAssignmentForm.markAllAsTouched();
    if (this.pcaAssignmentForm.valid) {
      const groupCodes = this.pcaAssignmentForm?.controls['groupCodes'].value;
      this.groupCodeIdsdValueData = [];
      for (const key in groupCodes) {
        this.groupCodeIdsdValueData.push(groupCodes[key]?.groupCodeId);
      }

      const pcaAssignmentData = {
        pcaAssignmentId:
          this.pcaAssignmentForm?.controls['pcaAssignmentId'].value == ''
            ? '00000000-0000-0000-0000-000000000000'
            : this.pcaAssignmentForm?.controls['pcaAssignmentId'].value,
        objectCodeId: this.pcaAssignmentForm?.controls['objectCode'].value,
        pcaId: this.pcaAssignmentForm?.controls['pcaId'].value,
        openDate: new Date(
          this.pcaAssignmentForm?.controls['openDate'].value + 'Z:00:00:00'
        ),
        closeDate: new Date(
          this.pcaAssignmentForm?.controls['closeDate'].value + 'Z:00:00:00'
        ),
        amount: this.pcaAssignmentForm?.controls['amount'].value ?? 0,
        unlimitedFlag:
          this.pcaAssignmentForm?.controls['unlimited'].value === true
            ? 'Y'
            : 'N',
        groupCodeIds: this.groupCodeIdsdValueData,
      };
      this.reassignpcaEvent.emit(pcaAssignmentData);
    }
  }

  unlimitedCheckChange($event: any) {
    const unlimited = this.pcaAssignmentForm.controls['unlimited'].value;

    if (unlimited === true) {
      this.pcaAssignmentForm.patchValue({
        amount: null,
      });
      this.pcaAssignmentForm.controls['amount'].disable();
    } else {
      this.pcaAssignmentForm.controls['amount'].enable();
    }
  }

  onPcaChange(data: any) {
    this.pcaCodeInfo = this.pcaCodesData$?.find((x: any) => x.pcaId == data);
    this.pcaCloseDate = new Date(
      this.intl.formatDate(this.pcaCodeInfo?.closeDate, this.dateFormat)
    );
    this.pcaOpenDate = new Date(
      this.intl.formatDate(this.pcaCodeInfo?.openDate, this.dateFormat)
    );
    this.totalAmount =
      this.pcaCodeInfo?.remainingAmount +
      (this.pcaAssignmentForm.controls['amount'].value ?? 0);
    this.pcaAssignmentForm.patchValue({
      ay: this.pcaCodeInfo?.ay ?? '',
    });
    this.closeDateValidate();
  }

  closeDateValidate() {
    const endDate = this.pcaAssignmentForm.controls['closeDate'].value;
    const startDate = this.pcaAssignmentForm.controls['openDate'].value;
    this.closeDateErrorMsg = this.checkcloseDateValidity(
      startDate,
      endDate,
      this.pcaCodeInfo?.closeDate
    );
  }

  pcaCloseDate!: Date;
  pcaOpenDate!: Date;
  openDateValidate() {
    const endDate = this.pcaAssignmentForm.controls['closeDate'].value;
    const startDate = this.pcaAssignmentForm.controls['openDate'].value;
    this.openDateErrorMsg = this.checkOpenDateValidity(startDate, endDate);
  }
  checkcloseDateValidity(
    opendate: string,
    closedate: string,
    pcaClosedate: string
  ): string {
    this.openDateError = false;
    const openDateObj: Date = new Date(opendate);
    const closeDateObj: Date = new Date(closedate);
    const pcaCloseDateObj: Date = new Date(pcaClosedate);
    this.pcaAssignmentForm.controls['openDate'].setErrors({ isInvalid: false });
    this.pcaAssignmentForm.get('openDate')?.updateValueAndValidity();

    switch (true) {
      case closeDateObj < openDateObj:
        this.closeDateError = true;
        this.pcaAssignmentForm.controls['closeDate'].setErrors({
          isInvalid: true,
        });
        return 'Close Date must be after Open Date';

      case closeDateObj > pcaCloseDateObj:
        this.closeDateError = true;
        this.pcaAssignmentForm.controls['closeDate'].setErrors({
          isInvalid: true,
        });
        return 'Assignment Close Date cannot exceed the PCA Close Date';

      default:
        this.closeDateError = false;
        this.pcaAssignmentForm.controls['closeDate'].setErrors({
          isInvalid: false,
        });
        this.pcaAssignmentForm.get('closeDate')?.updateValueAndValidity();
        return '';
    }
  }
  checkOpenDateValidity(opendate: string, closedate: string): string {
    this.pcaAssignmentForm.controls['closeDate'].setErrors({
      isInvalid: false,
    });
    this.pcaAssignmentForm.get('closeDate')?.updateValueAndValidity();
    this.closeDateError = false;
    const openDateObj: Date = new Date(opendate);
    const closeDateObj: Date = new Date(closedate);
    if (openDateObj > closeDateObj) {
      this.openDateError = true;
      this.pcaAssignmentForm.controls['openDate'].setErrors({
        isInvalid: true,
      });
      return 'Open Date must be before Close Date';
    } else {
      this.openDateError = false;
      this.pcaAssignmentForm.controls['openDate'].setErrors({
        isInvalid: false,
      });
      this.pcaAssignmentForm.get('openDate')?.updateValueAndValidity();
      return '';
    }
  }

  amountChange(amount: any) {
    if (this.pcaCodeInfo?.totalAmount) {
      const numberOfGroups =
        this.pcaAssignmentForm?.controls['groupCodes'].value.length;
      this.pcaCodeInfo.remainingAmount =
        this.totalAmount - amount * numberOfGroups;
    }
  }
}
