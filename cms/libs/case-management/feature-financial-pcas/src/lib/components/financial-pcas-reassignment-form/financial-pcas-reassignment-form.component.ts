import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Output() getPcaReassignmentByFundSourceIdEvent = new EventEmitter<any>();
  @Input() pcaReassignmentByFundSourceId$ :any
  @Input() isViewGridOptionClicked = false;
  pcaReassignmentByFundSource: any;
  pcaReassignmentForm!: FormGroup;

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
      totalAmount :[{value: '', disabled: true}],
      amountSpent :[{value: '', disabled: true}],
      balanceAmount :[{value: '', disabled: true}],
      pcaRemainingAmount:[''],
      pcaAllocated:[{value: '', disabled: true}],
      unlimited:[false]
    })
    this.getPcaReassignmentByFundSourceIdEvent.emit(this.editPcaReassignmentItem.pcaAssignmentId)
    this.pcaReassignmentByFundSourceId$.subscribe((res:any) =>{
     this.pcaReassignmentByFundSource = res;
     this.pcaReassignmentForm.patchValue({
        pca : `${res.fundingSourceCode}-${res.pcaCode}`,
        ay : res.ay,
        openDate: res.openDate,
        closeDate : res.closeDate,
        unlimited: res.unlimitedFlag ==='Y',
        pcaRemainingAmount : res.pcaRemainingAmount,
        totalAmount:res.totalAmount,
        amountSpent: res.amountSpent
     });

     if(this.isViewGridOptionClicked){
     this.pcaReassignmentForm.controls['openDate'].disable();
     this.pcaReassignmentForm.controls['closeDate'].disable();
     this.pcaReassignmentForm.controls['unlimited'].disable();
     this.pcaReassignmentForm.controls['pcaRemainingAmount'].disable();
     }
     
     this.pcaList.push(`${this.pcaReassignmentByFundSource.fundingSourceCode}-${this.pcaReassignmentByFundSource.pcaCode}`)
 
     this.pcaReassignmentForm.controls['openDate'].setValue(new Date(this.pcaReassignmentByFundSource.openDate));
     this.pcaReassignmentForm.controls['closeDate'].setValue(new Date(this.pcaReassignmentByFundSource.closeDate));
   
    })

  }
  closeEditPcaReassignmentClicked() {
    this.closeEditPcaReassignmentClickedEvent.emit(true);
  }



}

 
