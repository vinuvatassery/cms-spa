import { Component,OnInit,  Output,
  EventEmitter } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'cms-contact-address-details',
  templateUrl: './contact-address-details.component.html',
  styleUrls: ['./contact-address-details.component.scss'],
})
export class ContactAddressDetailsComponent implements OnInit {
  @Output() isContactDetailPopupClose = new EventEmitter<any>();
  SpecialHandlingLength = 100;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public contactDetailForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,){

  }
ngOnInit(): void {
    this.buildContactDetailForm();
}
  buildContactDetailForm() {
    this.contactDetailForm = this.formBuilder.group({
      mailCode: ['', Validators.required],
      name: ['',Validators.required],
      description: [''],
      phone: [''],
      fax: [''],
      email: ['']
    });
  }
  onCancel(){
    this.isContactDetailPopupClose.emit(true);
  }
}
