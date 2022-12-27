/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
/** Facades **/
import { ClientDocument, ClientDocumentFacade, HealthInsuranceFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';
import { LoggingService } from 'libs/shared/util-core/src/lib/api/services/logging.service';
import { NotificationSnackbarService } from 'libs/shared/util-core/src/lib/application/services/notification-snackbar-service';
import { SnackBarNotificationType } from 'libs/shared/util-core/src/lib/enums/snack-bar-notification-type.enum';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit {
  public isaddNewInsuranceProviderOpen = false;
  public isaddNewInsurancePlanOpen = false;
  RelationshipLovs$ = this.lovFacade.lovRelationShip$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;

  /** Output properties **/
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() editRedirect = new EventEmitter<string>();
  addPersonForm: FormGroup
  /** Constructor **/
  constructor(
    private readonly healthFacade: HealthInsuranceFacade,
    private readonly lovFacade: LovFacade,
    private fb: FormBuilder,
    private readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
  ) {
    this.addPersonForm = this.fb.group({
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

    this.addPersonForm.valueChanges.subscribe(changes => {
      if (changes.isClientPolicyHolder == 'No' || changes.buyingPremium == 'Yes') {
        this.addPersonForm.get('policyHolderFirstName')?.setValidators(Validators.required);
        this.addPersonForm.get('policyHolderLastName')?.setValidators(Validators.required);
      }
      else if (changes.isClientPolicyHolder == 'Yes' || changes.buyingPremium == 'No') {
        this.addPersonForm.get('policyHolderFirstName')?.clearValidators();
        this.addPersonForm.get('policyHolderLastName')?.clearValidators();
      }
      if (changes.buyingPremium == 'Yes') {
        this.addPersonForm.get('othersCovered')?.setValidators(Validators.required);
        this.addPersonForm.get('isClientPolicyHolder')?.setValidators(Validators.required);
      }
      else if (changes.buyingPremium == 'No') {
        this.addPersonForm.get('othersCovered')?.clearValidators();
        this.addPersonForm.get('isClientPolicyHolder')?.setValidators(Validators.required);
      }
      if (changes.othersCovered == 'Yes') {
        this.addPersonForm.get('persons')?.get('relation')?.setValidators(Validators.required);
        this.addPersonForm.get('persons')?.get('firstName')?.setValidators(Validators.required);
        this.addPersonForm.get('persons')?.get('lastName')?.setValidators(Validators.required);
      }
      else if (changes.othersCovered == 'No') {
        this.addPersonForm.get('persons')?.get('relation')?.clearValidators();
        this.addPersonForm.get('persons')?.get('firstName')?.clearValidators();
        this.addPersonForm.get('persons')?.get('lastName')?.clearValidators();
      }
    })
  }

  get persons(): FormArray {
    return this.addPersonForm.get("persons") as FormArray;
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
    this.loadDdlMedicalHealthInsurancePlans();
    this.loadDdlMedicalHealthPlanMetalLevel();
    this.loadDdlMedicalHealthPalnPremiumFrequecy();
    this.viewSelection();
    this.lovFacade.getRelationShipsLovs();
    this.loadRelationshipLov();
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
    this.addPersonForm.controls['ddlInsuranceType'].setValue(this.insuranceType);
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
    let uploadedFile = event.files[0];
    if (uploadedFile.rawFile && (uploadedFile.size/1024) < 25) {
      let document: ClientDocument = {
        // clientId: clientId,
        // clientCaseId: clientCaseId,
        // clientCaseEligibilityId: clientCaseEligibilityId,
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
        );
    }
    else {
      this.addPersonForm.controls['copyOfInsuranceCard'].setValue('');
    }
    return of({});
  }
}
