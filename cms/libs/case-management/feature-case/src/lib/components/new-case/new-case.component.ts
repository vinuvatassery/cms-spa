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
import { UIFormStyle } from '@cms/shared/ui-tpa'  
@Component({
  selector: 'case-management-new-case',
  templateUrl: './new-case.component.html',
  styleUrls: ['./new-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCaseComponent implements OnInit {

  currentDate = new Date();
 
  
  /*** Output ***/
  @Output() isCreateNewCasePopupOpened = new EventEmitter();
  @Output() newcaseSaveEvent = new EventEmitter<any>();

  /** Public properties **/
  caseSearchResults$ = this.caseFacade.caseSearched$;
  caseOwners$ = this.caseFacade.caseOwners$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  isProgramSelectionOpened = false;
  selectedProgram!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef
  ) {}

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

  /** Internal event methods **/
  onOpenProgramSelectionClicked() {
    this.isProgramSelectionOpened = true;
    this.ref.markForCheck();
  }

  onCreateCaseClicked() {
    this.newcaseSaveEvent.emit(this.selectedProgram.key);
  }

  onCloseProgramSelectionClicked() {
    this.isCreateNewCasePopupOpened.emit();
    this.isProgramSelectionOpened = false;
  }
}
