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
import {FormGroup} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa' ;

@Component({
  selector: 'common-case-card',
  templateUrl: './case-common-card.component.html',
  styleUrls: ['./case-common-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseCommonCardComponent implements OnInit {
    currentDate = new Date();
    public size: DateInputSize = 'medium';
    public rounded: DateInputRounded = 'full';
    public fillMode: DateInputFillMode = 'outline';
    selectedProgram!: any;
    @Input() isProgramControlVisible: any;
    @Input() parentForm!: FormGroup;
    @Input() submitted!: Boolean;
    public formUiStyle : UIFormStyle = new UIFormStyle();
    
    caseOwners$ = this.caseFacade.caseOwners$;
    ddlPrograms$ = this.caseFacade.ddlPrograms$;
    ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
    caseCommon:any;

    constructor(
      private readonly router: Router,
      private readonly caseFacade: CaseFacade,
      private readonly ref: ChangeDetectorRef
    ) {
    }

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