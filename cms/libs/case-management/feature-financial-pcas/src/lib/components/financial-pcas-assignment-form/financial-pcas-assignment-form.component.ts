import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';
import { first } from 'rxjs';

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
  @Input() pcaAssignmentData$ : any

  groupCodeIdsdValueData : any=[];

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditPcaAssignmentClickedEvent = new EventEmitter();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Output() addPcaDataEvent = new EventEmitter<any>();

  pcaAssignmentForm!: FormGroup;
  pcaCodesInfo : any
  pcaCodeInfo : any
  objectCodeControl! : FormControl
  editPca = false
  constructor(  
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public intl: IntlService
  ) {}  
  ngOnInit(): void {
    this.composePcaAssignmentForm()
    this.loadPcaEvent.emit()
    this.getPcaInfoData()
  }

  
  closeAddEditPcaAssignmentClicked() {
    this.closeAddEditPcaAssignmentClickedEvent.emit(true);
  }

  private composePcaAssignmentForm()
  {
    this.editPca =false
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

  private composePcaAssignmentEditForm()
  {    
    this.pcaAssignmentData$?.pipe(first((existPcaData: any ) => existPcaData?.pcaAssignmentId != null))
    .subscribe((existPcaData: any) =>
    {  
      
        if(existPcaData?.pcaAssignmentId)
        {       
          let groupCodeIdsAssignedValue : any=[];   
          this.editPca = true      
          this.onPcaChange(existPcaData?.pcaId)    
          this.pcaAssignmentForm.controls['pcaId'].disable();
          
          Object.values(this.groupCodeIdsdValue).forEach((key : any) => {  
                     
              if(existPcaData.groupCodeIds.split(',').filter((x:any)=>x=== key.groupCodeId).length > 0)
              {
                groupCodeIdsAssignedValue.push(key)
              }            
            })
            
            this.pcaAssignmentForm.patchValue(
              {     
                pcaAssignmentId:  existPcaData?.pcaAssignmentId ?? 0,  
                objectCode:  existPcaData?.objectCodeId ?? 0,     
                pcaId: existPcaData?.pcaId, 
                openDate: existPcaData?.openDate,
                closeDate: existPcaData?.closeDate,
                amount: existPcaData?.totalAmount,
                unlimited: (existPcaData?.unlimitedFlag === 'Y'),
                groupCodes : groupCodeIdsAssignedValue               
              }
            )
          
        }
    })
  }

  onPcaAssignmentFormSubmit()
  {    
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
      this.addPcaDataEvent.emit(pcaAssignmentData)
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

  getPcaInfoData()
  {       
    
    this.pcaCodesInfoData$?.pipe()
    .subscribe((data : any) =>
    {
      this.pcaCodesInfo = data
      this.composePcaAssignmentEditForm()
     }  )   
  }

  onPcaChange(data : any)
  {    
    this.pcaCodeInfo = this.pcaCodesInfo?.find((x : any)=>x.pcaId==data)

    this.pcaAssignmentForm.patchValue(
      {     
        ay:  this.pcaCodeInfo?.ay ?? ''}    
    )
   
  }
}
