 

/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnDestroy, OnInit, } from '@angular/core';
/** External libraries **/
import { first, forkJoin, mergeMap, of, Subscription, Observable } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, IncomeFacade, NavigationType, NoIncomeData } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Validators, FormGroup, FormControl, FormBuilder, } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomePageComponent implements OnInit, OnDestroy {

  /** Private properties **/
  private saveClickSubscription !: Subscription;  /** Public Methods **/
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  incomes$ = this.incomeFacade.incomes$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  hasNoIncome = false;
  isNodateSignatureNoted = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() isEditValue!: boolean;
  todaysDate = new Date();
  noIncomeData = new NoIncomeData();
  /** Public properties **/
  incomeTypes$ = this.incomeFacade.ddlIncomeTypes$;
  incomeSources$ = this.incomeFacade.ddlIncomeSources$;
  frequencies$ = this.incomeFacade.ddlFrequencies$;
  proofOfIncomeTypes$ = this.incomeFacade.ddlProofOfIncomdeTypes$;
  hasNoProofOfIncome = false;
  incomeNoteCounter!: string;
  incomeNote = '';
  incomeNoteCharachtersCount!: number;
  incomeNoteMaxLength = 300;
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  incomeData: any = {};
  noIncomeFlag: boolean = false;
  private loadSessionSubscription!: Subscription;
  public noIncomeDetailsForm: FormGroup = new FormGroup({
    noIncomeClientSignedDate: new FormControl('', []),
    noIncomeSignatureNotedDate: new FormControl(this.todaysDate, []),
    noIncomeNote: new FormControl('', []),
  });
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private lov: LovFacade,
    private route: ActivatedRoute,
    private readonly loaderService: LoaderService) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.loadIncomeTypes();
    this.incomeNoteWordCount();
    this.loadIncomeSources();
    this.loadFrequencies();
    this.loadProofOfIncomeTypes();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  /** Private methods **/
  private incomeNoteWordCount() {
    this.incomeNoteCharachtersCount = this.incomeNote
      ? this.incomeNote.length
      : 0;
    this.incomeNoteCounter = `${this.incomeNoteCharachtersCount}/${this.incomeNoteMaxLength}`;
  }

  private loadIncomeTypes() {
    this.lov.getIncomeTypeLovs();
  }

  private loadIncomeSources() {
    this.lov.getIncomeSourceLovs();
  }

  private loadFrequencies() {
    this.lov.getIncomeFrequencyLovs();
  }

  private loadProofOfIncomeTypes() {
    this.incomeFacade.loadDdlProofOfIncomeTypes();
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    if(this.hasNoIncome){
      let isValid = true;
      this.submitIncomeDetailsForm();
      if (this.noIncomeDetailsForm.valid && isValid) {
        this.loaderService.show();
        return this.incomeFacade.save(this.noIncomeData);
      }
    }
    else{
      this.noIncomeData.clientCaseEligibilityId = this.clientCaseEligibilityId;
      this.noIncomeData.clientId = this.clientId
      this.noIncomeData.noIncomeFlag = "N";
      this.loaderService.show();
      return this.incomeFacade.save(this.noIncomeData);
    }
    return of(false)
  }

  /** Internal event methods **/
  onIncomeNoteValueChange(event: any): void {
    this.incomeNoteCharachtersCount = event.length;
    this.incomeNoteCounter = `${this.incomeNoteCharachtersCount}/${this.incomeNoteMaxLength}`;
  }

  onProofOfIncomeValueChanged() {
    this.hasNoProofOfIncome = !this.hasNoProofOfIncome;
  }

  /** Private Methods **/
  private loadIncomes(clientId: string, clientCaseEligibilityId: string,skip:any,pageSize:any): void {
    this.incomeFacade.loadIncomes(clientId, clientCaseEligibilityId,skip,pageSize);
    this.incomeFacade.incomesResponse$.subscribe((incomeresponse: any) => {
      this.incomeData = incomeresponse;
      if (incomeresponse.noIncomeData!=null) {
        this.noIncomeFlag = true;
        this.noIncomeDetailsForm = new FormGroup({
          noIncomeClientSignedDate: new FormControl('', []),
          noIncomeSignatureNotedDate: new FormControl(this.todaysDate, []),
          noIncomeNote: new FormControl('', []),
        });
        this.isNodateSignatureNoted = true;
        this.hasNoIncome = true;
        this.setIncomeDetailFormValue(this.incomeData?.noIncomeData);
      }
    })
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  /** Internal Event Methods **/
  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Income',
      completed: 15,
      total: 31,
    });
  }

  onIncomeValueChanged(event: any) {
    this.hasNoIncome = !this.hasNoIncome;
    if (this.hasNoIncome) {
      this.noIncomeDetailsForm = new FormGroup({
        noIncomeClientSignedDate: new FormControl('', []),
        noIncomeSignatureNotedDate: new FormControl(this.todaysDate, []),
        noIncomeNote: new FormControl('', []),
      });
      this.isNodateSignatureNoted = true;
      this.setIncomeDetailFormValue(this.incomeData?.noIncomeData);
    }
  }

  public submitIncomeDetailsForm(): void {
    this.noIncomeDetailsForm.markAllAsTouched();
    if (this.hasNoIncome) {
      this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValidators([
        Validators.required,
      ]);
      this.noIncomeDetailsForm.controls[
        'noIncomeClientSignedDate'
      ].updateValueAndValidity();
      this.noIncomeDetailsForm.controls[
        'noIncomeSignatureNotedDate'
      ].updateValueAndValidity();
      this.noIncomeDetailsForm.controls[
        'noIncomeNote'
      ].updateValueAndValidity();
      // this.onDoneClicked();
      if (this.noIncomeDetailsForm.valid) {
        this.noIncomeData.noIncomeFlag = this.hasNoIncome == true ? "Y" : "N";
        this.noIncomeData.clientCaseEligibilityId = this.clientCaseEligibilityId;
        this.noIncomeData.clientId = this.clientId
        this.noIncomeData.noIncomeClientSignedDate = this.noIncomeDetailsForm.get("noIncomeClientSignedDate")?.value;
        this.noIncomeData.noIncomeSignatureNotedDate = this.noIncomeDetailsForm.get("noIncomeSignatureNotedDate")?.value;
        this.noIncomeData.noIncomeNote = this.noIncomeDetailsForm.get("noIncomeNote")?.value;
      }
    }
  }

  setIncomeDetailFormValue(incomeDetail: any) {
    if (incomeDetail) {
      this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValue(new Date(incomeDetail.noIncomeClientSignedDate));
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValue(new Date(incomeDetail.noIncomeSignatureNotedDate));
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValue(incomeDetail.noIncomeNote);
    }
  }

  loadSessionData() {
    //this.loaderService.show();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          const gridDataRefinerValue = {
            skipCount: this.incomeFacade.skipCount,
            pagesize: this.incomeFacade.gridPageSizes[0]?.value
          };
          this.loadIncomeListHandle(gridDataRefinerValue)
        }
      });
  }

  loadIncomeListHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize
    };
    this.loadIncomes(
      this.clientId,
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount
    );
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        //this.workflowFacade.navigate(navigationType);
        this.loaderService.hide();
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

  checkValidations(){
    this.submitIncomeDetailsForm();
    if(this.noIncomeDetailsForm.valid){
      return true;
    }
    return false;
  }
}
