/** Angular **/
import { Component, ViewEncapsulation , ViewChild, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
/** External libraries **/
import { groupBy } from '@progress/kendo-data-query';
/** Facades **/
import { ClientFacade } from '@cms/case-management/domain';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { UIFormStyle } from '@cms/shared/ui-tpa'

 
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
  public form: FormGroup;

  public data: any = {
    firstname: "",
  };
  
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
  /** Constructor**/
  constructor(private readonly clientfacade: ClientFacade ) {
    this.form = new FormGroup({
      firstname: new FormControl(this.data.firstname, [Validators.required]),
     
    });
  }

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
 
  }
  public submitForm(): void {
    this.form.markAllAsTouched();
  }
 

  public onClose(event: any) {
    
      event.preventDefault();
   
  }
  public clearForm(): void {
    this.form.reset();
  }
  /** Private methods **/
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
