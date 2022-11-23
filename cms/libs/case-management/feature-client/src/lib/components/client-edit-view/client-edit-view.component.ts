/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation , ViewChild, Output, EventEmitter, ElementRef,Inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { groupBy } from '@progress/kendo-data-query';
import { debounceTime, distinctUntilChanged, filter, pairwise, startWith, Subscription } from 'rxjs';
/** Facades **/
import {  ClientFacade, CompletionChecklist, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';

/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { kMaxLength } from 'buffer';

 
@Component({
  selector: 'case-management-client-edit-view',
  templateUrl: './client-edit-view.component.html',
  styleUrls: ['./client-edit-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewComponent implements OnInit {
 
  public value = "";
  isVisible: any;
  isSelected = true;

  /** Output Properties **/
 @Output() AppInfoChanged = new EventEmitter<CompletionChecklist[]>();
 @Output() AdjustAttrChanged = new EventEmitter<CompletionChecklist[]>();
 @Output() ValidateFields = new EventEmitter<FormGroup>();
  


  /** Public properties **/
  public currentDate = new Date();
 
  rdoTransgenders$ = this.clientfacade.rdoTransGenders$;
  rdoSexAssigned$ = this.clientfacade.rdoSexAssigned$;
  rdoMaterials$ = this.clientfacade.rdoMaterials$;
  rdoInterpreters$ = this.clientfacade.rdoInterpreters$;
  rdoDeafs$ = this.clientfacade.rdoDeaf$;
  rdoBlinds$ = this.clientfacade.rdoBlind$;
  rdoWalked$ = this.clientfacade.rdoWalked$;
  rdoDressedorBathed$ = this.clientfacade.rdoDressedorBathed$;
  rdoConcentration$ = this.clientfacade.rdoConcentration$;
  rdoErrands$ = this.clientfacade.rdoErrands$;
  ddlPrimaryIdentities$ = this.clientfacade.ddlPrimaryIdentities$;
  ddlSpokenLanguages$ = this.clientfacade.ddlSpokenLanguages$;
  ddlEnglishProficiencies$ = this.clientfacade.ddlEnglishProficiencies$;
  ddlWrittenLanguages$ = this.clientfacade.ddlWrittenLanguages$;
  ddlRacialIdentities$ = this.clientfacade.ddlRacialIdentities$;
  isMiddleNameChecked!: boolean;
  isInsuranceCardChecked!: boolean;
  isOfficialIdChecked!: boolean;
  isSSNChecked!: boolean;
  isDescribeGenderChecked!: boolean;
  isPronounsChecked!: boolean;
  isGenderChecked!: boolean;
  isOrientationChecked!: boolean;
  isDescribeOrientaionChecked!: boolean;
  isTransTextBoxDisabled = true;
  isSexAssignedTextBoxDisabled = true;
  isMaterialsTextBoxDisabled = true;
  isInterpreterTextBoxDisabled = true;
  isDeafTextBoxDisabled = true;
  isBlindTextBoxDisabled = true;
  isWalkingTextBoxDisabled = true;
  isDressingorBathingTextBoxDisabled = true;
  isConcentrationTextBoxDisabled = true;
  isErrandsTextBoxDisabled = true;
  transgenderSelectedValue!: number;
  sexAssignedSelectedValue!: number;
  materialsSelectedValue!: number;
  interpreterSelectedValue!: number;
  deafSelectedValue!: number;
  blindSelectedValue!: number;
  walkingSelectedValue!: number;
  dressingOrBathingSelectedValue!: number;
  concentrationSelectedValue!: number;
  errandsSelectedValue!: number;
  tareaRaceAndEthinicityMaxLength = 300;
  tareaRaceAndEthinicityCharachtersCount!: number;
  tareaRaceAndEthinicityCounter!: string;
  tareaRaceAndEthinicity = '';
  racialIdentityOptions!: any;
  popupClassMultiSelect = 'multiSelectSearchPopup';
  public racialName: any = [];
  public formUiStyle : UIFormStyle = new UIFormStyle();  
  appInfoForm!: FormGroup;
  pronounForm!:FormGroup;
  adjustmentAttributeList!: string[];
  lengthRestrictThirty=30;
  lengthRestrictForty=40;
  maxLengthSsn =9;

  /** Constructor**/
  constructor(private readonly clientfacade: ClientFacade,
    private readonly elementRef: ElementRef,private workflowFacade:WorkflowFacade,private formBuilder:FormBuilder) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlRacialIdentities();
    this.loadDdlPrimaryIdentities();
    this.loadDdlSpokenLanguages();
    this.loadDdlWrittenLanguages();
    this.loadDdlEnglishProficiencies();
    this.loadRdoTransGender();
    this.loadRdoSexAssigned();
    this.loadRdoMaterials();
    this.loadRdoInterpreter();
    this.loadRdoDeaf();
    this.loadRdoBlind();
    this.loadRdoWalking();
    this.loadRdoDressingorBathing();
    this.loadRdoConcentration();
    this.loadRdoErrands();
    this.loadTareaRaceAndEthinicity();
    this.buildForm();
    this.addAppInfoFormChangeSubscription();
    //this.addSaveSubscriptionToValidate();
    //this.clientfacade.appInfoFormSubject.next( this.appInfoForm);
    this.ValidateFields.emit(this.appInfoForm);
  }

  ngAfterViewInit(){
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {   
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    }); 
  }
  // private addSaveSubscriptionToValidate(): void {
  //  this.workflowFacade.saveAndContinueClicked$.subscribe(() => {
  //   var form = this.appInfoForm;
  //   debugger;
  //   });
  // }
  ngAfterViewChecked() {
    const initialAjustment: CompletionChecklist[] = [];
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {     
      const data: CompletionChecklist = {
        dataPointName: control.name,
        status: control.checked ? StatusFlag.Yes : StatusFlag.No
      };
      initialAjustment.push(data);
    });

    if (initialAjustment.length > 0) {
      this.AdjustAttrChanged.emit(initialAjustment);
    }
  }
 

  public onClose(event: any) {
    
      event.preventDefault();
   
  }
  public clearForm(): void {
    //this.form.reset();
  }
  /** Private methods **/ 

  private buildForm() {
    this.appInfoForm = new FormGroup({
      firstName: new FormControl('', {updateOn: 'blur'}),
      middleName: new FormControl({ value: '', disabled: false }, {updateOn: 'blur'}),
      chkmiddleName: new FormControl(''),
      lastName: new FormControl('', { updateOn: 'blur' }),
      prmInsFirstName: new FormControl('', { updateOn: 'blur' }),
      prmInsLastName: new FormControl('', { updateOn: 'blur' }),
      prmInsNotApplicable: new FormControl(false),
      officialIdFirstName: new FormControl('', { updateOn: 'blur' }),
      officialIdLastName: new FormControl('', { updateOn: 'blur' }),
      officialIdsNotApplicable: new FormControl(false),
      dateOfBirth: new FormControl(this.currentDate, { updateOn: 'blur' }),
      ssn: new FormControl('', { updateOn: 'blur' }),
      ssnNotApplicable: new FormControl(false)
      //TODO: other form controls 
    })

  
    
  }

  private adjustAttributeChanged(event: Event) { 
    const data: CompletionChecklist = {
      dataPointName: (event.target as HTMLInputElement).name,
      status: (event.target as HTMLInputElement).checked ? StatusFlag.Yes : StatusFlag.No
    };

    this.AdjustAttrChanged.emit([data]);
  }

  private addAppInfoFormChangeSubscription() {
    this.appInfoForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null), pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
        //this.validate()
        this.ValidateFields.emit(this.appInfoForm);
        //this.clientfacade.appInfoFormSubject.next( this.appInfoForm);
      });
      this.appInfoForm.statusChanges.subscribe(a=>{        
        this.ValidateFields.emit(this.appInfoForm);
        //this.clientfacade.appInfoFormSubject.next( this.appInfoForm);
    });
  }
  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.appInfoForm.controls).forEach(key => {
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
        if (this.appInfoForm?.get(key)?.value && this.appInfoForm?.get(key)?.valid) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: StatusFlag.Yes
          };

          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.AppInfoChanged.emit(completedDataPoints);
    }
  }

  private loadTareaRaceAndEthinicity() {
    this.tareaRaceAndEthinicityCharachtersCount = this.tareaRaceAndEthinicity
      ? this.tareaRaceAndEthinicity.length
      : 0;
    this.tareaRaceAndEthinicityCounter = `${this.tareaRaceAndEthinicityCharachtersCount}/${this.tareaRaceAndEthinicityMaxLength}`;
  }

  private loadRdoTransGender() {
    this.clientfacade.loadRdoTransGenders();
  }

  private loadRdoSexAssigned() {
    this.clientfacade.loadRdoSexAssigned();
  }

  private loadRdoMaterials() {
    this.clientfacade.loadRdoMaterials();
  }

  private loadRdoInterpreter() {
    this.clientfacade.loadRdoInterpreter();
  }

  private loadRdoDeaf() {
    this.clientfacade.loadRdoDeaf();
  }

  private loadRdoBlind() {
    this.clientfacade.loadRdoBlind();
  }

  private loadRdoWalking() {
    this.clientfacade.loadRdoWalking();
  }

  private loadRdoDressingorBathing() {
    this.clientfacade.loadRdoDressingorBathing();
  }

  private loadRdoConcentration() {
    this.clientfacade.loadRdoConcentration();
  }

  private loadRdoErrands() {
    this.clientfacade.loadRdoErrands();
  }

  private loadDdlRacialIdentities() {
    this.clientfacade.loadDdlRacialIdentities();
    this.ddlRacialIdentities$.subscribe({
      next: (racialIdentities) => {
        this.racialIdentityOptions = groupBy(racialIdentities, [
          { field: 'racialGroup' },
        ]);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private loadDdlPrimaryIdentities() {
    this.clientfacade.loadDdlPrimaryIdentities();
  }

  private loadDdlSpokenLanguages() {
    this.clientfacade.loadDdlSpokenLanguages();
  }

  private loadDdlWrittenLanguages() {
    this.clientfacade.loadDdlWrittenLanguages();
  }

  private loadDdlEnglishProficiencies() {
    this.clientfacade.loadDdlEnglishProficiencies();
  }

 
  /** Internal event methods **/
  onMiddleNameChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isMiddleNameChecked = true;
      this.appInfoForm.controls['middleName'].removeValidators(Validators.required);
      this.appInfoForm.controls['middleName'].updateValueAndValidity();      
    }
    else {
      this.isMiddleNameChecked = false;
      this.appInfoForm.controls['middleName'].setValidators(Validators.required);
      this.appInfoForm.controls['middleName'].updateValueAndValidity();    
    }
  }

  onInsuranceCardChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isInsuranceCardChecked = true;
      this.appInfoForm.controls['prmInsFirstName'].removeValidators(Validators.required);
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsLastName'].removeValidators(Validators.required);
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
    }
    else {
      this.isInsuranceCardChecked = false;
      this.appInfoForm.controls['prmInsFirstName'].setValidators(Validators.required);
      this.appInfoForm.controls['prmInsFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['prmInsLastName'].setValidators(Validators.required);
      this.appInfoForm.controls['prmInsLastName'].updateValueAndValidity();
    }
  }

  onOfficialIdChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isOfficialIdChecked = true;
      this.appInfoForm.controls['officialIdFirstName'].removeValidators(Validators.required);
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdLastName'].removeValidators(Validators.required);
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
    }
    else {
      this.isOfficialIdChecked = false;
      this.appInfoForm.controls['officialIdFirstName'].setValidators(Validators.required);
      this.appInfoForm.controls['officialIdFirstName'].updateValueAndValidity();
      this.appInfoForm.controls['officialIdLastName'].setValidators(Validators.required);
      this.appInfoForm.controls['officialIdLastName'].updateValueAndValidity();
    }
  }

  onSsnNotApplicableChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isSSNChecked = true;
      this.appInfoForm.controls['ssn'].removeValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
    }
    else {
      this.isSSNChecked = false;
      this.appInfoForm.controls['ssn'].setValidators(Validators.required);
      this.appInfoForm.controls['ssn'].updateValueAndValidity();
    }
  }

  onTransgenderRdoClicked(event: any) {
    this.transgenderSelectedValue = event.target.id;
    if (this.transgenderSelectedValue == 3) {
      this.isTransTextBoxDisabled = false;
    } else {
      this.isTransTextBoxDisabled = true;
    }
  }

  onSexAssignedRdoClicked(event: any) {
    this.sexAssignedSelectedValue = event.target.id;
    if (this.sexAssignedSelectedValue == 4) {
      this.isSexAssignedTextBoxDisabled = false;
    } else {
      this.isSexAssignedTextBoxDisabled = true;
    }
  }

  onMaterialsRdoClicked(event: any) {
    this.materialsSelectedValue = event.target.id;
    if (this.materialsSelectedValue == 1) {
      this.isMaterialsTextBoxDisabled = false;
    } else {
      this.isMaterialsTextBoxDisabled = true;
    }
  }

  onInterpreterRdoClicked(event: any) {
    this.interpreterSelectedValue = event.target.id;
    if (this.interpreterSelectedValue == 1) {
      this.isInterpreterTextBoxDisabled = false;
    } else {
      this.isInterpreterTextBoxDisabled = true;
    }
  }

  onDeafRdoClicked(event: any) {
    this.deafSelectedValue = event.target.id;
    if (this.deafSelectedValue == 1) {
      this.isDeafTextBoxDisabled = false;
    } else {
      this.isDeafTextBoxDisabled = true;
    }
  }

  onBlindRdoClicked(event: any) {
    this.blindSelectedValue = event.target.id;
    if (this.blindSelectedValue == 1) {
      this.isBlindTextBoxDisabled = false;
    } else {
      this.isBlindTextBoxDisabled = true;
    }
  }

  onWalkingRdoClicked(event: any) {
    this.walkingSelectedValue = event.target.id;
    if (this.walkingSelectedValue == 1) {
      this.isWalkingTextBoxDisabled = false;
    } else {
      this.isWalkingTextBoxDisabled = true;
    }
  }

  onDressingorBathingRdoClicked(event: any) {
    this.dressingOrBathingSelectedValue = event.target.id;
    if (this.dressingOrBathingSelectedValue == 1) {
      this.isDressingorBathingTextBoxDisabled = false;
    } else {
      this.isDressingorBathingTextBoxDisabled = true;
    }
  }

  onConcentrationRdoClicked(event: any) {
    this.concentrationSelectedValue = event.target.id;
    if (this.concentrationSelectedValue == 1) {
      this.isConcentrationTextBoxDisabled = false;
    } else {
      this.isConcentrationTextBoxDisabled = true;
    }
  }

  onErrandsRdoClicked(event: any) {
    this.errandsSelectedValue = event.target.id;
    if (this.errandsSelectedValue == 1) {
      this.isErrandsTextBoxDisabled = false;
    } else {
      this.isErrandsTextBoxDisabled = true;
    }
  }

  onTareaRaceAndEthinicityChanged(event: any): void {
    this.tareaRaceAndEthinicityCharachtersCount = event.length;
    this.tareaRaceAndEthinicityCounter = `${this.tareaRaceAndEthinicityCharachtersCount}/${this.tareaRaceAndEthinicityMaxLength}`;
  }
}
