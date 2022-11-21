/** Angular **/
import {  Component, OnInit,  ChangeDetectionStrategy,
   ChangeDetectorRef,  Output,  EventEmitter,  Input,} from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';

/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'case-management-new-case',
  templateUrl: './new-case.component.html',
  styleUrls: ['./new-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCaseComponent implements OnInit {

  /*** Output ***/
  @Output() isCreateNewCasePopupOpened = new EventEmitter();
  @Output() newcaseSaveEvent = new EventEmitter<any>();

  /** input properties **/
  @Input() caseSearchResults! : any
  @Input() caseOwners ! : any
  @Input() ddlPrograms! : any
  @Input() ddlCaseOrigins! : any
  @Input() formButtonDisabled! : boolean

    /** Public properties **/
  parentForm! : FormGroup;
  isProgramSelectionOpened = false;
  selectedProgram!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
 
  isSubmitted! : boolean ;
  /** Constructor**/
  constructor(   
    private readonly ref: ChangeDetectorRef, 
    private formBuilder: FormBuilder
  ) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.setDefaultProgram();  
    this.registerFormData();
  }
  private setDefaultProgram() {   
    this.ddlPrograms.subscribe({
      next: (programs: any) => {
        this.selectedProgram = programs.filter(
          (data: any) => data.programCode == "CA"
        )[0];
      }
    });  
  }
  private registerFormData()
  {
    this.parentForm = this.formBuilder.group({
      applicationDate: [new Date(), Validators.required],
      caseOriginCode: ['', Validators.required],
      caseOwnerId: ['', Validators.required],
      programId: [this.selectedProgram.programId, [Validators.required]]   
      });
  }

  /** Internal event methods **/
  onOpenProgramSelectionClicked() {
    this.isProgramSelectionOpened = true;
    this.formButtonDisabled = false;
    this.ref.markForCheck();
  }

  onSubmit() {     
    this.isSubmitted = true;
    this.newcaseSaveEvent.emit(this.parentForm);
  }

  onCloseProgramSelectionClicked() {
    this.isCreateNewCasePopupOpened.emit();
    this.isProgramSelectionOpened = false;
  }
}
