/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';

/** External libraries **/
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dependent, DependentTypeCode } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-family-and-dependent-detail',
  templateUrl: './family-and-dependent-detail.component.html',
  styleUrls: ['./family-and-dependent-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentDetailComponent implements OnInit {

  /** Input properties **/
  @Input() isOpenedEditFamilyMember = true;
  @Input() isAddFamilyMember = true;
  @Input() dependentSearch$ : any;
  @Input() ddlRelationships$ : any;
  @Input() dependentTypeCodeSelected: any;
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() closeFamilyMemberFormEvent = new EventEmitter<any>();
  currentDate = new Date();
  /** Public properties **/
  familyMemberForm!: FormGroup;
  isOpenedNewFamilyMember = false;
  dependentSearch!: GroupResult[];
  popupClass = 'k-autocomplete-custom';
  isSubmitted = false;
  isExistDependent =false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(  
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadFamilyDependents();
    this.composeFamilyMemberForm();
    this.loadNewFamilyMemberData();  
  }

  /** Private methods **/
  private loadNewFamilyMemberData()
  {    
    this.isExistDependent =false;
    this.isOpenedNewFamilyMember =false;   
    if(this.dependentTypeCodeSelected== DependentTypeCode.Dependent)
    {
    this.onNewFamilyMemberClicked()
    }
    else
    {
      this.onExistingFamilyMemberLoad()
    }
  }
  private composeFamilyMemberForm()
  {
    this.familyMemberForm = this.formBuilder.group({
      concurrencyStamp: [''],
      relationshipCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      ssn: [''],
      enrolledInInsuranceFlag: ['', Validators.required],
      clientId: ['', ],
      clientDependentId: ['', ]
  });
  }
  private loadFamilyDependents() {   
    this.dependentSearch$.subscribe({
      next: (dependentSearch : any) => {
        this.dependentSearch = groupBy(dependentSearch, [
          { field: 'memberType' },
        ]);
      }
    });
  }


  /** Internal event methods **/
  onNewFamilyMemberClosed() {
    this.isOpenedNewFamilyMember = false;
  }

  onNewFamilyMemberClicked() {
    this.isOpenedNewFamilyMember = true;
    this.ref.markForCheck();
  }
  onExistingFamilyMemberLoad() {
    this.isExistDependent = true;
    this.ref.markForCheck();
  }

  onDependentSubmit()
  {
    this.isSubmitted = true;
   if(this.familyMemberForm.valid)
   {
      const dependent : Dependent = {
        concurrencyStamp: this.familyMemberForm?.controls["concurrencyStamp"].value,
        clientDependentId: this.familyMemberForm?.controls["clientDependentId"].value,
        clientId:  this.familyMemberForm?.controls["clientId"].value,
        dependentTypeCode: '',
        relationshipCode: this.familyMemberForm?.controls["relationshipCode"].value,
        relationship: '',
        firstName:  this.familyMemberForm?.controls["firstName"].value,
        lastName:  this.familyMemberForm?.controls["lastName"].value,
        fullName: '',
        ssn:  this.familyMemberForm?.controls["ssn"].value,
        dob: this.familyMemberForm?.controls["dob"].value,
        age: '',
        phoneNbr: '',
        effectiveDate: '',
        hivPositiveFlag: '',
        enrolledInInsuranceFlag: this.familyMemberForm?.controls["enrolledInInsuranceFlag"].value,
        justMemo: '',
        finMemo: '',
        proContactFlag: '',
        activeFlag: '',
        isCareAssistFlag: ''
      }

    this.addUpdateDependentEvent.next(dependent);   
   }
  }

  onFamilyMemberClosed()
  {
    this.isExistDependent =false;
    this.isOpenedNewFamilyMember =false;
    this.closeFamilyMemberFormEvent.next(true);
  }
}
