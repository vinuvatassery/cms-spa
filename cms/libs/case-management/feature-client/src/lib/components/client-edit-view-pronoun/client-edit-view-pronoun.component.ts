import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { CompletionChecklist, WorkflowFacade,PronounCode, ClientFacade,ControlPrefix } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
@Component({
  selector: 'case-management-client-edit-view-pronoun',
  templateUrl: './client-edit-view-pronoun.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewPronounComponent implements OnInit,OnDestroy {

    /** InPut Properties **/
  @Input() appInfoForm: FormGroup;
  @Input() textboxDisable!:boolean;

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

     /** Constructor **/
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
    this.loadPronouns();
    this.loadApplicantInfoSubscription();
    this.formChangeSubscription();
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
 private formChangeSubscription() {
  this.appInfoForm.controls['pronouns'].valueChanges.subscribe(value => {
    this.cdr.detectChanges();
  });
 }
 private loadApplicantInfoSubscription(){
      this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo)=>{
        if(applicantInfo !== null){
          if(applicantInfo.clientPronounList !== null && applicantInfo.clientPronounList !== undefined
          && applicantInfo.clientPronounList.length>0){
            this.assignPronounModelToForm(applicantInfo.clientPronounList);
            const nonDisablePronouns =  applicantInfo.clientPronounList.filter((x:any)=>x.clientPronounCode === PronounCode.dontKnow|| x.clientPronounCode === PronounCode.dontWant)
            if(nonDisablePronouns.length>0){
              this.enableDisablePronoun(true, nonDisablePronouns[0].clientPronounCode);
            }
            this.updateWorkflowCount(true);
          }
          else{
            this.textboxDisable=true;
            this.enableAllPronouns();
          }
        }
        else{
          this.textboxDisable=true;
          this.enableAllPronouns();
        }
      });
      this.cdr.detectChanges();
  }
    private updateWorkflowCount(isCompleted:boolean){
      const workFlowdata: CompletionChecklist[] = [{
        dataPointName: 'pronoun',
        status: isCompleted ? StatusFlag.Yes : StatusFlag.No
      }];

      this.workflowFacade.updateChecklist(workFlowdata);
    }
    private assignPronounModelToForm(clientPronounList:any){
        if(clientPronounList !== undefined && clientPronounList != null){
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

    private onDoNotKnowSelected(){
      if(!this.appInfoForm.controls[ControlPrefix.pronoun + PronounCode.dontWant]?.value === true){
        this.disablePronouns.forEach((pronoun:any) => {
          this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].enable();
        });
      }
     }

     private onDoNotWantSelected(){
      if(!this.appInfoForm.controls[ControlPrefix.pronoun + PronounCode.dontKnow]?.value === true){
        this.disablePronouns.forEach((pronoun:any) => {
          this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode]?.enable();
        });
     }
    }

   onCheckChange(event:any,lovCode:any) {
    this.appInfoForm.controls['pronouns'].removeValidators(Validators.required);
    this.appInfoForm.controls['pronouns'].updateValueAndValidity();
    this.enableDisablePronoun(event.target.checked,lovCode);
    const pronounControls = Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.pronoun));
    let isFieldCompleted = false;
    pronounControls.forEach((pronoun:any) => {
        this.appInfoForm.controls[pronoun].removeValidators(Validators.requiredTrue);
        this.appInfoForm.controls[pronoun].updateValueAndValidity();
        const value = this.appInfoForm.controls[pronoun]?.value;
        if(value === true){
          isFieldCompleted = (isFieldCompleted || value === true) && ((pronoun === `${ControlPrefix.pronoun}${PronounCode.notListed}` && this.appInfoForm.controls['pronoun']?.value) || pronoun !== `${ControlPrefix.pronoun}${PronounCode.notListed}`)
        }
      });
    this.updateWorkflowCount(isFieldCompleted);
    this.appInfoForm.controls['pronoun'].updateValueAndValidity();
   }

   enableDisablePronoun(checked:boolean,lovCode:any){
    switch(lovCode){
      case PronounCode.notListed:
        this.textboxDisable = !checked;
        break;
      case PronounCode.dontKnow:
      case PronounCode.dontWant:{
        if(checked){
          this.disablePronouns.forEach((pronoun:any) => {
            this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].setValue(false);
            this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].disable();
            this.appInfoForm.controls['pronoun'].removeValidators(Validators.required);
            this.textboxDisable = true;
          });
          break;
        }
        else{
          if(lovCode ===PronounCode.dontKnow){
            this.onDoNotKnowSelected();
          }
          else if(lovCode ===PronounCode.dontWant){
            this.onDoNotWantSelected();
          }
        }
      }

    }
    if(!this.appInfoForm.controls[ControlPrefix.pronoun + PronounCode.notListed]?.value){
      this.appInfoForm.controls['pronoun']?.removeValidators(Validators.required);
      this.appInfoForm.controls['pronoun']?.updateValueAndValidity();
    }
   }

   enableAllPronouns(){
    if(this.disablePronouns.length>0){
      this.disablePronouns.forEach((pronoun:any) => {
        this.appInfoForm.controls[ControlPrefix.pronoun + pronoun.lovCode].enable();
      });
    }
   }
}
