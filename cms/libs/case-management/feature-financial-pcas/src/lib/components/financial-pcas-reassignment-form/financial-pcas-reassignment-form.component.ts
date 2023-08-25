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

  constructor(private formBuilder:FormBuilder){

  }
  ngOnInit(): void {
    this.pcaReassignmentForm = this.formBuilder.group({
      ay: [null],
      openDate: ['', Validators.required],
      closeDate: ['', Validators.required],
      totalAmount :[''],
      amountSpent :[''],
      balanceAmount :[''],
      pcaRemainingAmount:[''],
      pcaAllocated:[''],
      unlimited:['']
    })
    this.isViewGridOptionClicked = true;
    console.log(this.editPcaReassignmentItem)
    this.getPcaReassignmentByFundSourceIdEvent.emit('72B63ADD-4B44-4568-B22A-44096C1D5CF2')
    this.pcaReassignmentByFundSourceId$.subscribe((res:any) =>{
     this.pcaReassignmentByFundSource = res;
     this.pcaReassignmentForm.patchValue({
        ay : res.ay,
        openDate: res.openDate,
        closeDate : res.closeDate,
        unlimited: res.unlimited,
        pcaRemainingAmount : res.pcaRemainingAmount,
        totalAmount:res.totalAmount,
        amountSpent: res.amountSpent
     });

     this.pcaReassignmentForm.controls['openDate'].setValue(new Date(this.pcaReassignmentByFundSource.openDate));
     this.pcaReassignmentForm.controls['closeDate'].setValue(new Date(this.pcaReassignmentByFundSource.closeDate));
   
    })

  }
  closeEditPcaReassignmentClicked() {
    this.closeEditPcaReassignmentClickedEvent.emit(true);
  }



}

 
