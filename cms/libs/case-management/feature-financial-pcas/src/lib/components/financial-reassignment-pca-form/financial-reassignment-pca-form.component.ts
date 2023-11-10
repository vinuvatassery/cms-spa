import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';


@Component({
  selector: 'cms-financial-reassignment-pca-form',
  templateUrl: './financial-reassignment-pca-form.component.html',
  styleUrls: ['./financial-reassignment-pca-form.component.scss'],
  providers: [DatePipe]
})
export class FinancialreassignmentpcaFormComponent implements OnInit,OnChanges{

  @Input() groupCodesData$ : any
  @Input() objectCodesData$ : any
  @Input() pcaCodesData$ : any
  @Input() pcaAssignOpenDatesList$ : any
  @Input() pcaAssignCloseDatesList$ : any
  @Input() objectCodeIdValue : any
  @Input() groupCodeIdsdValue : any=[];
  @Input() pcaCodesInfoData$ : any
  @Input() pcaAssignmentData$ : any
  @Input() pcaAssignmentFormDataModel$ : any
  @Input() newForm : any
  @Input() groupCodesDataFilter : any

  groupCodeIdsdValueData : any=[];

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closePcaReAssignmentFormClickedEvent = new EventEmitter();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Output() reassignpcaEvent = new EventEmitter<any>();

  pcaAssignmentForm!: FormGroup;
  pcaCodesInfo : any
  pcaCodeInfo : any
  objectCodeControl! : FormControl
  editPca = false
  formSubmitted =false;
  startDate:any;
  endDate:any;
  openDateError =false

  constructor(  
    private formBuilder: FormBuilder,
    public intl: IntlService,private datePipe: DatePipe
  ) {}  
  ngOnInit(): void {  
    this.formSubmitted = false
    this.loadPcaEvent.emit()
    this.getPcaInfoData()

   
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
   
    let date = new Date();
    this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
     this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.startDate=this.datePipe.transform(this.startDate, 'MM/dd/yyyy')
    this.endDate=this.datePipe.transform(this.endDate, 'MM/dd/yyyy')

    this.pcaAssignmentForm = this.formBuilder.group({     
      pcaAssignmentId : [''],
      objectCode: ['', Validators.required],
      groupCodes: [[], Validators.required],
      pcaId: ['', Validators.required],
      openDate: [this.startDate, Validators.required],
      closeDate: [this.endDate , Validators.required],
      amount: [null, Validators.required],
      unlimited: [false],
      ay : ['']
    });

     this.pcaAssignmentForm.controls['objectCode'].disable();

     this.pcaAssignmentForm.controls['groupCodes'].disable();

      this.pcaAssignmentForm.controls['ay'].disable();     
     
      if(this.pcaAssignmentFormDataModel$?.unlimited === true)
      {
        this.pcaAssignmentForm.controls['amount'].disable();  
      }
      
      this.pcaAssignmentForm.patchValue(
        {     
          pcaAssignmentId:  this.pcaAssignmentFormDataModel$?.pcaAssignmentId ,  
          objectCode: this.pcaAssignmentFormDataModel$?.objectId,     
          pcaId: '', 
          openDate:this.startDate,
          closeDate: this.endDate,
          amount:this.pcaAssignmentFormDataModel$.pcaRemainingAmount,
          unlimited:false,
          groupCodes : this.groupCodesData$               
        }
      )
   
    
  }
  
  getPcaInfoData()
  {       
    
    this.pcaCodesInfoData$?.pipe()
    .subscribe((data : any) =>
    {
      this.pcaCodesInfo = data
      
    
     }  )   
  }
  closeAddEditPcaAssignmentClicked() {
    this.closePcaReAssignmentFormClickedEvent.emit(true);
  }
  get pcaAssignmentFormControls() {
    return (this.pcaAssignmentForm)?.controls as any;
  }

  onPcaAssignmentFormSubmit()
  {    
    if(this.pcaAssignmentForm?.controls["openDate"].value && this.pcaAssignmentForm?.controls["closeDate"].value)
    {
        if(this.pcaAssignmentForm?.controls["openDate"].value > this.pcaAssignmentForm?.controls["closeDate"].value)
        {
       
              this.openDateError = true;
              return;
        }
        else
        {
          this.openDateError = false
        }
       
    }
    this.formSubmitted = true
    this.pcaAssignmentForm.markAllAsTouched();
    if(this.pcaAssignmentForm.valid)
    {

      const groupCodes= this.pcaAssignmentForm?.controls["groupCodes"].value
      this.groupCodeIdsdValueData= []
      for (const key in groupCodes) 
      {           
        this.groupCodeIdsdValueData.push(groupCodes[key]?.groupCodeId)     
      }
      const pcaAssignmentData =
      {
        pcaAssignmentId: this.pcaAssignmentForm?.controls["pcaAssignmentId"].value
                         =='' ? "00000000-0000-0000-0000-000000000000" :  
                         this.pcaAssignmentForm?.controls["pcaAssignmentId"].value,          
        objectCodeId: this.pcaAssignmentForm?.controls["objectCode"].value,  
        pcaId: this.pcaAssignmentForm?.controls["pcaId"].value,  
        openDate:new Date(this.pcaAssignmentForm?.controls["openDate"].value+'Z:00:00:00'),  
        closeDate:new Date(this.pcaAssignmentForm?.controls["closeDate"].value+'Z:00:00:00'),  
        amount: this.pcaAssignmentForm?.controls["amount"].value,  
        unlimitedFlag: this.pcaAssignmentForm?.controls["unlimited"].value === true ? 'Y' : 'N',  
        groupCodeIds : this.groupCodeIdsdValueData,  
      }
      this.reassignpcaEvent.emit(pcaAssignmentData)
    }
  }


  unlimitedCheckChange($event : any)
  {   
   const unlimited = this.pcaAssignmentForm.controls['unlimited'].value

   if(unlimited === true)
   {
    this.pcaAssignmentForm.patchValue(
      {    
        amount :  0
      }
    )
    this.pcaAssignmentForm.controls['amount'].disable();
   }
   else
   {
    this.pcaAssignmentForm.controls['amount'].enable();
   }
  }



  onPcaChange(data : any)
  { 
       
    this.pcaCodeInfo = this.pcaCodesData$?.find((x : any)=>x.pcaId==data)
    this.pcaAssignmentForm.patchValue(
      {     
        ay:  this.pcaCodeInfo?.ay ?? ''}    
    ) 
      }
    }
