import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';


@Component({
  selector: 'cms-financial-pcas-assignment-form',
  templateUrl: './financial-pcas-assignment-form.component.html',
  styleUrls: ['./financial-pcas-assignment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasAssignmentFormComponent implements OnInit,OnChanges, AfterViewChecked{

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
  @Output() closeAddEditPcaAssignmentClickedEvent = new EventEmitter();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Output() addPcaDataEvent = new EventEmitter<any>();

  openDateError =false
  totalAmount = 0
  pcaAssignmentForm!: FormGroup;
  pcaCodesInfo : any
  pcaCodeInfo : any
  objectCodeControl! : FormControl
  editPca = false
  formSubmitted =false
  constructor(  
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public intl: IntlService
  ) {}  
  ngOnInit(): void {   
    this.formSubmitted = false
    this.loadPcaEvent.emit()
    this.getPcaInfoData()

    if(this.newForm === true)
    {
      
    this.composePcaAssignmentForm()
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    
     
     if(this.pcaAssignmentFormDataModel$?.pcaAssignmentId)
     { 
      this.composePcaAssignmentEditForm()
     }
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
    this.closeAddEditPcaAssignmentClickedEvent.emit(true);
  }
  get pcaAssignmentFormControls() {
    return (this.pcaAssignmentForm)?.controls as any;
  }

  private composePcaAssignmentForm()
  {
    this.editPca =false
        if(!this.pcaAssignmentFormDataModel$?.pcaAssignmentId)
        {  
          this.pcaAssignmentForm = this.formBuilder.group({     
            pcaAssignmentId : [''],
            objectCode: ['', Validators.required],
            groupCodes: [[], Validators.required],
            pcaId: ['', Validators.required],
            openDate: ['', Validators.required],
            closeDate: ['', Validators.required],
            amount: ['', Validators.required],
            unlimited: [false],
            ay : ['']
          });  
          
          this.pcaAssignmentForm.patchValue(
            {     
              objectCode:  this.objectCodeIdValue ,     
              groupCodes :  this.groupCodeIdsdValue
            }
          )    
      this.pcaAssignmentForm.controls['objectCode'].disable();

      this.pcaAssignmentForm.controls['groupCodes'].disable();

      this.pcaAssignmentForm.controls['ay'].disable();     
    }
     
  }

  private composePcaAssignmentEditForm()
  {    
      if(!this.pcaAssignmentForm)
      {
        this.pcaAssignmentForm = this.formBuilder.group({     
          pcaAssignmentId : [''],
          objectCode: ['', Validators.required],
          groupCodes: [[], Validators.required],
          pcaId: ['', Validators.required],
          openDate: ['', Validators.required],
          closeDate: ['', Validators.required],
          amount: [0, Validators.required],
          unlimited: [false],
          ay : ['']
        });  
      }
        if(this.pcaAssignmentFormDataModel$?.pcaAssignmentId)
        {       
          
          this.pcaAssignmentForm.reset()
          let groupCodeIdsAssignedValue : any=[];   
          this.editPca = true      
          this.onPcaChange(this.pcaAssignmentFormDataModel$?.pcaId)    
          this.pcaAssignmentForm.controls['pcaId'].disable();
          
          Object.values(this.groupCodesDataFilter).forEach((key : any) => {  
                     
              if(this.pcaAssignmentFormDataModel$.groupCodeIds.split(',').filter((x:any)=>x=== key.groupCodeId).length > 0)
              {
                groupCodeIdsAssignedValue.push(key)
              }            
            })
            

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
                objectCode:  this.pcaAssignmentFormDataModel$?.objectCodeId,     
                pcaId: this.pcaAssignmentFormDataModel$?.pcaId, 
                openDate: this.pcaAssignmentFormDataModel$?.openDate,
                closeDate: this.pcaAssignmentFormDataModel$?.closeDate,
                amount: this.pcaAssignmentFormDataModel$?.amount,
                unlimited: this.pcaAssignmentFormDataModel$?.unlimited,
                groupCodes : groupCodeIdsAssignedValue               
              }
            )

            this.totalAmount = this.pcaCodeInfo?.remainingAmount + (this.pcaAssignmentForm.controls['amount'].value ?? 0)
           
           
        }
   
  }
  ngAfterViewChecked(){
    //your code to update the model
    this.ref.detectChanges();
 }
  onPcaAssignmentFormSubmit()
  {    
    this.dateValidate()
    if(this.pcaAssignmentForm?.controls["unlimited"].value === false && this.pcaAssignmentForm?.controls["amount"].value < 1)
    {
      this.pcaAssignmentForm?.controls["amount"].setValue('')
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
        openDate: this.pcaAssignmentForm?.controls["openDate"].value,  
        closeDate: this.pcaAssignmentForm?.controls["closeDate"].value,  
        amount: this.pcaAssignmentForm?.controls["unlimited"].value ? 0 :this.pcaAssignmentForm?.controls["amount"].value,  
        unlimitedFlag: this.pcaAssignmentForm?.controls["unlimited"].value === true ? 'Y' : 'N',  
        groupCodeIds : this.groupCodeIdsdValueData,  
      }
      this.addPcaDataEvent.emit(pcaAssignmentData)
    }
  }


  dateValidate()
  {
    if(this.pcaAssignmentForm?.controls["openDate"].value && this.pcaAssignmentForm?.controls["closeDate"].value)
    {
        if(this.pcaAssignmentForm?.controls["openDate"].value > this.pcaAssignmentForm?.controls["closeDate"].value)
        {
              this.openDateError = true
        }
        else
        {
          this.openDateError = false
        }
    }
    
  }

  unlimitedCheckChange($event : any)
  {   
   const unlimited = this.pcaAssignmentForm.controls['unlimited'].value

   if(unlimited === true)
   {
    this.pcaAssignmentForm.patchValue(
      {    
        amount :  ''
      }
    )
    this.pcaAssignmentForm.controls['amount'].reset()
    this.pcaAssignmentForm.controls['amount'].disable();
   }
   else
   {
    this.pcaAssignmentForm.controls['amount'].enable();
   }
  }



  onPcaChange(data : any)
  {    
    this.pcaCodeInfo = this.pcaCodesInfo?.find((x : any)=>x.pcaId==data)
    this.totalAmount += this.pcaCodeInfo?.remainingAmount 
    
    this.pcaAssignmentForm.patchValue(
      {     
        ay:  this.pcaCodeInfo?.ay ?? ''}    
    )
   
  }

  amountChange(amount : any)
  {
    if(this.pcaCodeInfo?.totalAmount)
    {     
      this.pcaCodeInfo.remainingAmount = this.totalAmount - amount
    }
    
  }
}
