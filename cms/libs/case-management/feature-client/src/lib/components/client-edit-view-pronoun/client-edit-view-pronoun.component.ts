import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkflowFacade } from '@cms/case-management/domain';
import { LovFacade, LovType } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

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
   //textboxDisable:boolean=true;

     /** Construtor **/
   constructor(
    private formBuilder: FormBuilder,
     private readonly lovFacade : LovFacade
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
   onCheckChange(event:any,lovCode:any) {  
 debugger;
    if(event.target.checked && lovCode ==='NOT_LISTED'){
      this.appInfoForm.controls['NOT_LISTED'].setErrors({'incorrect': true});
      this.textboxDisable = false;
    } 
    if(!event.target.checked && lovCode ==='NOT_LISTED') {
      this.appInfoForm.controls['NOT_LISTED'].setErrors(null);
      this.textboxDisable = true;
    } 
   
   }
   ngAfterViewChecked() {
    if(this.appInfoForm.controls['NOT_LISTED'] !== undefined && this.appInfoForm.controls['NOT_LISTED'].value !==""){
      this.textboxDisable = false;
    }
   }
 
}
