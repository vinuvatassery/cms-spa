/** Angular **/
import { ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { debounceTime, distinctUntilChanged, pairwise, startWith, first, forkJoin, mergeMap, of, Subscription, tap, BehaviorSubject } from 'rxjs';
/** Facades **/
import { UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { DrugPharmacyFacade, WorkflowFacade, IncomeFacade, PrescriptionDrugFacade, PrescriptionDrug, StatusFlag, CompletionChecklist, PrescriptionDrugDocument, ClientDocumentFacade } from '@cms/case-management/domain';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy {

  /** Public properties **/
  uploadedBenefitSummaryFile: any[] = [];
  summaryBenefitFiles: any;
  uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  prescriptionDrugForm!: FormGroup;
  prescriptionDrug!: PrescriptionDrug;
  isBenefitsChanged = true;
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$
  searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
  addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
  editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
  removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
  triggerPriorityPopup$ = this.drugPharmacyFacade.triggerPriorityPopup$;
  selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;
  clientCaseEligibilityId: string = "";
  sessionId: any = "";
  clientId: any;
  clientCaseId: any;
  isSummaryOfBenefitsRequired$ = new BehaviorSubject<boolean>(false);
  showDocRequiredValidation = false;
  prescriptionInfo = {} as PrescriptionDrug;

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private route: ActivatedRoute,
    private readonly incomeFacade: IncomeFacade,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly elementRef: ElementRef,
    private readonly prescriptionDrugFacade: PrescriptionDrugFacade,
    private readonly router: Router,
    private changeDetector: ChangeDetectorRef,
    private readonly clientDocumentFacade: ClientDocumentFacade) {
    this.isSummaryOfBenefitsRequired$.next(false);
  }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.summaryOfBenefitsChangeSubscription();
    this.loadSessionData();
    this.prescriptionDrugFormChanged();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    });
  }

  /** Private Methods **/
  private buildForm() {
    this.prescriptionDrugForm = new FormGroup({
      prescriptionDrugsForHivCode: new FormControl('', { validators: Validators.required }),
      nonPreferredPharmacyCode: new FormControl('', { validators: Validators.required }),
      noSummaryOfBenefitsFlag: new FormControl(false)
    });
  }

  private loadPrescriptionDrug(): void {
    this.loaderService.show();
    this.prescriptionDrugFacade.loadPrescriptionDrug(this.clientId, this.clientCaseEligibilityId).subscribe({
      next: (response) => {
        if (response !== null) {
          this.prescriptionDrug = response;
          this.prescriptionDrugForm.patchValue(response);
          this.prescriptionDrugForm.controls['noSummaryOfBenefitsFlag']?.patchValue(response?.noSummaryOfBenefitsFlag === 'Y');
          if (response.document) {
            this.uploadedBenefitSummaryFile = [
              {
                name: response.document?.documentName,
                size: response.document?.documentSize,
                src: response.document?.documentPath,
                uid: response.document?.documentId,
                documentId: response.document?.documentId
              },
            ];
          }
          this.adjustAttributeInit();
          this.loaderService.hide();
        }
        else {
          this.prescriptionDrugForm.controls['noSummaryOfBenefitsFlag']?.patchValue(false);
          this.adjustAttributeInit();
          this.loaderService.hide();
        }

      },
      error: (err) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
      }
    })
  }

  private prescriptionDrugFormChanged() {
    this.prescriptionDrugForm.valueChanges
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
    Object.keys(this.prescriptionDrugForm.controls).forEach(key => {
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

  private adjustAttributeChanged(event: Event) {
    const data: CompletionChecklist = {
      dataPointName: (event.target as HTMLInputElement).name,
      status: (event.target as HTMLInputElement).checked ? StatusFlag.Yes : StatusFlag.No
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
  }

  private adjustAttributeInit() {
    const initialAdjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };

      initialAdjustment.push(data);
    });

    if (initialAdjustment.length > 0) {
      this.workflowFacade.updateBasedOnDtAttrChecklist(initialAdjustment);
    }

    this.updateInitialCompletionCheckList();
  }

  private updateInitialCompletionCheckList() {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.prescriptionDrugForm.controls).forEach(key => {
      if (this.prescriptionDrugForm?.get(key)?.value && this.prescriptionDrugForm?.get(key)?.valid) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes
        };

        completedDataPoints.push(item);
      }
    });

    completedDataPoints.push({ dataPointName: 'summary_of_benefits_doc', status: this.prescriptionDrug?.document?.documentName ? StatusFlag.Yes : StatusFlag.No });
    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.loaderService.show()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Prescription Drugs Saved Successfully')
        this.workflowFacade.navigate(navigationType);
      }
      this.loaderService.hide();
    });
  }


  private loadSessionData() {
    this.loaderService.show();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.loadPrescriptionDrug();
          this.loadClientPharmacies(this.clientId);
          this.loaderService.hide();
        }
      });
  }

  private save() {
    this.prescriptionDrugForm.markAllAsTouched();
    const isSummaryDocRequired = (this.prescriptionDrugForm.controls['noSummaryOfBenefitsFlag']?.value ?? false) === false && (this.uploadedBenefitSummaryFile?.length <= 0 && this.summaryBenefitFiles == undefined);
    if (isSummaryDocRequired) {
      this.showDocRequiredValidation = true;
    }
    const isLargeFile = (this.prescriptionDrugForm.controls['noSummaryOfBenefitsFlag']?.value ?? false) === false && (this.summaryBenefitFiles?.size ?? 0) > (this.uploadFileRestrictions?.fileRestrictions.maxFileSize ?? 0);
    this.changeDetector.detectChanges();
    if (this.prescriptionDrugForm.valid && this.showDocRequiredValidation === false && !isLargeFile) {
      const drugs = this.workflowFacade.deepCopy(this.prescriptionDrugForm.value);
      drugs.clientCaseEligibilityId = this.clientCaseEligibilityId;
      drugs.clientId = this.clientId;
      drugs.clientCaseId = this.clientCaseId;
      drugs.concurrencyStamp = this.prescriptionDrug?.concurrencyStamp;
      drugs.noSummaryOfBenefitsFlag = (drugs.noSummaryOfBenefitsFlag ?? false) ? StatusFlag.Yes : StatusFlag.No;
      const doc: PrescriptionDrugDocument = {
        documentId: this.prescriptionDrug?.document?.documentId,
        concurrencyStamp: this.prescriptionDrug?.document?.concurrencyStamp,
      };
      drugs.document = doc;
      return this.prescriptionDrugFacade.updatePrescriptionDrug(drugs, this.summaryBenefitFiles);
    }

    return of(false)
  }

  private summaryOfBenefitsChangeSubscription() {
    this.prescriptionDrugForm.controls['noSummaryOfBenefitsFlag']?.valueChanges.subscribe((value: boolean) => {
      this.isSummaryOfBenefitsRequired$.next(!value);
      if (!value) {
        if (this.summaryBenefitFiles !== undefined || this.uploadedBenefitSummaryFile[0]?.name !== undefined) {
          this.updateWorkflowCount('summary_of_benefits_doc', true);
        }
      }
    });
  }

  /** Internal event methods **/
  handleFileSelected(event: any) {
    this.summaryBenefitFiles = event.files[0].rawFile;
    this.showDocRequiredValidation = false;
    this.updateWorkflowCount('summary_of_benefits_doc', true);
  }

  handleFileRemoved() {
    if (this.uploadedBenefitSummaryFile?.length > 0) {
      this.clientDocumentFacade.removeDocument(this.prescriptionDrug?.document?.documentId ?? '').subscribe({
        next: (response) => {
          if (response === true) {
            this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Summary of Benefits Document Removed Successfully!")
            this.uploadedBenefitSummaryFile = [];
            this.summaryBenefitFiles = undefined;
            this.loadPrescriptionDrug();
            this.updateWorkflowCount('summary_of_benefits_doc', false);
          }
        },
        error: (err) => {
          this.loggingService.logException(err);
        },
      });
    }
    else {
      this.uploadedBenefitSummaryFile = [];
      this.summaryBenefitFiles = undefined;
      this.updateWorkflowCount('summary_of_benefits_doc', false);
    }

  }

  /* Pharmacy */
  private loadClientPharmacies(clientId: number) {
    this.loaderService.show();
    this.drugPharmacyFacade.loadClientPharmacyList(clientId);
    this.clientpharmacies$.subscribe({
      next: (pharmacies) => {
        if (pharmacies?.length > 0) {
          pharmacies?.forEach((pharmacyData: any) => {
            pharmacyData.PharmacyNameAndNumber =
              pharmacyData.PharmacyName + ' #' + pharmacyData.PharmcayId;
          });
        }

        this.updateWorkflowCount('pharmacy', pharmacies?.length > 0);
        this.loaderService.hide();
      },
      error: (err) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.updateWorkflowCount('pharmacy', false);
      },
    });
  }

  private updateWorkflowCount(dataPointName: string, isCompleted: boolean) {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: dataPointName,
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }

  addPharmacy(vendorId: string) {
    this.drugPharmacyFacade.addClientPharmacy(this.workflowFacade.clientId ?? 0, vendorId);
  }

  editPharmacyInit(vendorId: string) {
    this.drugPharmacyFacade.getPharmacyById(vendorId);
  }

  editPharmacy(data: any) {
    this.drugPharmacyFacade.editClientPharmacy(this.workflowFacade.clientId ?? 0, data?.clientPharmacyId, data?.vendorId);
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(this.workflowFacade.clientId ?? 0, clientPharmacyId);
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved === true) {
        this.router.navigate([`/case-management/cases/case360/${this.clientCaseId}`])
      }
      this.loaderService.hide();
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if (this.checkValidations()) {
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations() {
    return this.prescriptionDrugForm.valid;
  }

  viewOrDownloadFile(type: string, clientDocumentId: string, documentName: string) {
    if (clientDocumentId && clientDocumentId != '') {
      this.loaderService.show()
      this.clientDocumentFacade.getClientDocumentsViewDownload(clientDocumentId).subscribe((data: any) => {
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
      }, (error) => {
        this.loaderService.hide();
        this.workflowFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
      })
    }
  }
}

