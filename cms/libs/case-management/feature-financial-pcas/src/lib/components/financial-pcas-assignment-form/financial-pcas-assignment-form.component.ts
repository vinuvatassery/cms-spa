import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subject, first } from 'rxjs';

@Component({
  selector: 'cms-financial-pcas-assignment-form',
  templateUrl: './financial-pcas-assignment-form.component.html',
  styleUrls: ['./financial-pcas-assignment-form.component.scss'],
})
export class FinancialPcasAssignmentFormComponent implements OnInit{

  @Input() groupCodesData$ : any
  @Input() objectCodesData$ : any
  @Input() pcaCodesData$ : any
  @Input() pcaAssignOpenDatesList$ : any
  @Input() pcaAssignCloseDatesList$ : any
  @Input() objectCodeIdValue : any
  @Input() groupCodeIdsdValue : any=[];
  @Input() pcaCodesInfoData$ : any

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditPcaAssignmentClickedEvent = new EventEmitter();

  pcaAssignmentForm!: FormGroup;
  
  constructor(  
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public intl: IntlService
  ) {}  
  ngOnInit(): void {
    this.composePcaAssignmentForm()
  }

  
  closeAddEditPcaAssignmentClicked() {
    this.closeAddEditPcaAssignmentClickedEvent.emit(true);
  }

  private composePcaAssignmentForm()
  {
      this.pcaAssignmentForm = this.formBuilder.group({     
        objectCode: ['', Validators.required],
        groupCodes: [[], Validators.required],
        pcaId: ['', Validators.required],
        openDate: ['', Validators.required],
        closeDate: ['', Validators.required],
        amount: [0, Validators.required],
        unlimited: ['']
      });
  

      this.pcaAssignmentForm.patchValue(
        {     
          objectCode:  this.objectCodeIdValue ,     
          groupCodes :  this.groupCodeIdsdValue
        }
      )
      
  }

  onPcaAssignmentFormSubmit()
  {}

  getPcaInfoData()
  {        
   this.pcaCodesInfoData$?.pipe()
   .subscribe((data: any) =>
   {  
   debugger 
   })
  }
}
