import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormArray,FormControl,Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-others-covered-plan',
  templateUrl: './medical-premium-detail-others-covered-plan.component.html',
  styleUrls: ['./medical-premium-detail-others-covered-plan.component.scss'],
})
export class MedicalPremiumDetailOthersCoveredPlanComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  

  public formUiStyle: UIFormStyle = new UIFormStyle();
  relationshipDescriptionList: any = [];
  relationshipList: any = [];
  removedPersons: any = [];
  RelationshipLovs$ = this.lovFacade.lovRelationShip$;
  constructor(
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({ });
  }

  ngOnInit(): void {
    this.lovFacade.getRelationShipsLovs();
    this.loadRelationshipLov();
  }

  onToggleNewPersonClicked() {
    let personForm = this.formBuilder.group({
      relationshipDescription: new FormControl(''),
      relationshipCode: new FormControl(''),
      firstName: new FormControl('', Validators.maxLength(40)),
      lastName: new FormControl('', Validators.maxLength(40)),
      dob: new FormControl(),
      enrolledInInsuranceFlag: new FormControl(true),
    });
    this.newOthersCoveredOnPlan.push(personForm);
  }

  getPersonControl(index: number, fieldName: string) {
    return (<FormArray>this.healthInsuranceForm.get('newOthersCoveredOnPlan')).at(index).get(fieldName);
  }
  get newOthersCoveredOnPlan(): FormArray {
    return this.healthInsuranceForm.get("newOthersCoveredOnPlan") as FormArray;
  }
  removePerson(i: number) {
    this.removedPersons.push(this.newOthersCoveredOnPlan.value[i]);
    this.newOthersCoveredOnPlan.removeAt(i);
  }
  updateEnrollStatus(event: any, i: number) {
    this.othersCoveredOnPlan.controls[i].patchValue({ 'enrolledInInsuranceFlag': event.target.checked ? true : false });
  }
  get othersCoveredOnPlan(): FormArray {
    return this.healthInsuranceForm.get("othersCoveredOnPlan") as FormArray;
  }
  private loadRelationshipLov() {
    this.RelationshipLovs$.subscribe((data: any) => {
      if (!Array.isArray(data)) return;
      this.relationshipList = data;
      this.relationshipDescriptionList = data.map((x: any) => x.lovDesc);
    });
  }
}
