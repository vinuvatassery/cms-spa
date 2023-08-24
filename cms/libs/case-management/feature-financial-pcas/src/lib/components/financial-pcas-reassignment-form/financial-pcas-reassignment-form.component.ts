import { Component, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {FinancialPcaFacade} from '@cms/case-management/domain'
import { BehaviorSubject, Subject, of } from 'rxjs';


@Component({
  selector: 'cms-financial-pcas-reassignment-form',
  templateUrl: './financial-pcas-reassignment-form.component.html',
  styleUrls: ['./financial-pcas-reassignment-form.component.scss'],
})
export class FinancialPcasReassignmentFormComponent {
public formUiStyle: UIFormStyle = new UIFormStyle();

@Output() closeEditPcaReassignmentClickedEvent = new EventEmitter();
@Input() fundingSouceId!: any
pcaReassignmentEditData : any;
pcaEditForm!: FormGroup;
financialPcaEditSubject = new Subject<any>();
financialPcaEdit$ =
this.financialPcaEditSubject.asObservable();
constructor(
  private formBuilder: FormBuilder,
  private financialPcaFacade:FinancialPcaFacade,
  private readonly cdr: ChangeDetectorRef

  ) 
  {    
}
ngOnInit(): void {
  this.fundingSouceId = "72B63ADD-4B44-4568-B22A-44096C1D5CF2";
  this.buildForm();
  this.getPcaData();
  this.loadEditData();
}
getPcaData(){
  debugger;
  if(this.fundingSouceId)
  {
    this.financialPcaFacade.loadPcaReassigmentDataById(this.fundingSouceId)
  }
}
buildForm() {

  this.pcaEditForm = this.formBuilder.group({
    pCA: ['', Validators.required],
    aY: ['', Validators.required],
    openDate: ['', Validators.required],
    closeDate: ['', Validators.required],
    totalAmount : ['', Validators.required],


  })
}
closeEditPcaReassignmentClicked() {
  this.closeEditPcaReassignmentClickedEvent.emit(true);
}
private loadEditData() {
  this.financialPcaFacade.financialPcaReassignmentEditData$.subscribe((response) => {
    debugger;
    this.pcaReassignmentEditData = response;
    this.editBindData();
  });
}
editBindData() {
  debugger;
  this.pcaEditForm.controls['aY'].setValue(this.pcaReassignmentEditData.ay?.toString());
  this.pcaEditForm.controls['openDate'].setValue(new Date(this.pcaReassignmentEditData.openDate));
  this.pcaEditForm.controls['closeDate'].setValue(new Date(this.pcaReassignmentEditData.closeDate));
  this.pcaEditForm.controls['closeDate'].setValue(new Date(this.pcaReassignmentEditData.closeDate));
  this.pcaEditForm.controls['totalAmount'].setValue(this.pcaReassignmentEditData.totalAmount);

  
  this.cdr.detectChanges();
}

}

 
