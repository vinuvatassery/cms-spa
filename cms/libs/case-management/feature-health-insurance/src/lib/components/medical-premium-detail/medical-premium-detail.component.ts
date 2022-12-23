/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit {
  currentDate = new Date();
  public isaddNewInsuranceProviderOpen = false;
  public isaddNewInsurancePlanOpen = false;
  advancedPremium: string = 'No';
  clientPolicyHolder: string = 'No';
  dateOfBirth: any;
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
    private fb: FormBuilder
  ) {
    this.addPersonForm = this.fb.group({
      persons: this.fb.array([]),
    });
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
  ddlInsuranceType!: string;
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
    this.ddlInsuranceType = this.insuranceType;
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
      relation: '',
      firstName: '',
      lastName: '',
      dob: '',
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
}
