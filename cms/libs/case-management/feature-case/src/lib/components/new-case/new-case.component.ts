/** Angular **/
import {
  Component, ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
/** Internal Libraries **/
import { CaseFacade, ScreenFlowType } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {
  ButtonSize,
  ButtonRounded,
  ButtonFillMode,
  ButtonThemeColor,
} from "@progress/kendo-angular-buttons";

@Component({
  selector: 'case-management-new-case',
  templateUrl: './new-case.component.html',
  styleUrls: ['./new-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCaseComponent implements OnInit {
  public buttonFillMode: ButtonFillMode = "outline"
  currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  newCaseForm!: FormGroup;
  
  /*** Output ***/
  @Output() isCreateNewCasePopupOpened = new EventEmitter();

  /** Public properties **/
  caseSearchResults$ = this.caseFacade.caseSearched$;
  caseOwners$ = this.caseFacade.caseOwners$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  isProgramSelectionOpened = false;
  selectedProgram!: any;
  isSubmitted!:boolean;

  /** Constructor**/
  constructor(
    private fb:FormBuilder,
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef,
    
  ) {
    this.newCaseForm=this.fb.group({
      caseOrigin:[null,Validators.required],
      caseOwner:[null,Validators.required],
      dateApplicationReceived:[this.currentDate,Validators.required],
    });
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {   
      

    this.loadCaseBySearchText();
    this.loadCaseOwners();
    this.loadDdlPrograms();
    this.loadDdlCaseOrigins();
    
  }

  /** Private methods **/
  private loadCaseBySearchText() {
    this.caseFacade.loadCaseBySearchText();
  }

  private loadCaseOwners() {
    this.caseFacade.loadCaseOwners();
  }

  private loadDdlPrograms() {
    this.caseFacade.loadDdlPrograms();
    this.ddlPrograms$.subscribe({
      next: (programs: any) => {
        this.selectedProgram = programs.filter(
          (data: any) => {console.log(data);
            data.default === true}
        )[0];
      },
      error: (err: any) => {
        console.log('Err', err);
      },
    });
  }

  private loadDdlCaseOrigins() {
    this.caseFacade.loadDdlCaseOrigins();
  }

  /** Internal event methods **/
  onOpenProgramSelectionClicked() {
    this.isProgramSelectionOpened = true;
    this.ref.markForCheck();
  }

  onCreateCaseClicked() {
    this.isSubmitted=true;
    if(this.newCaseForm.valid){
    this.router.navigate(['case-management/case-detail'], {
      queryParams: {
        screenFlowType: ScreenFlowType.NewCase,
        programId: this.selectedProgram!=undefined? this.selectedProgram.key:0,
      },
    });
  }
  }

  onCloseProgramSelectionClicked() {
    this.isCreateNewCasePopupOpened.emit();
    this.isProgramSelectionOpened = false;
  }
}

