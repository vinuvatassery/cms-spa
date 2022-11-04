/** Angular **/
import { Component, ChangeDetectionStrategy, ViewChild, ElementRef,ChangeDetectorRef,OnInit ,Input} from '@angular/core';
/** Services **/
import { CaseFacade, ScreenFlowType } from '@cms/case-management/domain';
import {
    DateInputSize,
    DateInputRounded,
    DateInputFillMode,
  } from '@progress/kendo-angular-dateinputs';

import { Router } from '@angular/router';

@Component({
  selector: 'case-management-case-detail',
  templateUrl: './case-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailComponent implements OnInit {

    currentDate = new Date();
    public size: DateInputSize = 'medium';
    public rounded: DateInputRounded = 'full';
    public fillMode: DateInputFillMode = 'outline';
    selectedProgram!: any;
    @Input() isProgramControlVisible:any;

  caseOwners$ = this.caseFacade.caseOwners$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;

  constructor(
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    console.log('test');
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