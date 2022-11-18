/** Angular **/
import { Component,  Input, OnInit,ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
/** Internal Libraries **/
import { CaseFacade, CaseScreenTab } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'  ;
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms'; 

@Component({
  selector: 'case-management-case-detailed-summary',
  templateUrl: './case-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsSummaryComponent implements OnInit {
 
  currentDate = new Date();
  caseOwners$ = this.caseFacade.caseOwners$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  isProgramSelectionOpened = false;
  
  selectedProgram!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() isProgramVIsible!: any;
  @Input() parentForm!: FormGroup;
  @Input() isSubmitted: any;
  

  /** Constructor**/
  constructor(
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef
   
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
  
    this.loadCaseOwners();
    this.loadDdlPrograms();
    this.loadDdlCaseOrigins();
  }


  private loadCaseOwners() {
    this.caseFacade.loadCaseOwners();
  }

  private loadDdlPrograms() {
    this.caseFacade.loadDdlPrograms();
    this.ddlPrograms$.subscribe({
      next: (programs: any) => {
        this.selectedProgram = programs.filter(
          (data: any) => data.default === true
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
  
}
