/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'  
 
@Component({
  selector: 'case-management-special-handling-detail',
  templateUrl: './special-handling-detail.component.html',
  styleUrls: ['./special-handling-detail.component.scss'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialHandlingDetailComponent implements OnInit {
  
  public formUiStyle : UIFormStyle = new UIFormStyle();
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
  tareacaseWorkerNote: any[] = [
    {
      id: 1,
      description: '',
      tareaCaseWorkerNoteCounter: 0,
    },
  ];

  /** Constructor **/
  constructor(private readonly clientfacade: ClientFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadRdoMaterials();
    this.loadRdoInterpreter();
    this.loadRdoDeaf();
    this.loadRdoBlind();
    this.loadRdoWalking();
    this.loadRdoDressingorBathing();
    this.loadRdoConcentration();
    this.loadRdoErrands();
  }

  /** Private methods **/
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
  onMaterialsRadioButtonClicked(event: any) {
    this.materialsSelectedValue = event.target.id;
    if (this.materialsSelectedValue == 1) {
      this.isMaterialsTextBoxDisabled = false;
    } else {
      this.isMaterialsTextBoxDisabled = true;
    }
  }

  onDeafRadioButtonClicked(event: any) {
    this.deafSelectedValue = event.target.id;
    if (this.deafSelectedValue == 1) {
      this.isDeafTextBoxDisabled = false;
    } else {
      this.isDeafTextBoxDisabled = true;
    }
  }

  onBlindRadioButtonClicked(event: any) {
    this.blindSelectedValue = event.target.id;
    if (this.blindSelectedValue == 1) {
      this.isBlindTextBoxDisabled = false;
    } else {
      this.isBlindTextBoxDisabled = true;
    }
  }

  onWalkingRadioButtonClicked(event: any) {
    this.walkingSelectedValue = event.target.id;
    if (this.walkingSelectedValue == 1) {
      this.isWalkingTextBoxDisabled = false;
    } else {
      this.isWalkingTextBoxDisabled = true;
    }
  }

  onDressingorBathingRadioButtonClicked(event: any) {
    this.dressingOrBathingSelectedValue = event.target.id;
    if (this.dressingOrBathingSelectedValue == 1) {
      this.isDressingorBathingTextBoxDisabled = false;
    } else {
      this.isDressingorBathingTextBoxDisabled = true;
    }
  }

  onConcentrationRadioButtonClicked(event: any) {
    this.concentrationSelectedValue = event.target.id;
    if (this.concentrationSelectedValue == 1) {
      this.isConcentrationTextBoxDisabled = false;
    } else {
      this.isConcentrationTextBoxDisabled = true;
    }
  }

  onErrandsRadioButtonClicked(event: any) {
    this.errandsSelectedValue = event.target.id;
    if (this.errandsSelectedValue == 1) {
      this.isErrandsTextBoxDisabled = false;
    } else {
      this.isErrandsTextBoxDisabled = true;
    }
  }

  onTareaCaseWorkerChanged(
    onHandleCaseWorkerCharacterEvent: any,
    id: any
  ): void {
    this.tareacaseWorkerNote.forEach((res) => {
      if (res.id === id) {
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

  onAddCaseWorkerNote() {
    this.tareaCaseWorkerNoteCharachtersCount = 0;
    this.tareaCaseWorkerNoteCounter += 1;
    this.tareacaseWorkerNote.push({
      id: this.tareaCaseWorkerNoteCounter,
      description: '',
      tareaCaseWorkerNoteCounter: this.tareaCaseWorkerNoteCharachtersCount,
    });
  }
}
