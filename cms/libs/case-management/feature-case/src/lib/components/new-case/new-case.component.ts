/** Angular **/
import {
  Component, OnInit, ChangeDetectionStrategy,
  ChangeDetectorRef, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramCode, CaseFacade, CaseStatusCode } from '@cms/case-management/domain';

import { Router } from '@angular/router';
/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'case-management-new-case',
  templateUrl: './new-case.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCaseComponent implements OnInit  {
  public showInputLoader = false;
  /*** Output ***/
  @Output() isCreateNewCasePopupOpened = new EventEmitter();
  @Output() newcaseSaveEvent = new EventEmitter<any>();
  @Output() searchTextEvent = new EventEmitter<string>();

  /** input properties **/
  @Input() caseSearchResults$! : any
  @Input() caseOwners ! : any
  @Input() ddlPrograms! : any
  @Input() ddlCaseOrigins! : any
  @Input() formButtonDisabled! : boolean
  @ViewChild('searchcaseornew')
  private searchcaseornew: any ;

  /** Public properties **/
  parentForm! : FormGroup;
  isProgramSelectionOpened = false;
  selectedProgram!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  filterManager: Subject<string> = new Subject<string>();
  showSearchresult! : false

  isSubmitted! : boolean ;

  clientInfo: any[] = [];
  /** Constructor**/
  constructor(
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public  intl: IntlService,
    private caseFacade: CaseFacade,
    private loggingService: LoggingService,
    private router: Router
  ) {

    this.filterManager
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(

        (text) => 
        {
          if(text && text.length > 2)
          {
            this.searchTextEvent.emit(text)
            this.showInputLoader = false;

          }
        }

      );
    this.showInputLoader = false;
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.setDefaultProgram();
    this.registerFormData();
  }

  private setDefaultProgram() {
    this.ddlPrograms.subscribe({
      next: (programs: any) => {
        this.selectedProgram = programs.filter(
          (data: any) => data.programCode == ProgramCode.DefaultProgram
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
      programId: [{ value: this.selectedProgram?.programId, disabled: true }, [Validators.required]] ,
      concurrencyStamp : ['']  
    });

  }


  /** Internal event methods **/
  onOpenProgramSelectionClicked() {
    this.loaderService.show()
    this.isProgramSelectionOpened = true;
    this.formButtonDisabled = false;
    this.ref.markForCheck();
  }

  onSubmit() {
    this.parentForm.markAllAsTouched();
    this.isSubmitted = true;
    this.newcaseSaveEvent.emit(this.parentForm);

  }

  onCloseProgramSelectionClicked() {
    this.isCreateNewCasePopupOpened.emit();
    this.isProgramSelectionOpened = false;
  }

  onsearchTextChange(text : string)
  { 

    if(text && text.length > 2){ 
      this.showInputLoader = true;
      this.filterManager.next(text);
    }
  }

  onClientSelected(event: any) {
    if (event) {
      if (event.caseStatus !== CaseStatusCode.incomplete) {
        this.router.navigate([`/case-management/cases/case360/${event.clientId}`]);
      }
      else {
        this.loaderService.show();
        this.caseFacade.getSessionInfoByCaseEligibilityId(event.clientCaseEligibilityId).subscribe({
          next: (response: any) => {            
            if (response) {
              this.loaderService.hide();
              this.router.navigate(['case-management/case-detail'], {
                queryParams: {
                  sid: response.sessionId,
                  eid: response.entityID,                   
                  wtc: response?.workflowTypeCode
                },
              });
            }
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err); 
            this.loggingService.logException(err)
          }
        })
      }
    }
  }

}
