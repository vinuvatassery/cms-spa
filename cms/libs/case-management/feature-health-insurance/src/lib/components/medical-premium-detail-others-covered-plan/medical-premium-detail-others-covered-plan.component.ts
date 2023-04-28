import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { FamilyAndDependentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-medical-premium-detail-others-covered-plan',
  templateUrl: './medical-premium-detail-others-covered-plan.component.html',
})
export class MedicalPremiumDetailOthersCoveredPlanComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() clientId: any;

  private familyAndDependentSubscription !: Subscription;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  relationshipDescriptionList: any = [];
  relationshipList: any = [];
  removedPersons: any = [];
  otherCoveredPlanLoader:boolean= false;
  RelationshipLovs$ = this.lovFacade.lovRelationShip$;
  constructor(
    private readonly familyAndDependentFacade: FamilyAndDependentFacade,
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.otherCoveredPlanLoader = true;
    this.lovFacade.getRelationShipsLovs();
      this.loadRelationshipLov();
      this.familyAndDependentFacade.loadClientDependents(this.clientId);
      this.loadClientDependents();
  }
  ngOnDestroy(): void {
    if(this.familyAndDependentSubscription!==undefined)
    this.familyAndDependentSubscription.unsubscribe();
  }
  private loadClientDependents() {
    this.familyAndDependentSubscription = this.familyAndDependentFacade.clientDependents$.subscribe((data: any) => {
      if (!!data) {
        let dependents = data.filter((dep: any) => dep.relationshipTypeCode == 'D');
        const othersCoveredOnPlanSaved = this.healthInsuranceForm.controls['othersCoveredOnPlanSaved'].value;
        dependents.forEach((el: any) => {
          if (othersCoveredOnPlanSaved !== null && othersCoveredOnPlanSaved.some((m: any) => m.clientDependentId === el.clientDependentId))
            el.enrolledInInsuranceFlag = true;
          else
            el.enrolledInInsuranceFlag = false;
        });
        let dependentGroup = !!dependents ? dependents.map((person: any) => this.formBuilder.group(person)) : [];
        let dependentForm = this.formBuilder.array(dependentGroup);
        this.healthInsuranceForm.setControl('othersCoveredOnPlan', dependentForm);

        if (this.isViewContentEditable) {
          this.othersCoveredOnPlan.controls.forEach((key: any) => {
            key.controls['enrolledInInsuranceFlag'].disable();
          });
        }
        this.otherCoveredPlanLoader = false;
        this.changeDetector.detectChanges();
      }
    });
   
  }

  onOthersCoveredOnPlanFlagRdoClicked(value:any){
    if(value==='Y'){
      (this.healthInsuranceForm.controls['newOthersCoveredOnPlan'] as FormArray).clear();
    }
  }

  onToggleNewPersonClicked() {
    let personForm = this.formBuilder.group({
      relationshipCode: new FormControl(''),
      firstName: new FormControl('', Validators.maxLength(40)),
      lastName: new FormControl('', Validators.maxLength(40)),
      dob: new FormControl(),
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
