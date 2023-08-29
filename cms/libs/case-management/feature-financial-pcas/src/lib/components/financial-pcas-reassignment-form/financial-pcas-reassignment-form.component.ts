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
      pca:[''],
      ay: [null],
      openDate: ['', Validators.required],
      closeDate: ['', Validators.required],
      totalAmount :[''],
      amountSpent :[''],
      balanceAmount :[''],
      pcaRemainingAmount:[''],
      pcaAllocated:[''],
      unlimited:[false]
    })
    this.getPcaReassignmentByFundSourceIdEvent.emit('E368B32F-89C5-4370-978D-06B3D97929BF')
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
     this.pcaReassignmentForm.controls['ay'].disable();
     this.pcaReassignmentForm.controls['pcaRemainingAmount'].disable();
     this.pcaReassignmentForm.controls['amountSpent'].disable();
     this.pcaReassignmentForm.controls['totalAmount'].disable();
     this.pcaReassignmentForm.controls['pca'].disable();
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

 
