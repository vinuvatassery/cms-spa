import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'common-add-employer',
  templateUrl: './add-employer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmployerComponent  implements OnInit {
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  employerForm !: FormGroup;
  @Output() addEmployer = new EventEmitter<any>();
  @Output() closeEmployerPopup = new EventEmitter<any>();

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
     this.employerForm = new FormGroup({
      employerName: new FormControl('', []),    
    });
  }
  closePopup()
  {
    this.closeEmployerPopup.emit(true);
  }

  saveEmployer(){
    this.employerForm.markAllAsTouched();
    this.employerForm.controls['employerName'].setValidators(Validators.required);
    this.employerForm.controls['employerName'].updateValueAndValidity();
    if(this.employerForm.valid){
      this.addEmployer.emit(this.employerForm.controls["employerName"].value);
    }    
  }
}
