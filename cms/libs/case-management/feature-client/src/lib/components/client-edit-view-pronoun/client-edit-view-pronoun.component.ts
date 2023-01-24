import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { CompletionChecklist, StatusFlag, WorkflowFacade,PronounCode, ClientFacade,ControlPrefix } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-client-edit-view-pronoun',
  templateUrl: './client-edit-view-pronoun.component.html',
  styleUrls: ['./client-edit-view-pronoun.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewPronounComponent implements OnInit,OnDestroy {

    /** InPut Properties **/
  @Input() appInfoForm: FormGroup;
  @Input() checkBoxValid!:boolean;
  @Input() textboxDisable!:boolean;

    /** Output Properties **/
  //@Output() PronounChanges = new EventEmitter<any>();  

    /** Public properties **/
   pronounList: any = []; 
   appInfoSubscription!:Subscription;
   pronounLovs$= this.lovFacade.pronounslov$;
   applicantInfo$ = this.clientfacade.applicantInfo$;
   showNotListedRequired:boolean=false;   
   maxLengthFifty =50;
   controlPrefix = ControlPrefix.pronoun;
   public formUiStyle : UIFormStyle = new UIFormStyle();  
   //textboxDisable:boolean=true;
   disablePronouns:any;

   private countOfSelection=0;   

     /** Construtor **/
   constructor(
     private readonly formBuilder: FormBuilder,
     private readonly cdr: ChangeDetectorRef,
     private readonly lovFacade : LovFacade,
     private readonly workflowFacade : WorkflowFacade,
     private readonly clientfacade: ClientFacade
   ) {
    this.appInfoForm = this.formBuilder.group({Pronoun: [''],});
   }
 
   ngOnInit(): void {
    this.lovFacade.getPronounLovs();
    this.loadPronouns();
    this.loadApplicantInfoSubscription();
   }
   ngOnDestroy(): void {
    this.appInfoSubscription.unsubscribe();    
  }
 private loadPronouns(){
  this.pronounLovs$.subscribe((data) => {
    this.pronounList = data;
    data.forEach((element) => {
        this.appInfoForm.addControl(ControlPrefix.pronoun + element.lovCode, new FormControl(''));        
    });  
    this.disablePronouns =  this.pronounList.filter((x:any)=>x.lovCode !== PronounCode.dontKnow && x.lovCode !== PronounCode.dontWant)
    this.cdr.detectChanges();
  });

 }
 private loadApplicantInfoSubscription(){
      this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo)=>{   
        if(applicantInfo !== null){ 
          if(applicantInfo.clientPronounList !== null && applicantInfo.clientPronounList !== undefined
          && applicantInfo.clientPronounList.length>0){
            this.assignPronounModelToForm(applicantInfo.clientPronounList);
            var nonDisablePronouns =  applicantInfo.clientPronounList.filter((x:any)=>x.clientPronounCode === PronounCode.dontKnow|| x.clientPronounCode === PronounCode.dontWant)
            if(nonDisablePronouns.length>0){
              this.enableDisablePronoun(true, nonDisablePronouns[0].clientPronounCode);
            }
            this.updateWorkflowCount(true);
          }        
        }
      });
  }
    private updateWorkflowCount(isCompleted:boolean){
      const workFlowdata: CompletionChecklist[] = [{
        dataPointName: 'pronoun',
        status: isCompleted ? StatusFlag.Yes : StatusFlag.No
      }];

      this.workflowFacade.updateChecklist(workFlowdata);
    }
    private assignPronounModelToForm(clientPronounList:any){
        if(clientPronounList !== undefined && clientPronounList !== undefined && clientPronounList != null){   
        clientPronounList.forEach((pronoun:any) => {  
        if(this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.clientPronounCode.toUpperCase()] !== undefined){
            this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.clientPronounCode.toUpperCase()].setValue(true);
        if(pronoun.clientPronounCode ===PronounCode.notListed){
            this.appInfoForm.controls['pronoun'].setValue(pronoun.otherDesc);
            this.textboxDisable = false;
          }   
          }
        })
        this.clientfacade.pronounListSubject.next(this.pronounList);     
      }
    }
   onCheckChange(event:any,lovCode:any) { 
    if(!this.appInfoForm.controls[ControlPrefix.pronoun + PronounCode.notListed].value){
      this.appInfoForm.controls['pronoun'].removeValidators(Validators.required);
      this.appInfoForm.controls['pronoun'].updateValueAndValidity();
    }  
  
    this.enableDisablePronoun(event.target.checked,lovCode);
   
     if(!event.target.checked && lovCode ===PronounCode.notListed) {  
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
      if(this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].value ===true){
        this.appInfoForm.controls['pronouns'].setErrors(null);
      }
    });
    if(this.appInfoForm.controls['pronouns'].valid){
      this.pronounList.forEach((pronoun:any) => {             
          this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].removeValidators(Validators.requiredTrue);
          this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].updateValueAndValidity();
      });
    }
    if(!this.appInfoForm.controls['pronouns'].valid){
      this.pronounList.forEach((pronoun:any) => {   
          this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].setValidators(Validators.requiredTrue);
          this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].updateValueAndValidity();
      });
    }
 
   }
   enableDisablePronoun(checked:boolean,lovCode:any){
    this.appInfoForm.controls['pronoun'].removeValidators(Validators.required);
    this.appInfoForm.controls['pronoun'].updateValueAndValidity(); 
    switch(lovCode){
      case PronounCode.notListed:
        this.textboxDisable = false;  
        break;
      case PronounCode.dontKnow:
      case PronounCode.dontWant:{
        if(checked){
          this.disablePronouns.forEach((pronoun:any) => { 
            this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].setValue(false);
            this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].disable();
            this.textboxDisable = true;  
          });   
          break;
        }
        else{
          if(lovCode ===PronounCode.dontKnow){
            if(!this.appInfoForm.controls[ControlPrefix.pronoun + PronounCode.dontWant].value === true){
              this.disablePronouns.forEach((pronoun:any) => { 
                this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].enable();
              });  
            }
          }
          if(lovCode ===PronounCode.dontWant){
            if(!this.appInfoForm.controls[ControlPrefix.pronoun + PronounCode.dontKnow].value === true){
              this.disablePronouns.forEach((pronoun:any) => { 
                this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].enable();
              });  
            }
          }
        }
      }

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
