/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Facades **/
import {
  ClientFacade,
  ApplicantInfo,
  ClientNoteTypeCode,
  ClientCaseEligibilityFlag,
  ClientCaseEligibility,
  Client,
  ClientCaseEligibilityAndFlag,
} from '@cms/case-management/domain';
import { LovFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-special-handling-detail',
  templateUrl: './special-handling-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialHandlingDetailComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public specialCaseHandlingForm!: FormGroup;
  @Output() isSpecialHandlingPopupClose = new EventEmitter<any>();
  /** Public properties **/
  rdoMaterials$ = this.clientfacade.rdoMaterials$;
  rdoInterpreters$ = this.clientfacade.rdoInterpreters$;
  rdoDeafs$ = this.clientfacade.rdoDeaf$;
  rdoBlinds$ = this.clientfacade.rdoBlind$;
  rdoWalked$ = this.clientfacade.rdoWalked$;
  rdoDressedorBathed$ = this.clientfacade.rdoDressedorBathed$;
  rdoConcentration$ = this.clientfacade.rdoConcentration$;
  rdoErrands$ = this.clientfacade.rdoErrands$;
  isConcentrationTextBoxDisabled = true;
  isBlindTextBoxDisabled = true;
  isDressingorBathingTextBoxDisabled = true;
  isWalkingTextBoxDisabled = true;
  isDeafTextBoxDisabled = true;
  isMaterialsTextBoxDisabled = true;
  isErrandsTextBoxDisabled = true;
  isEmpty = false;
  materialsSelectedValue!: number;
  deafSelectedValue!: number;
  walkingSelectedValue!: number;
  blindSelectedValue!: number;
  dressingOrBathingSelectedValue!: number;
  concentrationSelectedValue!: number;
  errandsSelectedValue!: number;
  tareaCaseWorkerNoteCharachtersCount = 0;
  tareaCaseNoteWorker = '';
  tareaCaseWorkerNoteMaxLength = 100;
  tareaCaseWorkerNoteCounter = 1;
  materialsyeslov$ = this.lovFacade.materialsyeslov$;
  tareacaseWorkerNote: any[] = [];
  applicantInfo$ = this.clientfacade.applicantInfo$;
  applicantInfo = {} as ApplicantInfo;
  profileClientId: any;
  clientCaseEligibilityId: any;
  clientCaseId: any;
  isShowForm = false;
  textFieldDisable = true;
  ageMinLimit = 1;
  ageMaxLimit = 9999999999;

  /** Constructor **/
  constructor(
    private readonly elementRef: ElementRef,
    private clientfacade: ClientFacade,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private lovFacade: LovFacade,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {
    this.buildSpecialCaseHandlingForm();
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadLovs();
    this.loadRdoMaterials();
    this.loadRdoInterpreter();
    this.loadRdoDeaf();
    this.loadRdoBlind();
    this.loadRdoWalking();
    this.loadRdoDressingorBathing();
    this.loadRdoConcentration();
    this.loadRdoErrands();
    this.loadQueryParams();
    this.textFieldDisable = true;
    this.cdRef.detectChanges();
  }

  private loadLovs() {
    this.lovFacade.getMaterialYesLovs();
    this.lovFacade.getApplicantInfoLovs();
  }
  loadQueryParams() {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.clientCaseId = this.route.snapshot.queryParams['cid'];
    this.loadApplicantInfo();
  }
  private loadApplicantInfo() {

    this.loaderService.show();
    if (this.applicantInfo.client == undefined) {
      this.applicantInfo.client = new Client();
      this.applicantInfo.ClientNotes = [];
    }

    if (this.applicantInfo.clientCaseEligibilityAndFlag === undefined) {
      this.applicantInfo.clientCaseEligibilityAndFlag =
        new ClientCaseEligibilityAndFlag();
    }
    this.clientfacade
      .load(
        this.profileClientId,
        this.clientCaseId,
        this.clientCaseEligibilityId)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.loaderService.hide();
            this.isShowForm = true;
            /**Populating Client */

            this.applicantInfo.client = response.client;

            if(response.clientNotes?.length > 0){
              this.tareacaseWorkerNote = response.clientNotes
              this.tareacaseWorkerNote.forEach ((clientNote:any,index:any) =>{
                clientNote.id = index + 1})
            }else {
              this.applicantInfo.ClientNotes = [];
              this.tareacaseWorkerNote = [];
            }

            /* Populate Client Case Eligibility */
            if (
              this.applicantInfo.clientCaseEligibilityAndFlag
                .clientCaseEligibility === undefined
            ) {
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
                new ClientCaseEligibility();
            }
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibility =
              response.clientCaseEligibilityAndFlag.clientCaseEligibility;

            /* Populate Client Case Eligibility Flag */
            if (
              this.applicantInfo.clientCaseEligibilityAndFlag
                .clientCaseEligibilityFlag === undefined
            ) {
              this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag =
                new ClientCaseEligibilityFlag();
            }
            this.applicantInfo.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag =
              response.clientCaseEligibilityAndFlag.clientCaseEligibilityFlag;
            this.assignModelToForm(this.applicantInfo);
          }

        },
        error: (error: any) => {
          this.loaderService.hide();
        },
      });
  }
  setModelValuesForUpdate() {
    this.applicantInfo.client.materialInAlternateFormatCode =
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatCode'
      ]?.value;
      this.applicantInfo.client.materialInAlternateFormatDesc =
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatDesc'
      ]?.value;
      this.applicantInfo.client.materialInAlternateFormatOther =
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ]?.value;
    this.applicantInfo.client.interpreterCode =
      this.specialCaseHandlingForm.controls['interpreterCode']?.value;
      this.applicantInfo.client.interpreterType =
      this.specialCaseHandlingForm.controls['interpreterType']?.value;
    this.applicantInfo.client.deafOrHearingCode =
      this.specialCaseHandlingForm.controls['deafOrHearingCode']?.value;
      this.applicantInfo.client.startAgeDeafOrHearing =
      this.specialCaseHandlingForm.controls['startAgeDeafOrHearing']?.value;
    this.applicantInfo.client.blindSeeingCode =
      this.specialCaseHandlingForm.controls['blindSeeingCode']?.value;
      this.applicantInfo.client.startAgeBlindSeeing =
      this.specialCaseHandlingForm.controls['startAgeBlindSeeing']?.value;
    this.applicantInfo.client.limitingConditionCode =
      this.specialCaseHandlingForm.controls['limitingConditionCode']?.value;
    this.applicantInfo.client.walkingClimbingDifficultyCode =
      this.specialCaseHandlingForm.controls[
        'walkingClimbingDifficultyCode'
      ]?.value;
      this.applicantInfo.client.startAgeWalkingClimbingDifficulty =
      this.specialCaseHandlingForm.controls[
        'startAgeWalkingClimbingDifficulty'
      ]?.value;
    this.applicantInfo.client.dressingBathingDifficultyCode =
      this.specialCaseHandlingForm.controls[
        'dressingBathingDifficultyCode'
      ]?.value;
      this.applicantInfo.client.startAgeDressingBathingDifficulty =
      this.specialCaseHandlingForm.controls[
        'startAgeDressingBathingDifficulty'
      ]?.value;
    this.applicantInfo.client.concentratingDifficultyCode =
      this.specialCaseHandlingForm.controls[
        'concentratingDifficultyCode'
      ]?.value;
      this.applicantInfo.client.startAgeConcentratingDifficulty =
      this.specialCaseHandlingForm.controls[
        'startAgeConcentratingDifficulty'
      ]?.value;
    this.applicantInfo.client.errandsDifficultyCode =
      this.specialCaseHandlingForm.controls['errandsDifficultyCode']?.value;
      this.applicantInfo.client.startAgeErrandsDifficulty =
      this.specialCaseHandlingForm.controls['startAgeErrandsDifficulty']?.value;
    this.applicantInfo.client.isSpecialCaseHandlingUpdate = true;

    this.applicantInfo.ClientNotes = this.tareacaseWorkerNote;
  }
  onUpdateSpecialCaseHandlingDetail() {
    if(this.tareacaseWorkerNote.length > 0){
     let isNoteEmpty= this.tareacaseWorkerNote.some(clientNote=>clientNote.note == "")
     if(isNoteEmpty){
      this.isEmpty=true;
      return;
     }
    }
    if(this.specialCaseHandlingForm.valid){
      this.setModelValuesForUpdate();
      this.loaderService.show();
      this.clientfacade
        .update(this.applicantInfo, this.profileClientId)
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.loaderService.hide();
              this.onEditSpecialHandlingClosed();

              this.clientfacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Special Handling  updated successfully'
              );
            }
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.clientfacade.showHideSnackBar(
              SnackBarNotificationType.ERROR,
              error
            );
          },
        });
    }else{
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.specialCaseHandlingForm, this.elementRef.nativeElement,null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
    }

  }
  /** Private methods **/
  buildSpecialCaseHandlingForm() {
    this.specialCaseHandlingForm = this.formBuilder.group({
      materialInAlternateFormatCode: ['', Validators.required],
      materialInAlternateFormatDesc: ['',Validators.required],
      materialInAlternateFormatOther: ['',Validators.required],
      interpreterCode: ['', Validators.required],
      interpreterType: [''],
      deafOrHearingCode: ['', Validators.required],
      startAgeDeafOrHearing: ['', Validators.required],
      blindSeeingCode: ['', Validators.required],
      startAgeBlindSeeing: ['', Validators.required],
      limitingConditionCode: ['', Validators.required],
      walkingClimbingDifficultyCode: ['', Validators.required],
      startAgeWalkingClimbingDifficulty: ['', Validators.required],
      dressingBathingDifficultyCode: ['', Validators.required],
      startAgeDressingBathingDifficulty: ['', Validators.required],
      concentratingDifficultyCode: ['', Validators.required],
      startAgeConcentratingDifficulty: ['', Validators.required],
      errandsDifficultyCode: ['', Validators.required],
      startAgeErrandsDifficulty: ['', Validators.required],
    });
  }

  private assignModelToForm(applicantInfo: ApplicantInfo) {
    this.specialCaseHandlingForm.controls[
      'materialInAlternateFormatCode'
    ].setValue(applicantInfo.client.materialInAlternateFormatCode);
    this.specialCaseHandlingForm.controls[
      'materialInAlternateFormatDesc'
    ].setValue(applicantInfo.client.materialInAlternateFormatDesc);

    if (this.applicantInfo.client?.materialInAlternateFormatCode === 'YES') {
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatDesc'
      ].setValue(this.applicantInfo.client.materialInAlternateFormatDesc);
    }else {
      this.specialCaseHandlingForm.controls['materialInAlternateFormatDesc'].disable();

    }
    if (this.applicantInfo.client?.materialInAlternateFormatDesc === 'OTHER') {
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].setValue(applicantInfo.client.materialInAlternateFormatOther);
    }else {
      this.specialCaseHandlingForm.controls['materialInAlternateFormatOther'].setValue(
        null
      );
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].setValidators(null);
      this.specialCaseHandlingForm.controls['materialInAlternateFormatOther'].updateValueAndValidity();

    }
    this.specialCaseHandlingForm.controls['interpreterCode'].setValue(
      applicantInfo.client.interpreterCode
    );
    this.specialCaseHandlingForm.controls['interpreterType'].setValue(
      applicantInfo.client.interpreterType
    );
    if (applicantInfo.client?.interpreterCode != 'YES') {
      this.specialCaseHandlingForm.controls['interpreterType'].disable();
    }

    this.specialCaseHandlingForm.controls['deafOrHearingCode'].setValue(
      applicantInfo.client.deafOrHearingCode
    );
    this.specialCaseHandlingForm.controls['startAgeDeafOrHearing'].setValue(
      applicantInfo.client.startAgeDeafOrHearing
    );
    if (applicantInfo.client.deafOrHearingCode != 'YES') {
      this.specialCaseHandlingForm.controls['startAgeDeafOrHearing'].disable();
    }

    this.specialCaseHandlingForm.controls['blindSeeingCode'].setValue(
      applicantInfo.client.blindSeeingCode
    );
    this.specialCaseHandlingForm.controls['startAgeBlindSeeing'].setValue(
      applicantInfo.client.startAgeBlindSeeing
    );
    if (applicantInfo.client?.blindSeeingCode != 'YES') {
      this.specialCaseHandlingForm.controls['startAgeBlindSeeing'].disable();
    }

    this.specialCaseHandlingForm.controls['limitingConditionCode'].setValue(
      applicantInfo.client.limitingConditionCode
    );
    this.specialCaseHandlingForm.controls[
      'walkingClimbingDifficultyCode'
    ].setValue(applicantInfo.client.walkingClimbingDifficultyCode);
    this.specialCaseHandlingForm.controls[
      'startAgeWalkingClimbingDifficulty'
    ].setValue(applicantInfo.client.startAgeWalkingClimbingDifficulty);
    if (applicantInfo.client?.walkingClimbingDifficultyCode != 'YES') {
      this.specialCaseHandlingForm.controls[
        'startAgeWalkingClimbingDifficulty'
      ].disable();
    }
    this.specialCaseHandlingForm.controls[
      'dressingBathingDifficultyCode'
    ].setValue(applicantInfo.client.dressingBathingDifficultyCode);
    this.specialCaseHandlingForm.controls[
      'startAgeDressingBathingDifficulty'
    ].setValue(applicantInfo.client.startAgeDressingBathingDifficulty);
    if (applicantInfo.client?.dressingBathingDifficultyCode != 'YES') {
      this.specialCaseHandlingForm.controls[
        'startAgeDressingBathingDifficulty'
      ].disable();

    }

    this.specialCaseHandlingForm.controls[
      'concentratingDifficultyCode'
    ].setValue(applicantInfo.client.concentratingDifficultyCode);
    this.specialCaseHandlingForm.controls[
      'startAgeConcentratingDifficulty'
    ].setValue(applicantInfo.client.startAgeConcentratingDifficulty);
    if (applicantInfo.client?.concentratingDifficultyCode != 'YES') {
      this.specialCaseHandlingForm.controls[
        'startAgeConcentratingDifficulty'
      ].disable();
    }

    this.specialCaseHandlingForm.controls['errandsDifficultyCode'].setValue(
      applicantInfo.client.errandsDifficultyCode
    );
    this.specialCaseHandlingForm.controls['startAgeErrandsDifficulty'].setValue(
      applicantInfo.client.startAgeErrandsDifficulty
    );
    if (applicantInfo.client?.errandsDifficultyCode != 'YES') {
      this.specialCaseHandlingForm.controls[
        'startAgeErrandsDifficulty'
      ].disable();
    }
    this.cdRef.detectChanges();
  }
  detectOptionChange(
    selectedControlerName: string,
    otherControlerName: string
  ) {
    this.textFieldDisable = false;
    this.cdRef.detectChanges();
    this.specialCaseHandlingForm
      ?.get(selectedControlerName)
      ?.valueChanges.subscribe((changedValue: any) => {
        if (
          changedValue &&
          changedValue != '' &&
          changedValue.toUpperCase() == 'YES'
        ) {
          this.specialCaseHandlingForm.controls[otherControlerName].enable();
          this.specialCaseHandlingForm.controls[
            otherControlerName
          ].setValidators(Validators.required);
          this.specialCaseHandlingForm.controls[
            otherControlerName
          ].updateValueAndValidity();

          this.cdRef.detectChanges();
        } else {
          this.specialCaseHandlingForm.controls[otherControlerName].setValue(
            null
          );
          this.specialCaseHandlingForm.controls[
            otherControlerName
          ].setValidators(null);
          this.specialCaseHandlingForm.controls[
            otherControlerName
          ].updateValueAndValidity();

          this.specialCaseHandlingForm.controls[otherControlerName].disable();
          this.cdRef.detectChanges();
        }
      });
  }
  onChange(event:any){
    if( this.specialCaseHandlingForm.controls[
      'materialInAlternateFormatDesc'
    ]?.value == 'OTHER'){
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].setValidators(Validators.required);
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].updateValueAndValidity();
     }else {
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].setValue(null);
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].setValidators(null);
      this.specialCaseHandlingForm.controls[
        'materialInAlternateFormatOther'
      ].updateValueAndValidity();
     }


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

  /** Internal event methods **/
  onTareaCaseWorkerChanged(
    onHandleCaseWorkerCharacterEvent: any,
    item: any
  ): void {
    onHandleCaseWorkerCharacterEvent = onHandleCaseWorkerCharacterEvent?.trim();
    item.note = item?.note?.trim();
    this.tareacaseWorkerNote.forEach((res) => {
      if (res.id ===item.id) {
        res.tareaCaseWorkerNoteCounter =
          onHandleCaseWorkerCharacterEvent.length;
      }
    });
  }

  onDeleteCaseWorkerNote(id: number) {
    const index = this.tareacaseWorkerNote.findIndex((res) => res.id === id);
    this.tareacaseWorkerNote.splice(index, 1);
    if (this.tareaCaseWorkerNoteCounter === 0) {
      this.tareaCaseWorkerNoteCounter = 1;
    }
  }

  deleteClientNote(item:any) {
    if(item.clientNotesId){
      this.loaderService.show();
      this.clientfacade.deleteClientNote(
        this.profileClientId,
        item.clientNotesId)
         .subscribe({
        next: (response: any) => {
          if(response){
            this.clientfacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Client Notes deleted successfully'
            );
            this.loadApplicantInfo();
            this.clientfacade.hideLoader();
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.clientfacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error)
        }
     })
    }else {
      this.onDeleteCaseWorkerNote(item.id)
    }


}

  onAddCaseWorkerNote() {

    this.tareaCaseWorkerNoteCharachtersCount = 0;
    this.tareaCaseWorkerNoteCounter += 1;
    this.tareacaseWorkerNote.push({
      id: this.tareaCaseWorkerNoteCounter,
      clientNotesId:null,
      note: '',
      isDeleted:false,
      extraProperties:null,
      concurrencyStamp:null,
      activeFlag:'Y',
      creationTime:null,
      lastModifierId:null,
      creatorId:null,
      deleterId:null,
      deletionTime:null,
      noteCreationDate:null,
      loginUserId:null,
      lastModificationTime:null,
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      clientId: Number(this.profileClientId),
      noteTypeCode:ClientNoteTypeCode.specialHandling
    });

  }
  onEditSpecialHandlingClosed() {
    this.isSpecialHandlingPopupClose.emit(true);
  }
}
