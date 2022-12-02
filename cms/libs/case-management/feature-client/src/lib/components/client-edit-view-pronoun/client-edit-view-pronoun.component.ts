import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovDataService, LovType } from '@cms/system-config/domain';
import { DropTargetDirective } from '@progress/kendo-angular-grid/dragdrop/drop-target.directive';

@Component({
  selector: 'case-management-client-edit-view-pronoun',
  templateUrl: './client-edit-view-pronoun.component.html',
  styleUrls: ['./client-edit-view-pronoun.component.scss'],
})
export class ClientEditViewPronounComponent implements OnInit {
  @Input() Form: FormGroup;
   pronounList: any = [];
   @Output() PronounChanges = new EventEmitter<any>();  
   showNotListedRequired:boolean=false;
   constructor(
    private formBuilder: FormBuilder,
     private readonly lovDataService: LovDataService
   ) {
    this.Form = this.formBuilder.group({

      Gender: [''],

    });
   }
 
   ngOnInit(): void {
     this.lovDataService.getLovsbyType(LovType.Pronouns).subscribe((data) => {
       this.pronounList = data;
       this.PronounChanges.emit(this.pronounList);
       console.log(data);
       data.forEach((element) => {
           this.Form.addControl(element.lovCode, new FormControl(''));
        
       });
     });
   }

   onCheckChange(event:any,lovCode:any) {
    if(event.target.checked && lovCode ==='NOT_LISTED'){
      this.Form.controls['NOT_LISTED'].setErrors({'incorrect': true});
    }else {
      this.Form.controls['NOT_LISTED'].setErrors(null);
    } 
    if(event.target.checked===true){ 
    this.Form.controls['pronouns'].setErrors(null);
    }
   }
}
