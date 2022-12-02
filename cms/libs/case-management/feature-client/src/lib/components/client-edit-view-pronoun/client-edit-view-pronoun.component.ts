import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LovDataService, LovFacade, LovType } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-pronoun',
  templateUrl: './client-edit-view-pronoun.component.html',
  styleUrls: ['./client-edit-view-pronoun.component.scss'],
})
export class ClientEditViewPronounComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
   pronounList: any = [];
   @Output() PronounChanges = new EventEmitter<any>();  
   pronounLovs$= this.lovFacade.lovs$;
   showNotListedRequired:boolean=false;
   constructor(
    private formBuilder: FormBuilder,
     private readonly lovFacade : LovFacade
   ) {
    this.appInfoForm = this.formBuilder.group({

      Gender: [''],

    });
   }
 
   ngOnInit(): void {
    this.lovFacade.getLovsbyType(LovType.Pronouns);
    this.loadPronouns();
    
   }
 loadPronouns(){
  this.pronounLovs$.subscribe((data) => {
    this.pronounList = data;
    this.PronounChanges.emit(this.pronounList);
    console.log(data);
    data.forEach((element) => {
        this.appInfoForm.addControl(element.lovCode, new FormControl(''));
     
    });
  });
 }
   onCheckChange(event:any,lovCode:any) {
    if(event.target.checked && lovCode ==='NOT_LISTED'){
      this.appInfoForm.controls['NOT_LISTED'].setErrors({'incorrect': true});
    }else {
      this.appInfoForm.controls['NOT_LISTED'].setErrors(null);
    } 
    if(event.target.checked===true){ 
    this.appInfoForm.controls['pronouns'].setErrors(null);
    }
   }
}
