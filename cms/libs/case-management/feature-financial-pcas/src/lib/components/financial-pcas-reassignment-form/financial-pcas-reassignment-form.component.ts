import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdatePcaDetails } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'cms-financial-pcas-reassignment-form',
  templateUrl: './financial-pcas-reassignment-form.component.html',
  styleUrls: ['./financial-pcas-reassignment-form.component.scss'],
})
export class FinancialPcasReassignmentFormComponent implements  OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() editPcaReassignmentItem:any
  @Output() closeEditPcaReassignmentClickedEvent = new EventEmitter();
  @Output() getPcaAssignmentByIdEvent = new EventEmitter<any>();
  @Output() saveEditPcaReassignmentClickedEvent = new EventEmitter<any>();
  @Input() getPcaAssignmentById$ :any
  @Input() isViewGridOptionClicked = false;
  pcaReassignmentByFundSource: any;
  pcaReassignmentForm!: FormGroup;
  checkboxValue!: string;
  ispcaCloseDateGreater: any = false;
  ispcaOpenDateGreater: any = false;
  isAssignmentpcaCloseDateGreater: any = false;
  isAssignmentpcaOpenDateGreater: any = false;

  pcaList:string[] = [] 
  selectedValue: any;
  showEditButton =false;
  pcaCloseDate!: Date;
  pcaOpenDate!: Date;
  dateFormat = this.configurationProvider.appSettings.dateFormat;

constructor(private formBuilder:FormBuilder, private configurationProvider: ConfigurationProvider,
  public intl: IntlService,){

  }
  ngOnInit(): void {
    this.pcaReassignmentForm = this.formBuilder.group({
      pca:[{value: '', disabled: true}],
      ay: [{value: '', disabled: true}],
      openDate: ['', Validators.required],
      closeDate: ['', Validators.required],
      assignmentAmount :['',Validators.required],
      amountSpent :[{value: '', disabled: true}],
      balanceAmount :[{value: '', disabled: true}],
      pcaRemainingAmount:[''],
      pcaAllocated:[{value: '', disabled: true}],
      unlimited:[false]
    })

    this.getPcaAssignmentByIdEvent.emit(this.editPcaReassignmentItem.pcaAssignmentId)
    this.getPcaAssignmentById$.subscribe((res:any) =>{
     this.pcaReassignmentByFundSource = res;
     this.pcaCloseDate = new Date(this.intl.formatDate(this.pcaReassignmentByFundSource?.pcaCloseDate, this.dateFormat));
     this.pcaOpenDate = new Date(this.intl.formatDate(this.pcaReassignmentByFundSource?.pcaOpenDate, this.dateFormat));
     this.pcaReassignmentForm.patchValue({
        pca : `${res.pcaCode}-${res.fundingSourceCode}`,
        ay : res.ay,
        openDate: res.openDate,
        closeDate : res.closeDate,
        unlimited: res.unlimitedFlag ==='Y',
        pcaRemainingAmount : res.pcaRemainingAmount,
        assignmentAmount:res.assignmentAmount,
        amountSpent: res.amountSpent
     });
     if(this.isViewGridOptionClicked){
     this.showEditButton = true;
     this.pcaReassignmentForm.controls['openDate'].disable();
     this.pcaReassignmentForm.controls['closeDate'].disable();
     this.pcaReassignmentForm.controls['unlimited'].disable();
     this.pcaReassignmentForm.controls['pcaRemainingAmount'].disable();
     this.pcaReassignmentForm.controls['assignmentAmount'].disable();
     }    
     this.pcaList.push(`${this.pcaReassignmentByFundSource.fundingSourceCode}-${this.pcaReassignmentByFundSource.pcaCode}`);
     this.pcaReassignmentForm.controls['openDate'].setValue(new Date(this.pcaReassignmentByFundSource.openDate));
     this.pcaReassignmentForm.controls['closeDate'].setValue(new Date(this.pcaReassignmentByFundSource.closeDate));  
    })
  }

  onEditButtonClicked(){
    this.showEditButton= false
    this.pcaReassignmentForm.controls['openDate'].enable();
    this.pcaReassignmentForm.controls['closeDate'].enable();
    this.pcaReassignmentForm.controls['unlimited'].enable();
    this.pcaReassignmentForm.controls['pcaRemainingAmount'].enable();
    this.pcaReassignmentForm.controls['assignmentAmount'].enable();
    this.isViewGridOptionClicked = false;
  }
  closeEditPcaReassignmentClicked() {
    this.closeEditPcaReassignmentClickedEvent.emit(true);
  }
  saveEditPcaReassignmentClicked() {
    if (this.pcaReassignmentForm.valid) {
      let formData = this.pcaReassignmentForm.value;
      this.checkboxValue = formData.unlimited ? 'Y' : 'N'
      let pcaDetails: UpdatePcaDetails = {
        openDate: formData.openDate,
        closeDate: formData.closeDate,
        assignmentAmount: formData.assignmentAmount,
        UnlimitedFlag: this.checkboxValue,
        pcaAssignmentId: this.pcaReassignmentByFundSource.pcaAssignmentId,
        pcaId:  this.pcaReassignmentByFundSource.pcaId,
      };
      this.saveEditPcaReassignmentClickedEvent.emit(pcaDetails);
      console.log(pcaDetails)
    }
  }

  closeDateValidate()
  {
    const endDate = this.pcaReassignmentForm.controls['closeDate'].value;
    const startDate = this.pcaReassignmentForm.controls['openDate'].value;
    if (endDate < startDate && this.pcaReassignmentForm.controls['closeDate'].value) {
      this.pcaReassignmentForm.controls['closeDate'].setErrors({ 'incorrect': true });
      this.ispcaCloseDateGreater = false;
      this.ispcaOpenDateGreater = false;
      return;
    }
    if(this.pcaCloseDate < endDate && this.pcaReassignmentForm.controls['closeDate'].value){
      this.ispcaCloseDateGreater = true;
      this.ispcaOpenDateGreater = false;
      return;
    }
    if(this.pcaOpenDate > endDate && this.pcaReassignmentForm.controls['closeDate'].value){
      this.ispcaOpenDateGreater = true;
      this.ispcaCloseDateGreater = false;
      return;
    }
  }

  openDateValidate()
  {
    const endDate = this.pcaReassignmentForm.controls['closeDate'].value;
    const startDate = this.pcaReassignmentForm.controls['openDate'].value;
    if (endDate < startDate && this.pcaReassignmentForm.controls['openDate'].value) {
      this.pcaReassignmentForm.controls['openDate'].setErrors({ 'incorrect': true });
      this.isAssignmentpcaCloseDateGreater = false;
      this.isAssignmentpcaOpenDateGreater = false;
      return;
    }
    if(this.pcaCloseDate < startDate && this.pcaReassignmentForm.controls['openDate'].value){
      this.isAssignmentpcaCloseDateGreater = true;
      this.isAssignmentpcaOpenDateGreater = false;
      return;
    }
    if(this.pcaOpenDate > startDate && this.pcaReassignmentForm.controls['openDate'].value){
      this.isAssignmentpcaOpenDateGreater = true;
      this.isAssignmentpcaCloseDateGreater = false;
      return;
    }
  }

  amountValidate()
  {
    const pcaAmmounnt = this.pcaReassignmentByFundSource.pcaAmount;
    const reassignmentAmount = this.pcaReassignmentForm.controls['assignmentAmount'].value;
    if (reassignmentAmount > pcaAmmounnt && reassignmentAmount) 
    {
      this.pcaReassignmentForm.controls['assignmentAmount'].setErrors({ 'incorrect': true });
    }
  }

  unlimitedCheckChange($event : any)
  {   
   const unlimited = this.pcaReassignmentForm.controls['unlimited'].value;
   if(unlimited)
   {
    this.pcaReassignmentForm.patchValue(
      {    
        assignmentAmount :  0
      }
    )
    this.amountValidate();
    this.pcaReassignmentForm.controls['assignmentAmount'].disable();
    this.pcaReassignmentForm.controls['assignmentAmount'].clearValidators();
    this.pcaReassignmentForm.controls['assignmentAmount'].updateValueAndValidity();
   }
   else
   {
    this.pcaReassignmentForm.controls['assignmentAmount'].enable();
   }
  }
 
}

 
