/** Angular **/
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { ClientDocument, ClientDocumentFacade, HealthInsuranceFacade, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';
import { LoggingService } from 'libs/shared/util-core/src/lib/api/services/logging.service';
import { NotificationSnackbarService } from 'libs/shared/util-core/src/lib/application/services/notification-snackbar-service';
import { SnackBarNotificationType } from 'libs/shared/util-core/src/lib/enums/snack-bar-notification-type.enum';
import { catchError, of, first, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit, OnDestroy {
  public isaddNewInsuranceProviderOpen = false;
  public isaddNewInsurancePlanOpen = false;
  RelationshipLovs$ = this.lovFacade.lovRelationShip$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  proofOfPremiumFiles: any;
  copyOfSummaryFiles: any;
  copyOfInsuranceCardFiles: any;
  public uploadRemoveUrl = 'removeUrl';
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  private loadSessionSubscription!: Subscription;

  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;

  /** Output properties **/
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() editRedirect = new EventEmitter<string>();
  insuranceForm: FormGroup
  /** Constructor **/
  constructor(
    private readonly healthFacade: HealthInsuranceFacade,
    private readonly lovFacade: LovFacade,
    private fb: FormBuilder,
    private workflowFacade: WorkflowFacade,
    private route: ActivatedRoute,
    private readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
  ) {
    this.insuranceForm = this.fb.group({
      currentDate: new FormControl(new Date()),
      isClientPolicyHolder: new FormControl('No'),
      advancedPremium: new FormControl('No'),
      buyingPremium: new FormControl('No'),
      othersCovered: new FormControl(''),
      ddlInsuranceType: new FormControl(''),
      policyHolderFirstName: new FormControl('', Validators.maxLength(40)),
      policyHolderLastName: new FormControl('', Validators.maxLength(40)),
      persons: this.fb.array([]),
      copyOfInsuranceCard: new FormControl('', Validators.required),
      proofOfPremium: new FormControl(''),
      copyOfSummary: new FormControl(''),
    });
  }

  get persons(): FormArray {
    return this.insuranceForm.get("persons") as FormArray;
  }

  /** Public properties **/
  ddlMedicalHealthInsurancePlans$ =
    this.healthFacade.ddlMedicalHealthInsurancePlans$;
  ddlMedicalHealthPlanMetalLevel$ =
    this.healthFacade.ddlMedicalHealthPlanMetalLevel$;
  ddlMedicalHealthPalnPremiumFrequecy$ =
    this.healthFacade.ddlMedicalHealthPalnPremiumFrequecy$;

  isEditViewPopup!: boolean;
  isDeleteEnabled!: boolean;
  isViewContentEditable!: boolean;
  isToggleNewPerson!: boolean;
  isOpenDdl = false;
  relationshipList: any = [];

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.loadDdlMedicalHealthInsurancePlans();
    this.loadDdlMedicalHealthPlanMetalLevel();
    this.loadDdlMedicalHealthPalnPremiumFrequecy();
    this.viewSelection();
    this.lovFacade.getRelationShipsLovs();
    this.loadRelationshipLov();
  }

  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }

  private loadRelationshipLov() {
    this.RelationshipLovs$.subscribe((data: any) => {
      if (!Array.isArray(data)) return;
      this.relationshipList = data.map((x: any) => x.lovDesc);
    });
  }

  /** Private methods **/
  private loadDdlMedicalHealthInsurancePlans() {
    this.healthFacade.loadDdlMedicalHealthInsurancePlans();
  }

  private loadDdlMedicalHealthPlanMetalLevel() {
    this.healthFacade.loadDdlMedicalHealthPlanMetalLevel();
  }

  private loadDdlMedicalHealthPalnPremiumFrequecy() {
    this.healthFacade.loadDdlMedicalHealthPalnPremiumFrequecy();
  }

  private viewSelection() {
    this.isToggleNewPerson = false;
    switch (this.dialogTitle) {
      case 'View':
        this.isEditViewPopup = true;
        this.conditionsInsideView();
        this.isViewContentEditable = true;
        break;
      case 'Add':
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        break;
      case 'Edit':
        this.conditionsInsideView();
        this.isDeleteEnabled = true;
        this.isViewContentEditable = false;
        break;
      default:
        break;
    }
  }

  private conditionsInsideView() {
    this.insuranceForm.controls['ddlInsuranceType'].setValue(this.insuranceType);
    this.isOpenDdl = true;
  }

  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.isOpenDdl = true;
  }

  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }
  onRedirectModalClicked() {
    this.isViewContentEditable = false;
    this.isEditViewPopup = false;
    this.isDeleteEnabled = true;
    this.editRedirect.emit('edit');
  }

  onToggleNewPersonClicked() {
    // this.isToggleNewPerson = !this.isToggleNewPerson;
    let personForm = this.fb.group({
      relation: new FormControl(''),
      firstName: new FormControl('', Validators.maxLength(40)),
      lastName: new FormControl('', Validators.maxLength(40)),
      dob: new FormControl(''),
    });
    this.persons.push(personForm);
  }

  removePerson(i: number) {
    this.persons.removeAt(i);
  }


  public addNewInsuranceProviderClose(): void {
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.isaddNewInsuranceProviderOpen = true;
  }

  public addNewInsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }

  public handleFileSelected(event: any, fileType: string) {
    if (fileType == 'proof') {
      this.proofOfPremiumFiles = event.files[0];
    }
    else if (fileType == 'summary') {
      this.copyOfSummaryFiles = event.files[0];
    }
    else if (fileType == 'copyInsurance') {
      this.copyOfInsuranceCardFiles = event.files[0];
    }
  }

  public handleFileRemoved(documentId: any, fileType: string) {
    if (!!documentId) {
      this.clientDocumentFacade.removeDocument(documentId ?? '').subscribe({
        next: (response) => {
          if (response === true) {
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Document Removed Successfully!");
            if (fileType == 'proof') {
              this.insuranceForm.controls['proofOfPremium'].setValue(null)
              this.proofOfPremiumFiles = null;
            }
            else if (fileType == 'summary') {
              this.insuranceForm.controls['copyOfSummary'].setValue(null);
              this.copyOfSummaryFiles = null;
            }
            else if (fileType == 'copyInsurance') {
              this.insuranceForm.controls['copyOfInsuranceCard'].setValue(null);
              this.copyOfInsuranceCardFiles = null;
            }
          }
        },
        error: (err) => {
          this.loggingService.logException(err);
        },
      });
    }
    else {
      if (fileType == 'proof') {
        this.insuranceForm.controls['proofOfPremium'].setValue(null);
        this.proofOfPremiumFiles = null;

      }
      else if (fileType == 'summary') {
        this.insuranceForm.controls['copyOfSummary'].setValue(null);
        this.copyOfSummaryFiles = null;
      }
      else if (fileType == 'copyInsurance') {
        this.insuranceForm.controls['copyOfInsuranceCard'].setValue(null);
        this.copyOfInsuranceCardFiles = null;
      }
    }
  }

  public onUploadClick(event: any, fileType: string) {
    let uploadedFile;
    if (fileType == 'proof') {
      uploadedFile = this.proofOfPremiumFiles;
    }
    else if (fileType == 'summary') {
      uploadedFile = this.copyOfSummaryFiles;
    }
    else if (fileType == 'copyInsurance') {
      uploadedFile = this.copyOfInsuranceCardFiles;
    }
    if (uploadedFile.rawFile && (uploadedFile.size / 1024) < 25) {
      let document: ClientDocument = {
        clientId: this.clientId,
        clientCaseId: this.clientCaseId,
        clientCaseEligibilityId: this.clientCaseEligibilityId,
        // entityId: '',
        // entityTypeCode: 'HOME_ADDRESS_PROOF',
        documentName: uploadedFile.rawFile.name,
        document: uploadedFile.rawFile
      };

      return this.clientDocumentFacade.uploadDocument(document)
        .pipe(
          catchError((err: any) => {
            this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
            if (!(err?.error ?? false)) {
              this.loggingService.logException(err);
            }
            return of(false);
          })
        ).subscribe();
    }
    else {
      this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, 'File size more than 25MB');
      if (fileType == 'proof') {
        this.insuranceForm.controls['proofOfPremium'].setValue(null);
        this.proofOfPremiumFiles = null;

      }
      else if (fileType == 'summary') {
        this.insuranceForm.controls['copyOfSummary'].setValue(null);
        this.copyOfSummaryFiles = null;
      }
      else if (fileType == 'copyInsurance') {
        this.insuranceForm.controls['copyOfInsuranceCard'].setValue(null);
        this.copyOfInsuranceCardFiles = null;
      }
    }
    return of({});
  }



  loadSessionData() {
    let sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
        }
      });
  }

  checkValidations() {
    if (this.insuranceForm.controls['isClientPolicyHolder'].value == 'No' || this.insuranceForm.controls['buyingPremium'].value == 'Yes') {
      this.insuranceForm.get('policyHolderFirstName')?.setValidators(Validators.required);
      this.insuranceForm.get('policyHolderLastName')?.setValidators(Validators.required);
    }
    else if (this.insuranceForm.controls['isClientPolicyHolder'].value == 'Yes' || this.insuranceForm.controls['buyingPremium'].value == 'No') {
      this.insuranceForm.get('policyHolderFirstName')?.clearValidators();
      this.insuranceForm.get('policyHolderLastName')?.clearValidators();
    }
    if (this.insuranceForm.controls['buyingPremium'].value == 'Yes') {
      this.insuranceForm.get('othersCovered')?.setValidators(Validators.required);
      this.insuranceForm.get('isClientPolicyHolder')?.setValidators(Validators.required);
    }
    else if (this.insuranceForm.controls['buyingPremium'].value == 'No') {
      this.insuranceForm.get('othersCovered')?.clearValidators();
      this.insuranceForm.get('isClientPolicyHolder')?.setValidators(Validators.required);
    }
    if (this.insuranceForm.controls['othersCovered'].value == 'Yes') {
      this.insuranceForm.get('persons')?.get('relation')?.setValidators(Validators.required);
      this.insuranceForm.get('persons')?.get('firstName')?.setValidators(Validators.required);
      this.insuranceForm.get('persons')?.get('lastName')?.setValidators(Validators.required);
    }
    else if (this.insuranceForm.controls['othersCovered'].value == 'No') {
      this.insuranceForm.get('persons')?.get('relation')?.clearValidators();
      this.insuranceForm.get('persons')?.get('firstName')?.clearValidators();
      this.insuranceForm.get('persons')?.get('lastName')?.clearValidators();
    }
    this.insuranceForm.get('policyHolderFirstName')?.updateValueAndValidity();
    this.insuranceForm.get('policyHolderLastName')?.updateValueAndValidity();
    this.insuranceForm.get('othersCovered')?.updateValueAndValidity();
    this.insuranceForm.get('isClientPolicyHolder')?.updateValueAndValidity();
    this.insuranceForm.get('persons')?.get('relation')?.updateValueAndValidity();
    this.insuranceForm.get('persons')?.get('firstName')?.updateValueAndValidity();
    this.insuranceForm.get('persons')?.get('lastName')?.updateValueAndValidity();
  }

  saveChanges(event: any) {
    this.checkValidations();
  }

}
