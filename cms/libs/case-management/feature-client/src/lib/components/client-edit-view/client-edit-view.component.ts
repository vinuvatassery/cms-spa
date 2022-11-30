/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation , ViewChild, Output, EventEmitter, ElementRef,Inject, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { groupBy } from '@progress/kendo-data-query';
import { debounceTime, distinctUntilChanged, filter, pairwise, startWith, Subscription } from 'rxjs';
/** Facades **/
import { ApplicantInfo, ClientFacade, CompletionChecklist, StatusFlag ,WorkflowFacade} from '@cms/case-management/domain';

/** Facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

import { kMaxLength } from 'buffer';


 
@Component({
  selector: 'case-management-client-edit-view',
  templateUrl: './client-edit-view.component.html',
  styleUrls: ['./client-edit-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewComponent implements OnInit,OnDestroy {
 
  public value = "";
  isVisible: any;
  isSelected = true;
  pronounList ={first:[{value:'',selected:false,code:''}],second:[{value:'',selected:false,code:''}]};
    // first: [   
    //   {value: 'She/Her/Hers'  ,selected: false,code:"SHE_HER_HERS"},
    //   {value: 'He/Him/His',selected: false,code:"HE_HIM_HIS"},
    //   {value: 'They/Them/Theirs',selected: false,code:"THEY_THEM_THEIRS"},
    //   {value: 'Ella',selected: false,code:"ELLA"},
    //   {value: 'Él',selected: false,code:"EL"},
    //   {value: 'Elles',selected: false,code:"ELLES"},
    //   {value: 'No pronouns, use their name',selected: false,code:"NO_PRONOUN"},
    //   {value: 'Not listed, please specify:',selected: false,code:"NOT_LISTED"}
    // ],
    // second:[
    //   {value:'Don’t know what this question is asking',selected:false,code:"DONT_KNOW"},
    //   {value:'Don’t want to answer',selected:false,code:"DONT WAIT"}]
    // };
  //pronouns=['He/Him/His','They/Them/Theirs','Ella','Él','Elles','No pronouns, use their name','Not listed, please specify:' ];

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
  pronounList$ = this.clientfacade.pronounList$;
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
  applicantInfo$ = this.clientfacade.applicantInfo$;
  applicantInfoSubscription !:Subscription;
  pronounListSubscription !:Subscription;
  //pronounSubscription !:Subscription;
  //selectedPronoun =['He/Him/His'];

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
    this.clientfacade.setPronounList();
    this.loadPronounList();
    this.buildForm();
    this.addAppInfoFormChangeSubscription();
    
    this.loadApplicantInfoSubscription();

    //this.getSelectedPronoun();
    
    //this.addSaveSubscriptionToValidate();
    //this.clientfacade.appInfoFormSubject.next( this.appInfoForm);
    this.ValidateFields.emit(this.appInfoForm);
  }
  ngOnDestroy(): void {
    this.applicantInfoSubscription.unsubscribe();
    this.pronounListSubscription.unsubscribe();
  }
  ngAfterViewInit(){
    const adjustControls = this.elementRef.nativeElement.querySelectorAll('.adjust-attr');
    adjustControls.forEach((control: any) => {   
      control.addEventListener('click', this.adjustAttributeChanged.bind(this));
    }); 
  }
loadPronounList(){
  this.pronounListSubscription = this.pronounList$.subscribe({
    next: response => {
      debugger;
      if(response !=null){
       this.pronounList = response;
      }
      
    } ,
  error: error => {         
    console.error(error);
  }
  });
}

  pronounChange(Event:any,code:any,index:any){
    debugger;
    var item = this.pronounList.first.find(x =>x.code == code)
    if(item != null){
      this.pronounList.first[index].selected =Event.target.checked;
    }
    else{
      this.pronounList.second[index].selected =Event.target.checked;
    }
    // } 
    // if(listName == 'first'){
    //   this.pronounList.first[index].selected =Event.target.checked;
    // }
    // if(listName == 'second'){
    //   this.pronounList.second[index].selected =Event.target.checked;
    // }

    // var trueIndexes = this.getAllIndexes(this.appInfoForm.controls["pronounsFirst"].value,true);
    // var falseIndexes = this.getAllIndexes(this.appInfoForm.controls["pronounsFirst"].value,false);
    // trueIndexes.forEach(i => {
    //   this.pronounList.first[i].selected =true;
    //  });
    //  falseIndexes.forEach(i => {
    //   this.pronounList.first[i].selected =false;
    //  });
     if(this.pronounList.first.filter(x=>x.value=="Not listed, please specify:" && x.selected== true).length>0){
       this.isPronounsChecked = true;
     }
     else{
      this.isPronounsChecked = false;
     }
     this.clientfacade.pronounListSubject.next(this.pronounList);
  }

 
  getAllIndexes(arr:any, val:boolean) {   
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
  }

 
  private loadApplicantInfoSubscription(){
      this.applicantInfoSubscription = this.clientfacade.applicantInfo$.subscribe((applicantInfo)=>{
     debugger;
     
      // this.pronounList.first[0].selected = true
      // this.pronounList.first[5].selected = true
      // this.appInfoForm.controls['pronounsFirst'].setValue(this.pronounList.first.map(x => x.selected == true));
     
      
      if(applicantInfo.client !=undefined){
      this.assignModelToForm(applicantInfo);
      }
     
    }); 
  }
  private getSelectedPronoun(){
    //debugger;
    //const control = this.appInfoForm.controls["selectedPronoun"];
    // control.valueChanges.subscribe(value => {
    //   debugger;
      // this.selectedPronoun = Object.keys(this.pronouns)
      // .map((contactNo, index) =>
      //   control.value[index] ? this.selectedPronoun[contactNo] : null
      // )
      // .filter(contactNo => !!contactNo);
    //});
  }
  private assignModelToForm(applicantInfo:ApplicantInfo){
    this.appInfoForm.controls["firstName"].setValue(applicantInfo.client?.firstName)
    this.appInfoForm.controls["middleName"].setValue(applicantInfo.client?.middleName)
    //this.appInfoForm.controls["chkmiddleName"].setValue(applicantInfo.client?.)
    this.appInfoForm.controls["lastName"].setValue(applicantInfo.client?.lastName)
    this.appInfoForm.controls["prmInsFirstName"].setValue(applicantInfo.clientCaseEligibility?.insuranceFirstName)
    this.appInfoForm.controls["prmInsLastName"].setValue(applicantInfo.clientCaseEligibility?.insuranceLastName)
    //this.appInfoForm.controls["prmInsNotApplicable"].setValue(applicantInfo.clientCaseEligibility?.)
    this.appInfoForm.controls["officialIdFirstName"].setValue(applicantInfo.clientCaseEligibility?.officialIdFirstName)
    this.appInfoForm.controls["officialIdLastName"].setValue(applicantInfo.clientCaseEligibility?.officialIdLastName)
    //this.appInfoForm.controls["officialIdsNotApplicable"].setValue(applicantInfo.clientCaseEligibility?.offi)

    this.appInfoForm.controls["dateOfBirth"].setValue(new Date(applicantInfo.client?.dob));
    this.appInfoForm.controls["ssn"].setValue(applicantInfo.client?.ssn)
    if(applicantInfo.client?.ssnNotApplicableFlag =="Y"){
      this.appInfoForm.controls["ssnNotApplicable"].setValue(true);
    }
    else{
      this.appInfoForm.controls["ssnNotApplicable"].setValue(false);
    }
    if(applicantInfo.clientCaseEligibility.registerToVoteFlag.toUpperCase() ==StatusFlag.Yes){
      this.isVisible = true;
      this.appInfoForm.controls["registerToVote"].setValue('Yes');
    }
    else{
      this.isVisible = false
      this.appInfoForm.controls["registerToVote"].setValue('No');
    }
    if(applicantInfo.clientPronounList != null || undefined){
      debugger;
      //let index = this.itemArray.items.indexOf(updateItem);
      //this.itemArray.items[index] = newItem;
      applicantInfo.clientPronounList.forEach(item => {
        var indexFirst = this.pronounList.first.findIndex(x=>x.code == item.clientPronounCode)
        if(indexFirst>-1){
          this.pronounList.first[indexFirst].selected =true;
        }
        var indexSecond = this.pronounList.second.findIndex(x=>x.code == item.clientPronounCode)
        if(indexSecond>-1){
          this.pronounList.second[indexSecond].selected =true;
        }
      })
      this.clientfacade.pronounListSubject.next(this.pronounList);
       this.appInfoForm.controls['pronounsFirst'].setValue(this.pronounList.first.map(x => x.selected == true));
       this.appInfoForm.controls['pronounsSecond'].setValue(this.pronounList.second.map(x => x.selected == true));
    }

    
  }
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
    this.appInfoForm = this.formBuilder.group({
      firstName: new FormControl('', {updateOn: 'blur'}),
      middleName: new FormControl({ value: '', disabled: false }, {updateOn: 'blur'}),
      chkmiddleName: new FormControl(''),
      lastName: new FormControl('', { updateOn: 'blur' }),
      prmInsFirstName: new FormControl('', { updateOn: 'blur' }),
      prmInsLastName: new FormControl('', { updateOn: 'blur' }),
      prmInsNotApplicable: new FormControl(),
      officialIdFirstName: new FormControl('', { updateOn: 'blur' }),
      officialIdLastName: new FormControl('', { updateOn: 'blur' }),
      officialIdsNotApplicable: new FormControl(false),
      dateOfBirth: new FormControl(this.currentDate, { updateOn: 'blur' }),
      ssn: new FormControl('', { updateOn: 'blur' }),
      ssnNotApplicable: new FormControl(),
      registerToVote:new FormControl(),
      pronounsFirst:this.formBuilder.array(this.pronounList.first.map(x => x.selected == true)),
      //this.formBuilder.array(Object.keys(this.selectedPronoun).map(key => true)),
      pronounsSecond:this.formBuilder.array(this.pronounList.second.map(x => x.selected == true)),
      notListedPronoun:new FormControl('', { updateOn: 'blur' }),
      
    });

    // this.appInfoForm = new FormGroup({
    //   firstName: new FormControl('', {updateOn: 'blur'}),
    //   middleName: new FormControl({ value: '', disabled: false }, {updateOn: 'blur'}),
    //   chkmiddleName: new FormControl(''),
    //   lastName: new FormControl('', { updateOn: 'blur' }),
    //   prmInsFirstName: new FormControl('', { updateOn: 'blur' }),
    //   prmInsLastName: new FormControl('', { updateOn: 'blur' }),
    //   prmInsNotApplicable: new FormControl(),
    //   officialIdFirstName: new FormControl('', { updateOn: 'blur' }),
    //   officialIdLastName: new FormControl('', { updateOn: 'blur' }),
    //   officialIdsNotApplicable: new FormControl(false),
    //   dateOfBirth: new FormControl(this.currentDate, { updateOn: 'blur' }),
    //   ssn: new FormControl('', { updateOn: 'blur' }),
    //   ssnNotApplicable: new FormControl(),
    //   registerToVote:new FormControl(),
    //  // selectedPronoun: this.formBuilder.array(Object.keys(this.pronouns).map(key => false))
    //   //TODO: other form controls 
    // })  
  }

  buildPronouns() {
    const arr = this.pronounList.first.map(value => {
      return this.formBuilder.control(value.selected);
    });
    return this.formBuilder.array(arr);
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
  registerToVoteSelected(event:Event){
   if((event.target as HTMLInputElement).value.toUpperCase()=="YES"){
    this.isVisible = true;
   }
   else{
    this.isVisible = false;
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
