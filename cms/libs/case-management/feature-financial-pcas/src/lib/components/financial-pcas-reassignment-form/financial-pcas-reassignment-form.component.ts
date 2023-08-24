import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  pcaReassignmentByFundSourceId: any;
  pcaReassignmentForm = this.formBuilder.group({
    ay: [null],
    openDate: ['', Validators.required],
    closeDate: ['', Validators.required],
    totalAmount :[''],
    amountSpent :[''],
    balanceAmount :[''],
    PcaRemainingAmount:[''],
    PcaAllocated:[''],
    unlimited:['']
  })
  constructor(private formBuilder:FormBuilder){

  }
  ngOnInit(): void {
    console.log(this.editPcaReassignmentItem)
    this.getPcaReassignmentByFundSourceIdEvent.emit('B652E450-C943-4C4A-8771-6E86D6935076')
    this.pcaReassignmentByFundSourceId$.subscribe((res:any) =>{
     this.pcaReassignmentByFundSourceId = res;
    })

  }
  closeEditPcaReassignmentClicked() {
    this.closeEditPcaReassignmentClickedEvent.emit(true);
  }



}

 
