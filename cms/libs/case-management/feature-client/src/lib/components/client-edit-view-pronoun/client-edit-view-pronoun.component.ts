import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { CompletionChecklist, StatusFlag, WorkflowFacade,PronounCode } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-client-edit-view-pronoun',
  templateUrl: './client-edit-view-pronoun.component.html',
  styleUrls: ['./client-edit-view-pronoun.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewPronounComponent implements OnInit {

    /** InPut Properties **/
  @Input() appInfoForm: FormGroup;
  @Input() checkBoxValid!:boolean;
  @Input() textboxDisable!:boolean;

    /** Output Properties **/
  @Output() PronounChanges = new EventEmitter<any>();  

    /** Public properties **/
   pronounList: any = []; 
   saveClickSubscription!:Subscription;
   pronounLovs$= this.lovFacade.pronounslov$;
   showNotListedRequired:boolean=false;   
   maxLengthFifty =50;
   public formUiStyle : UIFormStyle = new UIFormStyle();  
   //textboxDisable:boolean=true;

   private countOfSelection=0;   

     /** Construtor **/
   constructor(
    private formBuilder: FormBuilder,
     private readonly lovFacade : LovFacade,
     private readonly workflowFacade : WorkflowFacade
   ) {
    this.appInfoForm = this.formBuilder.group({Pronoun: [''],});
   }
 
   ngOnInit(): void {
    this.lovFacade.getPronounLovs();
    this.loadPronouns();
   
    
   }
 private loadPronouns(){
  this.pronounLovs$.subscribe((data) => {
    this.pronounList = data;
    this.PronounChanges.emit(this.pronounList);
    data.forEach((element) => {
        this.appInfoForm.addControl(element.lovCode, new FormControl(''));
     
    });
  });
  this.appInfoForm.valueChanges.subscribe(a=>{     
      
 });
 }

 private updateWorkflowCount(isCompleted:boolean){
  const workFlowdata: CompletionChecklist[] = [{
    dataPointName: 'pronoun',
    status: isCompleted ? StatusFlag.Yes : StatusFlag.No
  }];

  this.workflowFacade.updateChecklist(workFlowdata);
}
   onCheckChange(event:any,lovCode:any) { 
    if(!this.appInfoForm.controls[PronounCode.NotListed].value){
      this.appInfoForm.controls['pronoun'].removeValidators(Validators.required);
      this.appInfoForm.controls['pronoun'].updateValueAndValidity();
    }    
     if(event.target.checked && lovCode ===PronounCode.NotListed){  
      this.textboxDisable = false;      
    }
   
     if(!event.target.checked && lovCode ===PronounCode.NotListed) {  
       this.textboxDisable = true;
     } 
    if(event.target.checked){
      this.appInfoForm.controls['pronouns'].setErrors(null);
      this.countOfSelection++;
    }
    else{
      this.countOfSelection = this.countOfSelection > 0 ?  --this.countOfSelection: this.countOfSelection;
    }

    this.updateWorkflowCount(this.countOfSelection > 0);

    this.pronounList.forEach((pronoun:any) => {
      if(this.appInfoForm.controls[pronoun.lovCode].value ===true){
        this.appInfoForm.controls['pronouns'].setErrors(null);
      }
    });
    if(this.appInfoForm.controls['pronouns'].valid){
      this.pronounList.forEach((pronoun:any) => {             
          this.appInfoForm.controls[pronoun.lovCode].removeValidators(Validators.requiredTrue);
          this.appInfoForm.controls[pronoun.lovCode].updateValueAndValidity();
      });
    }
    if(!this.appInfoForm.controls['pronouns'].valid){
      this.pronounList.forEach((pronoun:any) => {   
          this.appInfoForm.controls[pronoun.lovCode].setValidators(Validators.requiredTrue);
          this.appInfoForm.controls[pronoun.lovCode].updateValueAndValidity();
      });
    }
   }
   onChange(event:any){
    if(event ===""){
      this.appInfoForm.controls['pronoun'].setErrors({'incorrect': true});
    }
    else{
      this.appInfoForm.controls['pronoun'].setErrors(null);
    }

   }
 
}
