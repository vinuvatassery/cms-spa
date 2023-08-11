import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'cms-financial-claims-detail-form',
  templateUrl: './financial-claims-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsDetailFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  claimsListData$ = this.financialClaimsFacade.claimsListData$;
  sortValue = this.financialClaimsFacade.sortValueClaims;
  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  sort = this.financialClaimsFacade.sortClaimsList;
  state!: State;

  isExcededMaxBeniftFlag = false;
  isExcededMaxBanifitButtonText = 'Make Exception';
  claimFlagExcededBaniftForm!: FormGroup;
  formIsSubmitted!: boolean;
  claimFlagExceptionMaxLength = 300;
  claimFlagExceptionCounter!: string;
  claimFlagExceptionText = '';
  claimFlagExceptionCharachtersCount!: number;
  checkservicescastvalue:any 

  
  clientSearchResult = [
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
  ];
  providerSearchResult = [
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234', 
    },
  ];

  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();

  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();

  }
  ngOnInit(): void {
  }
  closeAddEditClaimsFormModalClicked() {
    this.modalCloseAddEditClaimsFormModal.emit(true);
  }

  loadClaimsListGrid() {
    this.financialClaimsFacade.loadClaimsListGrid();
  }
  onMakeExceptionClick() {
    this.formIsSubmitted = false;
    this.claimFlagExcededBaniftForm.reset();
    this.isExcededMaxBeniftFlag = !this.isExcededMaxBeniftFlag;
    if (this.isExcededMaxBeniftFlag) {
      this.isExcededMaxBanifitButtonText = "Don't Make Exception";
    } else {
      this.isExcededMaxBanifitButtonText = "Make Exception";
    }
  }
  private buildForm() {
    this.claimFlagExcededBaniftForm = this.formBuilder.group({
      exceptionReason: ['', Validators.required],
      serviceCost:['',Validators.required],

      newClaimFlagExcededBaniftForm: this.formBuilder.array([]),
    });
  }
  onAddButtonClick(){
    debugger
    this.formIsSubmitted = true;
    if (!this.claimFlagExcededBaniftForm.valid) return;

    let formValues = this.claimFlagExcededBaniftForm.value;
    if (formValues.newClaimFlagExcededBaniftForm.length > 0) {
      formValues.exceptionReason  = [];
      formValues.newClaimFlagExcededBaniftForm.forEach((a:any) => {
    
        formValues.exceptionReason.push(this.claimFlagExcededBaniftForm);
      })
    }
    this.formIsSubmitted = false;
    this.claimFlagExcededBaniftForm.reset();

  }
  onClaimFlagExceptionValueChange(event: any): void {
    this.claimFlagExceptionCharachtersCount = event.length;
    this.claimFlagExceptionCounter = `${this.claimFlagExceptionCharachtersCount}/${this.claimFlagExceptionMaxLength}`;
  }
  loadServiceCostMethod(){
    debugger
    const serviceCost = this.claimFlagExcededBaniftForm.controls['serviceCost'].value;
    this.checkservicescastvalue = serviceCost
    console.log(serviceCost);
    
  }
}
