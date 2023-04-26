/** Angular **/import {  Component,  OnInit,  ChangeDetectionStrategy,  Input,  Output,  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Facades  **/
import { ContactFacade, StatusFlag } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-phone-detail',
  templateUrl: './phone-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditValue!: boolean;
  @Input() lovClientPhoneDeviceType$ : any
  @Input() selectedPhoneData: any
  @Output() addClientPhoneEvent = new EventEmitter<any>();
  @Output() loadDeviceTypeLovEvent = new EventEmitter<any>(); 
  @Output() deactivateClientPhoneEvent = new EventEmitter<any>(); 
  @Output() formClientPhoneCloseEvent = new EventEmitter<any>(); 

  /** Public properties **/
  selectedclientPhoneId! : string
  ddlPhoneTypes$ = this.contactFacade.ddlPhoneTypes$;
  isDeactivateValue!: boolean;
  isDeactivatePhoneNumberPopup = true;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  displayPhoneNote = false
  clientPhoneForm!: FormGroup;
  isFormSubmitted =false;
  btnDisabled = false;
  isDeleted = false;
  otherNoteError =false
  noteCounter!: string;
  noteCharachtersCount!: number;
  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade,
    private formBuilder: FormBuilder) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.composePhoneForm()
    this.loadDdlPhoneType();
  }

  /** Private methods **/
  private loadDdlPhoneType() {
    this.loadDeviceTypeLovEvent.emit();
  }
  
  deviceTypeSelectionChange(codes : any)
  {
    if(codes?.lovCode==='OP')
    {
      this.displayPhoneNote = true
    }
    else
    {
      this.displayPhoneNote = false
    }
  }
  /** Internal event methods **/
  onDeactivateClicked() {
    this.deactivateClientPhoneEvent.emit(this.selectedclientPhoneId);
  }

  onDeactivatePhoneNumberClosed() {
    this.formClientPhoneCloseEvent.emit();
  }

  composePhoneForm()
  {    
      this.clientPhoneForm = this.formBuilder.group({   
        clientPhoneId: ['']   ,
        phoneNbr: ['',Validators.required]   ,
        detailMsgConsentFlag: ['']   ,
        deviceTypeCode: ['',Validators.required]   ,
        smsTextConsentFlag: ['']   ,       
        preferredFlag: ['']   , 
        otherPhoneNote:['']      
      });     

      if(this.isEditValue === true)
      {
        this.onSelectedPhoneFormLoad()
      }
  }

  onSelectedPhoneFormLoad()
  {     
    this.selectedclientPhoneId = this.selectedPhoneData?.clientPhoneId 
    this.isDeleted = this.selectedPhoneData?.isDeleted 
    this.incomeNoteWordCount(this.selectedPhoneData?.otherPhoneNote)
    this.clientPhoneForm.setValue(
            {
              clientPhoneId: this.selectedPhoneData?.clientPhoneId   ,
              phoneNbr: this.selectedPhoneData?.phoneNbr   ,
              detailMsgConsentFlag: this.getStatusFlag(this.selectedPhoneData?.detailMsgConsentFlag)   ,
              deviceTypeCode: this.selectedPhoneData?.deviceTypeCode   ,
              smsTextConsentFlag: this.getStatusFlag(this.selectedPhoneData?.smsTextConsentFlag)   ,       
              preferredFlag: this.getStatusFlag(this.selectedPhoneData?.preferredFlag)   , 
              otherPhoneNote: this.selectedPhoneData?.otherPhoneNote  
            }) 
            this.displayPhoneNote = (this.selectedPhoneData?.deviceTypeCode === 'OP')
  }

  onclientPhoneFormSubmit()
  {    
    this.isFormSubmitted =true;
    if(this.displayPhoneNote && !this.clientPhoneForm?.controls["otherPhoneNote"].value)
    {
      this.otherNoteError = true;
    }
    else
    {
      this.otherNoteError = false;
    }

    if(this.clientPhoneForm.valid && !this.otherNoteError)
       {    
        this.btnDisabled = true;
        const phoneData =
        {         
          clientPhoneId: this.clientPhoneForm?.controls["clientPhoneId"].value,
          phoneNbr: this.clientPhoneForm?.controls["phoneNbr"].value   ,
          detailMsgConsentFlag: this.getFlag(this.clientPhoneForm?.controls["detailMsgConsentFlag"].value)   ,
          deviceTypeCode: this.clientPhoneForm?.controls["deviceTypeCode"].value   ,
          smsTextConsentFlag: this.getFlag(this.clientPhoneForm?.controls["smsTextConsentFlag"].value) , 
          preferredFlag: this.getFlag(this.clientPhoneForm?.controls["preferredFlag"].value),
          otherPhoneNote : this.clientPhoneForm?.controls["otherPhoneNote"].value   ,
        }    
        this.addClientPhoneEvent.emit(phoneData);
       }   
   }

   private getFlag(flag?: boolean) {
    return flag ? StatusFlag.Yes : StatusFlag.No;
  }

  private getStatusFlag(status?: StatusFlag) {
    return status === StatusFlag.Yes ? true : false;
  }

  onIncomeNoteValueChange(event: any): void {
    this.noteCharachtersCount = event.length;
    this.noteCounter = `${this.noteCharachtersCount}/75`;
  }
  private incomeNoteWordCount(note : string) {
    this.noteCharachtersCount = note ? note.length : 0;
    this.noteCounter = `${this.noteCharachtersCount}/75`;
  }
}
