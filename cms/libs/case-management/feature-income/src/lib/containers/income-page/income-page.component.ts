

/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnDestroy, OnInit, ElementRef, AfterViewInit, } from '@angular/core';
/** External libraries **/
import {catchError, debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription, tap } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, IncomeFacade, NavigationType, NoIncomeData, CompletionChecklist, StatusFlag } from '@cms/case-management/domain';
import { IntlDateService,UIFormStyle } from '@cms/shared/ui-tpa';
import { Validators, FormGroup, FormControl, } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute, Router } from '@angular/router';
import {ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomePageComponent implements OnInit, OnDestroy, AfterViewInit {

  /** Private properties **/
  private saveClickSubscription !: Subscription;  /** Public Methods **/
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
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
  incomeListRequiredValidation = false;
  incomeNote = '';
  incomeNoteCharachtersCount!: number;
  incomeNoteMaxLength = 300;
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  incomeData: any = {};
  noIncomeFlag: boolean = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  private loadSessionSubscription!: Subscription;
  public noIncomeDetailsForm: FormGroup = new FormGroup({
    noIncomeClientSignedDate: new FormControl('', []),
    noIncomeSignatureNotedDate: new FormControl({value: this.todaysDate, disabled: true}, []),
    noIncomeNote: new FormControl('', []),
  });
  isCerForm = false;
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade,
    private readonly completionStatusFacade: CompletionStatusFacade,
    private readonly workflowFacade: WorkflowFacade,
    private readonly lov: LovFacade,
    private readonly route: ActivatedRoute,
    private readonly intl: IntlDateService,
    private readonly elementRef: ElementRef,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider : ConfigurationProvider,
	  private readonly router: Router) { }

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
    this.addDiscardChangesSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
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
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.incomeFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Income Status Updated')
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  private save() {
    if(this.hasNoIncome){
      let isValid = true;
      this.submitIncomeDetailsForm();
      if (this.noIncomeDetailsForm.valid && isValid) {
        this.loaderService.show();
        return this.incomeFacade.save(this.clientCaseEligibilityId, this.noIncomeData);
      }
    }
    else{
      if (!this.hasNoIncome && this.incomeData.clientIncomes != null)
      {
        this.loaderService.show();
        this.incomeFacade.incomeValidSubject.next(true);
        this.noIncomeData.noIncomeFlag = StatusFlag.No;
        this.noIncomeData.clientCaseEligibilityId = this.clientCaseEligibilityId;
        this.noIncomeData.clientId = this.clientId
        this.noIncomeData.noIncomeClientSignedDate = null;
        this.noIncomeData.noIncomeSignatureNotedDate = null;
        this.noIncomeData.noIncomeNote = null;
        this.loaderService.show();
        return this.incomeFacade.save(this.clientCaseEligibilityId, this.noIncomeData).pipe(
        catchError((err: any) => {
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
          return  of(false);
        })
        )
      }
      else
      {
        this.incomeFacade.incomeValidSubject.next(false);
        return  of(false);
      }
    }
    return of(false)
  }

  private noIncomeDetailsFormChangeSubscription() {
    this.noIncomeDetailsForm.valueChanges
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

  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.noIncomeDetailsForm.controls).forEach(key => {
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

  private adjustAttributeChanged() {
    const noIncome: CompletionChecklist = {
      dataPointName: 'incomeFlag_no',
      status: this.hasNoIncome  ? StatusFlag.Yes :StatusFlag.No
    };
    const yesIncome: CompletionChecklist = {
      dataPointName: 'incomeFlag_yes',
      status: !this.hasNoIncome  ? StatusFlag.Yes :StatusFlag.No
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([noIncome, yesIncome]);
    this.updateInitialCompletionCheckList();
  }

  private updateInitialCompletionCheckList(){
    if (this.hasNoIncome === true) {
    let completedDataPoints: CompletionChecklist[] = [];
        Object.keys(this.noIncomeDetailsForm.controls).forEach(key => {
            if (this.noIncomeDetailsForm?.get(key)?.value && this.noIncomeDetailsForm?.get(key)?.valid) {
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
  private loadIncomes(clientId: string, clientCaseEligibilityId: string,skip:any,pageSize:any, sortBy:any, sortType:any): void {
    this.loaderService.show();
    this.incomeFacade.loadIncomes(clientId, clientCaseEligibilityId,skip,pageSize, sortBy, sortType);
    this.incomeFacade.incomesResponse$.subscribe((incomeresponse: any) => {
      this.incomeData = incomeresponse;
      this.incomeListRequiredValidation = false;
      if (incomeresponse.noIncomeData!=null) {
        this.noIncomeFlag = true;
        this.noIncomeDetailsForm = new FormGroup({
          noIncomeClientSignedDate: new FormControl('', []),
          noIncomeSignatureNotedDate: new FormControl({value: this.todaysDate, disabled: true}, []),
          noIncomeNote: new FormControl('', []),
        });
        this.noIncomeDetailsFormChangeSubscription();
        this.isNodateSignatureNoted = true;
        this.hasNoIncome = true;
        this.setIncomeDetailFormValue(this.incomeData?.noIncomeData);
      }
      else
      {
        this.noIncomeFlag = false;
        this.isNodateSignatureNoted = false;
        this.hasNoIncome = false;
        this.setIncomeDetailFormValue(null);
      }
      this.loaderService.hide();

      this.adjustAttributeChanged();
    })
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  /** Internal Event Methods **/
  onIncomeValueChanged(event: any) {
    this.hasNoIncome = !this.hasNoIncome;
    if (this.hasNoIncome) {
      this.noIncomeDetailsForm = new FormGroup({
        noIncomeClientSignedDate: new FormControl('', []),
        noIncomeSignatureNotedDate: new FormControl({value: this.todaysDate, disabled: true}, []),
        noIncomeNote: new FormControl('', []),
      });
      this.isNodateSignatureNoted = true;
      this.noIncomeDetailsFormChangeSubscription();
      this.setIncomeDetailFormValue(this.incomeData?.noIncomeData);
    }

    this.adjustAttributeChanged();
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
      const signedDate=this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].value;
      const todayDate= new Date();
      if(signedDate>todayDate){
        this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setErrors({'incorrect':true})
      }

      if (this.noIncomeDetailsForm.valid) {
        this.noIncomeData.noIncomeFlag = this.hasNoIncome ? StatusFlag.Yes :StatusFlag.No;
        this.noIncomeData.clientCaseEligibilityId = this.clientCaseEligibilityId;
        this.noIncomeData.clientId = this.clientId
        this.noIncomeData.noIncomeClientSignedDate = new Date(this.intl.formatDate(this.noIncomeDetailsForm.get("noIncomeClientSignedDate")?.value, this.dateFormat));
        this.noIncomeData.noIncomeSignatureNotedDate = new Date(this.intl.formatDate(this.noIncomeDetailsForm.get("noIncomeSignatureNotedDate")?.value, this.dateFormat));
        this.noIncomeData.noIncomeNote = this.noIncomeDetailsForm.get("noIncomeNote")?.value;
      }
    }
  }

  setIncomeDetailFormValue(incomeDetail: any) {
    if (incomeDetail) {
      this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValue(new Date(incomeDetail.noIncomeClientSignedDate));
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValue(new Date(incomeDetail.noIncomeSignatureNotedDate));
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValue(incomeDetail.noIncomeNote);
    }else{
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValue('');
    }
  }

  loadSessionData() {
    this.loaderService.show();
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
            pagesize: this.incomeFacade.gridPageSizes[0]?.value,
            sortColumn : 'incomeSourceCodeDesc',
            sortType : 'asc',
          };
          this.loadIncomeListHandle(gridDataRefinerValue)
        }
      });
  }

  loadIncomeListHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sortColumn : gridDataRefinerValue.sortColumn,
      sortType : gridDataRefinerValue.sortType,
    };
    this.loadIncomes(
      this.clientId,
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sortColumn,
      gridDataRefiner.sortType
    );
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

  checkValidations(){
    if (this.hasNoIncome) {
      this.submitIncomeDetailsForm();
      return this.noIncomeDetailsForm.valid;
    }
    if (!this.hasNoIncome && this.incomeData.clientIncomes == null) {
      this.incomeFacade.incomeValidSubject.next(false);
      return false;
    }
    return true;
  }
  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
     if(response){
      this.removeValidations();
      const gridDataRefinerValue = {
        skipCount: this.incomeFacade.skipCount,
        pagesize: this.incomeFacade.gridPageSizes[0]?.value,
        sortColumn : 'incomeSourceCodeDesc',
        sortType : 'asc',
      };
      this.loadIncomeListHandle(gridDataRefinerValue)
     }
    });
  }

  removeValidations(){
    if (this.hasNoIncome) {
      this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValidators(null);
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValidators(null);
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValidators(null);
      this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].updateValueAndValidity();
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].updateValueAndValidity();
      this.noIncomeDetailsForm.controls['noIncomeNote'].updateValueAndValidity();
    }
  }
  dateChange()
  {
    this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValue(this.noIncomeDetailsForm.get("noIncomeClientSignedDate")?.value);
  }
}
