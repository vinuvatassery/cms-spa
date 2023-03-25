/** Angular **/
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusFlag } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'case-management-email-detail',
  templateUrl: './email-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailDetailComponent implements OnInit{
/** Input properties **/
@Input() isEditValue!: boolean;
@Input() selectedEmailData: any
@Output() addClientEmailEvent = new EventEmitter<any>();

/** Public properties **/
isDeactivateValue!: boolean;
isDeactivateEmailAddressPopup = true;
public formUiStyle : UIFormStyle = new UIFormStyle();
clientEmailForm!: FormGroup;
isFormSubmitted =false;
btnDisabled = false;
/** Constructor **/
constructor(  private formBuilder: FormBuilder) {}

/** Lifecycle hooks **/
ngOnInit(): void {
  this.composeEmailForm()
}

/** Private methods **/

/** Internal event methods **/
onDeactivateClicked() {
  this.isDeactivateValue = true;
  this.isDeactivateEmailAddressPopup = true;
}

onDeactivateEmailAddressClosed() {
  this.isDeactivateEmailAddressPopup = !this.isDeactivateEmailAddressPopup;
}

composeEmailForm()
{    
    this.clientEmailForm = this.formBuilder.group({   
      clientEmailId: ['']   ,
      email: ['',Validators.required]   ,
      detailMsgFlag: ['']   ,
      preferredFlag: ['']   ,           
      paperlessFlag: ['']   ,       
    });     

    if(this.isEditValue === true)
    {
      this.onSelectedEmailFormLoad()
    }
}

onSelectedEmailFormLoad()
{       
  this.clientEmailForm.patchValue(
          {
            clientEmailId: this.selectedEmailData?.clientemailId   ,
            email: this.selectedEmailData?.email   ,
            detailMsgFlag: this.getStatusFlag(this.selectedEmailData?.detailMsgFlag)   ,   
            preferredFlag: this.getStatusFlag(this.selectedEmailData?.preferredFlag)   , 
            paperlessFlag: this.getStatusFlag(this.selectedEmailData?.paperlessFlag)   
          }) 
        }       

onclientEmailFormSubmit()
{    
  this.isFormSubmitted =true;
  if(this.clientEmailForm.valid)
     {   
      this.btnDisabled = true;
      const emailData =
      {         
        clientEmailId: this.clientEmailForm?.controls["clientEmailId"].value,
        email: this.clientEmailForm?.controls["email"].value   ,
        detailMsgFlag: this.getFlag(this.clientEmailForm?.controls["detailMsgFlag"].value)   ,       
        preferredFlag: this.getFlag(this.clientEmailForm?.controls["preferredFlag"].value),
        paperlessFlag : this.getFlag(this.clientEmailForm?.controls["paperlessFlag"].value)   ,
      }    
      this.addClientEmailEvent.emit(emailData);
     }   
 }

 private getFlag(flag?: boolean) {
  return flag ? StatusFlag.Yes : StatusFlag.No;
}

private getStatusFlag(status?: StatusFlag) {
  return status === StatusFlag.Yes ? true : false;
}
}
