

/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnDestroy, OnInit, ElementRef, AfterViewInit,ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
/** External libraries **/
import {catchError, debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription, tap } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, IncomeFacade, NavigationType, NoIncomeData, CompletionChecklist, ClientDocumentFacade, FamilyAndDependentFacade, GridFilterParam } from '@cms/case-management/domain';
import { IntlDateService,UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Validators, FormGroup, FormControl, } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute, Router } from '@angular/router';
import {ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';
import { DropDownListComponent } from "@progress/kendo-angular-dropdowns";
@Component({
  selector: 'case-management-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomePageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren("proofSchoolDropdown") public proofSchoolDropdown!: QueryList<DropDownListComponent>;
  /** Private properties **/
  private saveClickSubscription !: Subscription;  /** Public Methods **/
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  incomes$ = this.incomeFacade.incomes$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  lovProofOfIncomeByType$  = this.lov.lovProofOfIncomeByType$;
  incomeSourcelov$ = this.lov.incomeSourcelov$;
  incomeTypelov$ = this.lov.incomeTypelov$;
  incomeFrequencylov$  = this.lov.incomeFrequencylov$;
  incomesLoader$ = this.incomeFacade.incomesLoader$;
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
  isProofOfSchoolDocumentUploaded: boolean = true;
  isInValidDateRange:boolean = false;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  incomeData: any = {};
  noIncomeFlag: boolean = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  setOption:boolean = true;
  private loadSessionSubscription!: Subscription;
  public noIncomeDetailsForm: FormGroup = new FormGroup({
    noIncomeClientSignedDate: new FormControl('', []),
    noIncomeSignatureNotedDate: new FormControl({value: this.todaysDate, disabled: true}, []),
    noIncomeNote: new FormControl('', []),
    clientDependentsMinorAdditionalIncomeFlag : new FormControl('', []),
    clientDependentsMinorEmployedFlag  : new FormControl('', [])
  });
  isCerForm = false;
  hasValidIncome = false;
  prevClientCaseEligibilityId! : string;
  public uploadFileRestrictions: UploadFileRistrictionOptions =
  new UploadFileRistrictionOptions();
  proofOfSchoolDocument!:any
  columnOptionDisabled = false;
  dependentsProofOfSchools:any = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Attach from computer",
      id: "proofOfSchoolUploaded",
      click: (event: any,dataItem: any): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Attach from client/'s attachments",
      id: "attachFromClient",
      click: (event: any,dataItem: any): void => {
        this.onBlur();
      },
    },

    {
      buttonType:"btn-h-danger",
      text: "Remove file",
      id: "removeFile",
      click: (event: any,dataItem: any): void => {
      this.removeDependentsProofofSchoool(dataItem.clientDocumentId);
      this.onBlur();
      },
    },


  ];

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
	  private readonly router: Router,
    private readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly dependentFacade:FamilyAndDependentFacade,
    private readonly cdr: ChangeDetectorRef
    ) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.lov.getProofOfIncomeTypesByTypeLov();
    this.loadSessionData();
    this.loadDependents();
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
  public onClose(event: any , index : any) {
    event.preventDefault();
    // Close the list if the component is no longer focused
    setTimeout(() => {
      this.proofSchoolDropdown.forEach((element, index) => {element.toggle(false);})
    });
  }

  public onBlur() {
    this.proofSchoolDropdown.forEach((element) => {element.toggle(false);})
  }
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
        this.incomeFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Income Status Updated Successfully')
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  private save() {
    debugger;
    this.removeValidations();
    // this.UploadDocumentValidation();
    // this.noIncomeDetailsForm.markAllAsTouched();
    // this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].setValidators([
    //   Validators.required,
    // ]);
    // this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].updateValueAndValidity();
    // this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].setValidators([
    //   Validators.required,
    // ]);
    // this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].updateValueAndValidity();
    this.checkValidations();
    this.cdr.detectChanges();
    if (this.noIncomeDetailsForm.valid) {
      if (this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].value === StatusFlag.No
        && this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].value === StatusFlag.No) {
        let isValid = true;
        this.submitIncomeDetailsForm();
        if (this.noIncomeDetailsForm.valid && isValid && this.isProofOfSchoolDocumentUploaded) {
          this.noIncomeData.isCERRequest = this.isCerForm;
          this.loaderService.show();
          return this.incomeFacade.save(this.clientCaseEligibilityId, this.noIncomeData).pipe(
            catchError((err: any) => {
              this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err)
              this.loaderService.hide();
              return of(false);
            })
          )
        }
      }
      else {
        if (this.incomeData.clientIncomes != null && this.isProofOfSchoolDocumentUploaded) {
          this.loaderService.show();
          this.incomeFacade.incomeValidSubject.next(true);
          //this.noIncomeData.noIncomeFlag = StatusFlag.No;
          this.noIncomeData.clientDependentsMinorEmployedFlag = this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].value;
          this.noIncomeData.clientDependentsMinorAdditionalIncomeFlag = this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].value;
          this.noIncomeData.clientCaseEligibilityId = this.clientCaseEligibilityId;
          this.noIncomeData.clientId = this.clientId
          this.noIncomeData.noIncomeClientSignedDate = null;
          this.noIncomeData.noIncomeSignatureNotedDate = null;
          this.noIncomeData.noIncomeNote = null;
          this.noIncomeData.isCERRequest = this.isCerForm;
          this.loaderService.show();
          return this.incomeFacade.save(this.clientCaseEligibilityId, this.noIncomeData).pipe(
            catchError((err: any) => {
              this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err)
              this.loaderService.hide();
              return of(false);
            })
          )
        }
        else if (!this.incomeData.clientIncomes) {
          this.incomeFacade.incomeValidSubject.next(false);
          return of(false);
        }
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
  private loadIncomes(clientId: string, clientCaseEligibilityId: string,  gridFilterParam: GridFilterParam, setOption:boolean = true): void {
    this.loaderService.show();
    this.setOption = setOption;
    this.incomeFacade.loadIncomes(clientId, clientCaseEligibilityId,gridFilterParam);
    this.incomeFacade.incomesResponse$.subscribe((incomeresponse: any) => {
      this.incomeData = incomeresponse;
      let uploadedProofOfSchoolDependents = this.dependentsProofOfSchools.filter((item :any) => !!item.documentPath);
      if(uploadedProofOfSchoolDependents?.length == this.incomeData?.dependents?.length){
      this.isProofOfSchoolDocumentUploaded=true;
    }
      this.incomeListRequiredValidation = false;
      this.hasValidIncome=false;
      let todayDate = new Date();
      todayDate = new Date(`${todayDate.getFullYear()}-${todayDate.getMonth()+1}-${todayDate.getDate()}`)
      if(this.isCerForm != true){
        if(this.incomeData.clientIncomes?.filter((x:any) => (x.incomeEndDate != null && new Date(x.incomeEndDate.split('T')[0]) >= todayDate) || x.incomeEndDate === null).length>0){
          this.hasValidIncome=true;
        }
      }
      if (incomeresponse.noIncomeData!=null) {
        //this.noIncomeFlag = true;
        // this.noIncomeDetailsForm = new FormGroup({
        //   noIncomeClientSignedDate: new FormControl('', []),
        //   noIncomeSignatureNotedDate: new FormControl({value: this.todaysDate, disabled: true}, []),
        //   noIncomeNote: new FormControl('', []),
        // });
        this.noIncomeDetailsFormChangeSubscription();
        this.isNodateSignatureNoted = true;
        this.hasNoIncome = true;
        this.setIncomeDetailFormValue(this.incomeData?.noIncomeData);
      }
      else
      {
        //this.noIncomeFlag = false;
        this.isNodateSignatureNoted = false;
        this.hasNoIncome = false;
        this.setIncomeDetailFormValue(null);
      }
      this.loaderService.hide();

      this.adjustAttributeChanged();
       this.cdr.detectChanges();
    })
  }

  additionalIncomeFlagSelected(event:any){
    debugger
    // this.noIncomeDetailsFormChangeSubscription();
    // this.adjustAttributeChanged();
    this.cdr.detectChanges();
  }
  dependentsMinorEmployedFlagSelected(event:any){

    debugger
  }
  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  /** Internal Event Methods **/
  onIncomeValueChanged(event: any) {
    debugger;
    //this.hasNoIncome = !this.hasNoIncome;
    //if (this.hasNoIncome) {
      // this.noIncomeDetailsForm = new FormGroup({
      //   noIncomeClientSignedDate: new FormControl('', []),
      //   noIncomeSignatureNotedDate: new FormControl({value: null, disabled: true}, []),
      //   noIncomeNote: new FormControl('', []),
      // });
      // this.isNodateSignatureNoted = true;
      this.noIncomeDetailsFormChangeSubscription();
      //this.setIncomeDetailFormValue(this.incomeData?.noIncomeData);
    //}

    this.adjustAttributeChanged();
  }


  public submitIncomeDetailsForm(): void {

    if (this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].value === StatusFlag.No &&
     this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].value === StatusFlag.No) {
     
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
        this.isInValidDateRange = false;
      }
      const minSignedDate = new Date(1753,0,1);
      if(signedDate <= minSignedDate){
        this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setErrors({'incorrect':true})
        this.isInValidDateRange = true;
      }


      if (this.noIncomeDetailsForm.valid) {
        //this.noIncomeData.noIncomeFlag = this.hasNoIncome ? StatusFlag.Yes :StatusFlag.No;
        this.noIncomeData.clientDependentsMinorEmployedFlag =  this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].value;
        this.noIncomeData.clientDependentsMinorAdditionalIncomeFlag = this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].value;
        this.noIncomeData.clientCaseEligibilityId = this.clientCaseEligibilityId;
        this.noIncomeData.clientId = this.clientId
        this.noIncomeData.noIncomeClientSignedDate = new Date(this.intl.formatDate(this.noIncomeDetailsForm.get("noIncomeClientSignedDate")?.value, this.dateFormat));
        this.noIncomeData.noIncomeSignatureNotedDate = new Date(this.intl.formatDate(this.noIncomeDetailsForm.get("noIncomeSignatureNotedDate")?.value, this.dateFormat));
        this.noIncomeData.noIncomeNote = this.noIncomeDetailsForm.get("noIncomeNote")?.value;
      }
    }
  }

  setIncomeDetailFormValue(incomeDetail: any) {
 debugger
    if (incomeDetail) {
      if(incomeDetail.noIncomeClientSignedDate !== null){this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValue(new Date(incomeDetail.noIncomeClientSignedDate));}
      if(incomeDetail.noIncomeSignatureNotedDate!== null){this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValue(new Date(incomeDetail.noIncomeSignatureNotedDate));}
      this.noIncomeDetailsForm.controls['noIncomeNote'].setValue(incomeDetail.noIncomeNote);
      if(this.setOption){
        this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].setValue(incomeDetail.clientDependentsMinorEmployedFlag);
        this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].setValue(incomeDetail.clientDependentsMinorAdditionalIncomeFlag);
      }
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
          this.prevClientCaseEligibilityId =  JSON.parse( session.sessionData)?.prevClientCaseEligibilityId
        if (this.prevClientCaseEligibilityId) { this.isCerForm = true; }
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

  loadIncomeListGrid(gridDataRefinerValue:any):void{
    const gridFilterParam = new GridFilterParam(gridDataRefinerValue.skipCount, gridDataRefinerValue.pageSize, gridDataRefinerValue.sortColumn, gridDataRefinerValue.sortType, JSON.stringify(gridDataRefinerValue.filter));   
    // const gridDataRefiner = {
    //   skipcount: gridDataRefinerValue.skipCount,
    //   maxResultCount: gridDataRefinerValue.pagesize,
    //   sortColumn : gridDataRefinerValue.sortColumn,
    //   sortType : gridDataRefinerValue.sortType,
    // };
    this.loadIncomes(
      this.clientId,
      this.clientCaseEligibilityId,
      gridFilterParam,
      false
    );
  }

  loadIncomeListHandle(gridDataRefinerValue: any): void {
    const gridFilterParam = new GridFilterParam(gridDataRefinerValue.skipCount, gridDataRefinerValue.pageSize, gridDataRefinerValue.sortColumn, gridDataRefinerValue.sortType, JSON.stringify(gridDataRefinerValue.filter));   
    // const gridDataRefiner = {
    //   skipcount: gridDataRefinerValue.skipCount,
    //   maxResultCount: gridDataRefinerValue.pagesize,
    //   sortColumn : gridDataRefinerValue.sortColumn,
    //   sortType : gridDataRefinerValue.sortType,
    // };
    this.loadIncomes(
      this.clientId,
      this.clientCaseEligibilityId,
      gridFilterParam
    );
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      debugger
      if (this.checkValidations() && this.noIncomeDetailsForm.valid) {
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
      //this.noIncomeDetailsForm.updateValueAndValidity();
      this.cdr.detectChanges();
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      debugger;
      this.removeValidations();
      if (this.checkValidations() && this.noIncomeDetailsForm.valid) {
        //this.checkValidations()
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
      }
      //this.noIncomeDetailsForm.updateValueAndValidity();
      this.cdr.detectChanges();
    });
  }

  checkValidations(){
    this.noIncomeDetailsForm.markAllAsTouched();
    this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].setValidators([
      Validators.required,
    ]);
    this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].updateValueAndValidity()
    this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].setValidators([
      Validators.required,
    ]);
    this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].updateValueAndValidity();
    //if (this.hasNoIncome) {
      
    if(this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].value === StatusFlag.No &&
    this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].value === StatusFlag.No)
    {
      this.submitIncomeDetailsForm();
      return this.noIncomeDetailsForm.valid;
    }
    else if((this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].value === StatusFlag.Yes ||
    this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].value === StatusFlag.Yes) && 
    this.incomeData.clientIncomes == null) {
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

  removeValidations() {

    this.noIncomeDetailsForm.controls['clientDependentsMinorAdditionalIncomeFlag'].setValidators(null);
    this.noIncomeDetailsForm.controls['clientDependentsMinorEmployedFlag'].setValidators(null);
    this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].setValidators(null);
    this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValidators(null);
    this.noIncomeDetailsForm.controls['noIncomeNote'].setValidators(null);
    this.noIncomeDetailsForm.controls['noIncomeClientSignedDate'].updateValueAndValidity();
    this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].updateValueAndValidity();
    this.noIncomeDetailsForm.controls['noIncomeNote'].updateValueAndValidity();

  }
  dateChange(date:any)
  {
    if(date.value)
    {
      this.noIncomeDetailsForm.controls['noIncomeSignatureNotedDate'].setValue(this.todaysDate);
    }
  }
  viewOrDownloadFile(type: string, clientDocumentId: string, documentName: string) {
    this.loaderService.show()
    this.clientDocumentFacade.getClientDocumentsViewDownload(clientDocumentId)
    .subscribe({
      next: (data: any) => {
        const fileUrl = window.URL.createObjectURL(data);
        if (type === 'download') {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = documentName;
          downloadLink.click();
        } else {
          window.open(fileUrl, "_blank");
        }
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
      }
    });
  }
  handleFileSelected(event: any, dataItem: any) {
    this.dependentFacade.showLoader();
    if (event && event.files.length > 0) {
      const formData: any = new FormData();
      let file = event.files[0].rawFile
      if(dataItem.clientDocumentId){
        formData.append("clientDocumentId", dataItem.clientDocumentId);
        formData.append("concurrencyStamp", dataItem.documentConcurrencyStamp);
      }
      formData.append("document", file)
      formData.append("clientId", this.clientId)
      formData.append("clientCaseEligibilityId", this.clientCaseEligibilityId)
      formData.append("clientCaseId", this.clientCaseId)
      formData.append("EntityId", dataItem.clientDependentId)
      formData.append("documentTypeCode", "DEPENDENT_PROOF_OF_SCHOOL")
      this.showHideImageUploadLoader(true, dataItem);
      this.dependentFacade.uploadDependentProofOfSchool(this.clientCaseEligibilityId, dataItem.clientDependentId, formData).subscribe({
        next: (response: any) => {
          this.loadIncomeData();
          this.loadDependentsProofOfSchools();
          this.dependentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Dependent proof of school uploaded successfully.");
          this.dependentFacade.hideLoader();
          this.showHideImageUploadLoader(false, dataItem);

        },
        error: (err: any) => {
          this.showHideImageUploadLoader(false, dataItem);
          this.dependentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      })
    }

  }
  showHideImageUploadLoader(showHide:boolean,dataItem:any){
    this.dependentsProofOfSchools.filter((dep:any)=>dep.clientDependentId==dataItem.clientDependentId).forEach((element:any)=>{
      element["uploaingProofDoc"]=showHide;
      this.cdr.detectChanges();
    })
  }
  removeDependentsProofofSchoool(documentid: string){
    if (documentid) {
      this.incomeFacade.showLoader();
      this.clientDocumentFacade.removeDocument(documentid).subscribe({
        next: (response: any) => {
          this.loadIncomeData();
          this.loadDependentsProofOfSchools();
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Proof of school attachment removed successfully') ;
        },
        error: (err: any) => {
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
      );
    }
  }
  private loadDependentsProofOfSchools() {
    this.incomeFacade.showLoader();
    this.incomeFacade.loadDependentsProofofSchools();
    this.incomeFacade.hideLoader();
  }
  loadDependents(){
    this.incomeFacade.dependentsProofofSchools$.subscribe((response:any)=>{
      if(response&&response.length>0){
        this.dependentsProofOfSchools=response;
        this.cdr.detectChanges();
      }
      else{
        this.dependentsProofOfSchools = [];
      }
    })
  }
  private loadIncomeData(): void {
    const gridDataRefinerValue = {
      skipCount: this.incomeFacade.skipCount,
      pagesize: this.incomeFacade.gridPageSizes[0]?.value,
      sortColumn : 'incomeSourceCodeDesc',
      sortType : 'asc',
    };
    this.loadIncomeListHandle(gridDataRefinerValue);
  }
 UploadDocumentValidation(){
    if(this.dependentsProofOfSchools?.length > 0){
    const uploadedProofOfSchoolDependents = this.dependentsProofOfSchools.filter((item :any) => !!item.documentPath);
  if(uploadedProofOfSchoolDependents?.length == this.incomeData?.dependents?.length){
  this.isProofOfSchoolDocumentUploaded=true;
}
else{
  this.isProofOfSchoolDocumentUploaded=false;
}
this.cdr.detectChanges();
}
}
}
