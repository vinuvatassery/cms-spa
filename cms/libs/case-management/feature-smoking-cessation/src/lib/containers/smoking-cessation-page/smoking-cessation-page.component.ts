/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, SmokingCessationFacade, NavigationType, CaseFacade, CompletionChecklist, StatusFlag, SmokingCessation, YesNoFlag, ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-smoking-cessation-page',
  templateUrl: './smoking-cessation-page.component.html',
  styleUrls: ['./smoking-cessation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmokingCessationPageComponent implements OnInit, OnDestroy {

  private saveClickSubscription !: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  /** Public properties **/
  tareaCessationMaxLength = 300;
  tareaCessationCharachtersCount!: number;
  tareaCessationCounter!: string;
  tareaCessationNote = '';
  clientCaseId!: any;
  clientCaseEligibilityId!: any
  sessionId!: any;
  smokingCessationForm!: FormGroup;
  smokingCessation: SmokingCessation = {
    clientCaseEligibilityId: '',
    clientCaseId: '',
    smokingCessationReferralFlag: '',
    smokingCessationNoteApplicableFlag: '',
    smokingCessationNote: ''
  };
  isDisabled = false;


  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private workflowFacade: WorkflowFacade,
    private smokingCessationFacade: SmokingCessationFacade,
    private route: ActivatedRoute,
    private caseFacad: CaseFacade,
    private loaderService: LoaderService,
    private loggingService: LoggingService,
    private router:Router
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {

    this.buildForm();
    this.loadSessionData();
    this.tareaVariablesIntiation();
    this.addSaveSubscription();
    this.smokingCessationFormChanged();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }
  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.loadSmokingCessation();
        }
      });

  }
  /** Private methods **/
  private buildForm() {
    this.smokingCessationForm = new FormGroup({
      smokingCessation: new FormControl(''),
      smokingCessationNote: new FormControl('')
    });
  }

  private loadSmokingCessation() {
    this.isDisabled = false;
    this.smokingCessationFacade.loadSmokingCessation(this.clientCaseEligibilityId,
      this.clientCaseId).subscribe({
        next: response => {
          this.smokingCessationForm.controls["smokingCessationNote"].setValue(response.smokingCessationNote)
          if (response.smokingCessationReferralFlag == StatusFlag.Yes) {
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.Yes)
            this.isDisabled = false;
          }
          else if (response.smokingCessationReferralFlag == StatusFlag.No) {
            this.smokingCessationForm.controls["smokingCessation"].setValue(YesNoFlag.No)
            this.isDisabled = true;
          }


        },
        error: error => {
          this.smokingCessationFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR, error?.error?.error)

          this.loggingService.logException({ name: SnackBarNotificationType.ERROR, message: error?.error?.error })
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
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.smokingCessationFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Smoking cessation saved sucessfully')
        this.workflowFacade.navigate(navigationType);
      }
    });
  }
  private save() {
    this.validate();
    if (this.smokingCessationForm.valid) {
      this.loaderService.show();
      this.smokingCessation.clientCaseEligibilityId = this.clientCaseEligibilityId;
      this.smokingCessation.clientCaseId = this.clientCaseId;
      return this.smokingCessationFacade.updateSmokingCessation(this.smokingCessation);

    }
    return of(false)
  }
  private validate(): void {
    this.smokingCessationForm.controls["smokingCessation"].setValidators([Validators.required])
    if (this.smokingCessationForm.value.smokingCessation == YesNoFlag.Yes) {
      this.smokingCessationForm.controls["smokingCessationNote"].setValidators([Validators.required]);
      this.smokingCessation.smokingCessationNoteApplicableFlag = StatusFlag.Yes;
      this.smokingCessation.smokingCessationReferralFlag = StatusFlag.Yes;
      this.smokingCessation.smokingCessationNote = this.smokingCessationForm.value.smokingCessationNote;
    }
    else {
      this.smokingCessationForm.controls["smokingCessationNote"].clearValidators();
      this.smokingCessation.smokingCessationNoteApplicableFlag = StatusFlag.No;
      this.smokingCessation.smokingCessationReferralFlag = StatusFlag.No;
      this.smokingCessation.smokingCessationNote = '';
    }
    this.smokingCessationForm.controls['smokingCessationNote'].updateValueAndValidity()
    this.smokingCessationForm.controls["smokingCessation"].updateValueAndValidity()
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
      else {
        if (this.smokingCessationForm?.get(key)?.value && this.smokingCessationForm?.get(key)?.valid) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: StatusFlag.Yes
          };

          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }


  private tareaVariablesIntiation() {
    this.tareaCessationCharachtersCount = this.tareaCessationNote
      ? this.tareaCessationNote.length
      : 0;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }

  /** Internal event methods **/
  onChangeCounterClick() {

  }

  /** Public methods **/
  onTareaCessationValueChange(event: any): void {
    this.tareaCessationCharachtersCount = event.length;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }
  disableSmokingCessationNote(disable: boolean) {
    if (disable) {
      this.smokingCessationForm.controls["smokingCessationNote"].clearValidators();
      this.smokingCessationForm.controls["smokingCessationNote"].updateValueAndValidity()
    }
    this.isDisabled = disable;
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate(['/case-management/cases/case360/100'])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations() {
    this.validate();
    if (this.smokingCessationForm.valid) {
      return true;
    }
    return false;
  }

}
