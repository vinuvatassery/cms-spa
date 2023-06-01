/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-disenroll-client',
  templateUrl: './disenroll-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisenrollClientComponent implements OnInit {
  disenrollmentReason$ = this.lovFacade.disenrollmentReason$;
  @Output() isCloseDisenrollModal: EventEmitter<any> = new EventEmitter();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  disEnrollForm!: FormGroup;
  /** Constructor **/
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.lovFacade.getDisenrollmentReasonLovs();
  }

  buildForm() {
    this.disEnrollForm = this.formBuilder.group({
      disenrollReasonCode: [null],
    });
  }

  disEnroll(confirm: boolean) { 
    this.disEnrollForm.controls['disenrollReasonCode'].setValidators([Validators.required,])
    this.disEnrollForm.controls['disenrollReasonCode'].updateValueAndValidity();

    if (this.disEnrollForm.controls['disenrollReasonCode'].value) {
      const clientDisenrollData = {
        cancel: confirm,
        disenrollReasonCode:
          this.disEnrollForm.controls['disenrollReasonCode'].value,
      };
      this.isCloseDisenrollModal.emit(clientDisenrollData);
    }
    else if(confirm === true)
    {
      const clientDisenrollData = {
        cancel: confirm       
      };
      this.isCloseDisenrollModal.emit(clientDisenrollData);
    }
   
  }
}
