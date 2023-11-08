import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PcaAssignmentsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';


@Component({
  selector: 'cms-financial-reassignment-pca-form',
  templateUrl: './financial-reassignment-pca-form.component.html',
  styleUrls: ['./financial-reassignment-pca-form.component.scss'],
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
  constructor(  
    private formBuilder: FormBuilder,
    private readonly pcaAssignmentsFacade : PcaAssignmentsFacade,
    public intl: IntlService
  ) {}  
  ngOnInit(): void {  
    this.formSubmitted = false
    this.loadPcaEvent.emit()
    this.getPcaInfoData()

    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
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
          openDate: '',
          closeDate: '',
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
         // this.onPcaChange(this.pcaAssignmentFormDataModel$?.pcaId)    
          this.pcaAssignmentForm.controls['pcaId'].disable();
          
          Object.values(this.groupCodesDataFilter).forEach((key : any) => {  
                     
              if(this.pcaAssignmentFormDataModel$.groupCodeIds.split(',').filter((x:any)=>x=== key.groupCodeId).length > 0)
              {
                groupCodeIdsAssignedValue.push(key)
              }            
            })            

            this.pcaAssignmentForm.controls['ay'].disable();     
           
            if(this.pcaAssignmentFormDataModel$?.unlimited === true)
            {
              this.pcaAssignmentForm.controls['amount'].disable();  
            }
            
            this.pcaAssignmentForm.patchValue(
              {     
                pcaAssignmentId:  this.pcaAssignmentFormDataModel$?.pcaAssignmentId ,  
                objectCode:  this.pcaAssignmentFormDataModel$?.objectCodeId,     
                pcaId: '', 
                openDate: this.pcaAssignmentFormDataModel$?.openDate,
                closeDate: '',
                amount: this.pcaAssignmentFormDataModel$?.amount,
                unlimited: this.pcaAssignmentFormDataModel$?.unlimited,
                groupCodes : groupCodeIdsAssignedValue               
              }
            )
           
           
        }
   
  }

  onPcaAssignmentFormSubmit()
  {    
    
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
