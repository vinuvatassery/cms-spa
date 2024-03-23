/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit, } from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
/** External libraries **/
import { debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription, tap } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, SmokingCessationFacade, NavigationType, CompletionChecklist, SmokingCessation} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusFlag,YesNoFlag } from '@cms/shared/ui-common';


@Component({
  selector: 'case-management-smoking-cessation-page',
  templateUrl: './smoking-cessation-page.component.html',
  styleUrls: ['./smoking-cessation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmokingCessationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  private saveClickSubscription !: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  /** Public properties **/
  tareaCessationMaxLength = 300;
  tareaCessationCharachtersCount!: number;
  tareaCessationCounter!: string;
  tareaCessationNote = '';
  clientCaseId!: any;
  clientCaseEligibilityId!: any
  clientId:any;
  sessionId!: any;
  public smokingCessationForm!: FormGroup;
  smokingCessation: SmokingCessation = {
    clientCaseEligibilityId: '',
    clientCaseId: '',
    clientId: 0,
    smokingCessationReferralFlag: '',
    smokingCessationNotApplicableFlag: '',
    note: ''
  };
  isDisabled = true;
  prevClientCaseEligibilityId! : any;
  isCerForm = false;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private workflowFacade: WorkflowFacade,
    private smokingCessationFacade: SmokingCessationFacade,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private loggingService: LoggingService,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.loadSessionData();
    this.tAreaVariablesInitiation();
    this.addSaveSubscription();
    this.smokingCessationFormChanged();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.addDiscardChangesSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();

  }

  loadSessionData() {

    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        this.smokingCessationForm.controls["changeDetect"].setValue('changed'); // added just to detect changes in the screen.
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId
          this.prevClientCaseEligibilityId = JSON.parse(
            session.sessionData
          )?.prevClientCaseEligibilityId;
          if (this.prevClientCaseEligibilityId) {
            this.isCerForm = true;
          }
          this.loadSmokingCessation();
        }
      });
  }
  /** Private methods **/ 
  public buildForm() {
    this.smokingCessationForm = new FormGroup({
      smokingCessation: new FormControl('', []),
      smokingCessationNote: new FormControl('', []),
      changeDetect: new FormControl({ value: '', disabled: true }, []),
    });
  }

  private loadSmokingCessation() {
    this.isDisabled = true;
    this.loaderService.show();
    this.smokingCessationFacade.loadSmokingCessation(this.clientCaseEligibilityId,
      this.clientCaseId,this.clientId).subscribe({
        next: response => {
          this.smokingCessationForm.reset();
          this.smokingCessationForm.controls["smokingCessationNote"].setValue(response.note)
          if (response.smokingCessationNotApplicableFlag == StatusFlag.Yes) {
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.Yes)
            this.isDisabled = false;
          }
          else if (response.smokingCessationNotApplicableFlag == StatusFlag.No) {
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.No)
            this.isDisabled = true;
          }
          else if(this.isCerForm){
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.DidNotAnswer)
            this.isDisabled = true;
          }
          this.changeDetector.detectChanges();
          this.adjustDataAttribute(!this.isDisabled);
          this.loaderService.hide();
        },
        error: error => {
          this.smokingCessationFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)

          this.loggingService.logException({ name: SnackBarNotificationType.ERROR, message: error });
          this.loaderService.hide();
          this.changeDetector.detectChanges();
        }

      });

  }
  private smokingCessationFormChanged() {
    this.smokingCessationForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null),
        pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
      });
    this.changeDetector.detectChanges();
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.smokingCessationFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Smoking cessation saved Sucessfully')
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }
  private save() {
    this.validate();
    this.changeDetector.detectChanges();
    if (this.smokingCessationForm.valid) {
      this.loaderService.show();
      this.smokingCessation.clientCaseEligibilityId = this.clientCaseEligibilityId;
      this.smokingCessation.clientCaseId = this.clientCaseId;
      this.smokingCessation.clientId = this.clientId;
      return this.smokingCessationFacade.updateSmokingCessation(this.smokingCessation,this.clientId);

    }
    return of(false)
  }
  
  public validate() {
    this.smokingCessationForm.markAllAsTouched();
    this.smokingCessationForm.controls["smokingCessation"].setValidators([Validators.required,this.smokingCessationValueValidator()]);
    this.smokingCessationForm.controls["smokingCessation"].updateValueAndValidity();
    if (this.smokingCessationForm.value.smokingCessation === YesNoFlag.Yes) {
      this.smokingCessation.smokingCessationNotApplicableFlag = StatusFlag.Yes;
      this.smokingCessation.smokingCessationReferralFlag = StatusFlag.Yes;
      this.smokingCessation.note = this.smokingCessationForm.value.smokingCessationNote;
    }
    else if (this.smokingCessationForm.value.smokingCessation === YesNoFlag.No) {
      this.smokingCessation.smokingCessationNotApplicableFlag = StatusFlag.No;
      this.smokingCessation.smokingCessationReferralFlag = StatusFlag.No;
      this.smokingCessation.note = '';
    }
  }
  smokingCessationValueValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }
        return value === YesNoFlag.DidNotAnswer ? {DidNotAnswer:true}: null;
    }
}
  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.smokingCessationForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }


  private tAreaVariablesInitiation() {
    this.tareaCessationCharachtersCount = this.tareaCessationNote
      ? this.tareaCessationNote.length
      : 0;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }

  /** Internal event methods **/

  /** Public methods **/
  onTareaCessationValueChange(event: any): void {
    this.tareaCessationCharachtersCount = event.length;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }
  disableSmokingCessationNote(disable: boolean) {
    if (disable) {
      this.smokingCessationForm.controls["smokingCessationNote"].clearValidators();
      this.smokingCessationForm.controls["smokingCessationNote"].updateValueAndValidity();
    }
    this.isDisabled = disable;
    this.adjustDataAttribute(!disable);
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      if (this.checkValidations()) {
        this.save().subscribe((response: any) => {
          if (response) {
            this.loaderService.hide();
            this.workflowFacade.handleSendNewsLetterpopup(statusResponse)
          }
        })
      }
      else {
        this.workflowFacade.handleSendNewsLetterpopup(statusResponse)
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        this.checkValidations()
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

  private adjustDataAttribute(isRequired: boolean) {
    const data: CompletionChecklist = {
      dataPointName: 'smokingCessationNote_Required',
      status: StatusFlag.No
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
    this.updateInitialWorkflowChecklist();
  }

  private updateInitialWorkflowChecklist() {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.smokingCessationForm.controls).forEach(key => {
      if (this.smokingCessationForm?.get(key)?.value) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes
        };

        completedDataPoints.push(item);
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  checkValidations() {
    this.validate();
    return this.smokingCessationForm.valid;
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
     if(response){
      this.smokingCessationForm.controls["smokingCessation"].setValidators(null);
      this.smokingCessationForm.controls["smokingCessation"].updateValueAndValidity();
      this.loadSmokingCessation();
     }
    });
  }

}
