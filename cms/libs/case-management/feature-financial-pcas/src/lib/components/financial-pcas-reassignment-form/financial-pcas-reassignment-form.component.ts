import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdatePcaDetails } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

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

  pcaList:string[] = [] 
  selectedValue: any;

constructor(private formBuilder:FormBuilder){

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
     this.pcaReassignmentForm.patchValue({
        pca : `${res.fundingSourceCode}-${res.pcaCode}`,
        ay : res.ay,
        openDate: res.openDate,
        closeDate : res.closeDate,
        unlimited: res.unlimitedFlag ==='Y',
        pcaRemainingAmount : res.pcaRemainingAmount,
        assignmentAmount:res.assignmentAmount,
        amountSpent: res.amountSpent
     });
     if(this.isViewGridOptionClicked){
     this.pcaReassignmentForm.controls['openDate'].disable();
     this.pcaReassignmentForm.controls['closeDate'].disable();
     this.pcaReassignmentForm.controls['unlimited'].disable();
     this.pcaReassignmentForm.controls['pcaRemainingAmount'].disable();
     this.pcaReassignmentForm.controls['assignmentAmount'].disable();
     }    
     this.pcaList.push(`${this.pcaReassignmentByFundSource.fundingSourceCode}-${this.pcaReassignmentByFundSource.pcaCode}`)
     this.pcaReassignmentForm.controls['openDate'].setValue(new Date(this.pcaReassignmentByFundSource.openDate));
     this.pcaReassignmentForm.controls['closeDate'].setValue(new Date(this.pcaReassignmentByFundSource.closeDate));  
    })

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
  dateValidate()
  {
    const endDate = this.pcaReassignmentForm.controls['closeDate'].value;
    const startDate = this.pcaReassignmentForm.controls['openDate'].value;
    if (endDate <= startDate && this.pcaReassignmentForm.controls['closeDate'].value) {
      this.pcaReassignmentForm.controls['closeDate'].setErrors({ 'incorrect': true })
    }
  }
 
}

 
