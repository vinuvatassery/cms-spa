/** Angular **/
import {
  Component,  OnInit,  ChangeDetectionStrategy,  Input,
  ChangeDetectorRef,  Output,  EventEmitter,} from '@angular/core';

/** External libraries **/
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DependentTypeCode } from '@cms/case-management/domain';
import { debounceTime, distinctUntilChanged, first, Subject } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
import { Lov } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-family-and-dependent-detail',
  templateUrl: './family-and-dependent-detail.component.html',
  styleUrls: ['./family-and-dependent-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentDetailComponent implements OnInit {

  /** Input properties **/
  @Input() isOpenedEditFamilyMember = true;
  @Input() dependentSearch$ : any;
  @Input() ddlRelationships$ : any;
  @Input() dependentTypeCodeSelected: any;
  @Input() dependentGet$: any;
  @Input() dependentGetExisting$ : any;
  @Input() timeFormat : any;
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() closeFamilyMemberFormEvent = new EventEmitter<any>();
  @Output() getNewFamilyMemberFormEvent = new EventEmitter<any>();
  @Output() formDeleteclickEvent = new EventEmitter<any>();
  @Output() searchTextEvent = new EventEmitter<string>();
  @Output() addExistingClientEvent = new EventEmitter<any>();

  filterManager: Subject<string> = new Subject<string>();
  searchResultSubject = new Subject<any>();
  searchResult$ = this.searchResultSubject.asObservable();
  currentDate = new Date();
  /** Public properties **/
  familyMemberForm!: FormGroup;
  existFamilyMemberForm!: FormGroup;
  isOpenedNewFamilyMember = false;
  showDependentSearchInputLoader = false;
  dependentSearch!: GroupResult[];
  popupClass = 'k-autocomplete-custom autocompletecombo';
  ssnMaskFormat = "000-00-0000"
  isSubmitted = false;
  isExistSubmitted = false;
  isExistDependent =false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isAddFamilyMember =true;
  clientDependentId! : string;
  dependentTypeCode! : string;
  fullClientName! : string;
  relationshipList: Array<Lov> = [];
  btnDisabled = false;
  public showDateError: boolean = false;
  /** Constructor **/
  constructor(
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public intl: IntlService
  ) {

    this.filterManager
    .pipe(
    debounceTime(500),
    distinctUntilChanged()
    )
    .subscribe(
      (text) =>
      {
        if(text)
        {
        this.searchTextEvent.emit(text)

        }
      }
      );

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.composeFamilyMemberForm();
    this.loadNewFamilyMemberData();
    this.updateRelationshipList();
  }

  /** Private methods **/
  private loadNewFamilyMemberData()
  {
    this.isExistDependent =false;
    this.isOpenedNewFamilyMember =false;
    this.onNewFamilyMemberClicked()
  }


  private composeFamilyMemberForm()
  {
    this.familyMemberForm = this.formBuilder.group({
      concurrencyStamp: [''],
      relationshipCode: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.maxLength(40)]],
      dob: ['', Validators.required],
      ssn: [''],
      enrolledInInsuranceFlag: ['', Validators.required],
      clientId: [0, ],
      clientDependentId: ['', ],
      dependentTypeCode: ['', ]
  });
  this.onFamilyFormLoad()
  }

  private loadFamilyDependents() {

   this.dependentSearch$.subscribe({
      next: (dependentSearch : any) => {
        this.dependentSearch = groupBy(dependentSearch, [
          { field: 'memberType' },
        ]);
        this.searchResultSubject.next(this.dependentSearch);
        this.showDependentSearchInputLoader = false;
      }

    });


  }

  private updateRelationshipList() {
    this.ddlRelationships$.subscribe((data: any) => {
      this.relationshipList = data.filter((relation: Lov) => relation.lovCode != 'F');
    });
  }

  /** Internal event methods **/
  onNewFamilyMemberClicked() {
    this.isOpenedNewFamilyMember = true;
    this.isExistDependent =false;
    this.ref.markForCheck();
  }
  onExistingFamilyMemberLoad() {
    this.isExistDependent = true;
    this.isOpenedNewFamilyMember = false;
    this.ref.markForCheck();
  }

  onFormDeleteclick()
  {
    const deleteParams =
    {
      clientRelationshipId : this.clientDependentId ,
      dependentTypeCode : this.dependentTypeCode
    }
    this.formDeleteclickEvent.next(deleteParams);
    this.onFamilyMemberClosed();
  }

  private composeExistFamilyMemberForm()
  {
        this.existFamilyMemberForm = this.formBuilder.group({
          existRelationshipCode: ['', Validators.required],
          clientId: [0, Validators.required],
          dependentClientId: [0]  ,
          clientDependentId: ['', Validators.required]  ,
          dependentType   : ['', Validators.required]  ,
          selectedClientDependentId: ['']
      });
      this.onExitFamilyFormLoad()
  }

  onSearchTemplateClick(dataItem : any)
  {
   this.existFamilyMemberForm.patchValue(
     {
       clientId: dataItem?.clientId ?? 0 ,
       dependentType : dataItem?.clientId > 0 ? DependentTypeCode.CAClient : DependentTypeCode.Dependent,
       clientDependentId :  dataItem?.clientDependentId
     })

  }
  onExitFamilyFormLoad()
  {
   this.dependentGetExisting$?.pipe(first((existDependentData: any ) => existDependentData?.clientRelationshipId != null))
   .subscribe((existDependentData: any) =>
   {
       if(existDependentData?.clientRelationshipId)
       {
        const fullName = existDependentData?.firstName + ' ' + existDependentData?.lastName

        const dateOB = new Date(existDependentData.dob)

        this.fullClientName = fullName + ' DOB '+ ((dateOB.getMonth()+1) +'/'+dateOB.getDate()+'/'+dateOB.getFullYear() )+((existDependentData?.ssn=='' || existDependentData?.ssn==null) ?  "" :' SSN '+existDependentData?.ssn )

        this.clientDependentId = existDependentData?.clientRelationshipId;
        this.dependentTypeCode = DependentTypeCode.CAClient;
         this.isAddFamilyMember =false;
           this.existFamilyMemberForm.setValue(
             {
               clientId:  existDependentData?.dependentClientId ?? 0,
               dependentClientId:  existDependentData?.dependentClientId ?? 0,
               existRelationshipCode: existDependentData?.relationshipCode,
               clientDependentId: existDependentData?.clientRelationshipId,
               dependentType: DependentTypeCode.CAClient,
               selectedClientDependentId :  existDependentData?.clientRelationshipId
             }
           )

       }
   })
  }

  onExistDependentSubmit()
  {
    this.isExistSubmitted =true;
    this.existFamilyMemberForm.markAllAsTouched();

    if(this.existFamilyMemberForm.valid)
    {
      const existDepData =
      {
        clientId : this.existFamilyMemberForm?.controls["clientId"].value,
        dependentClientId  : this.existFamilyMemberForm?.controls["dependentClientId"].value ,
        dependentType :DependentTypeCode.CAClient ,
        relationshipCode : this.existFamilyMemberForm?.controls["existRelationshipCode"].value ,
        clientDependentId : this.existFamilyMemberForm?.controls["clientDependentId"].value ,
        selectedClientDependentId: this.existFamilyMemberForm?.controls["selectedClientDependentId"].value
      }

      existDepData.clientDependentId =  existDepData?.clientDependentId=='' ? "00000000-0000-0000-0000-000000000000" : existDepData?.clientDependentId
      existDepData.selectedClientDependentId =  existDepData?.selectedClientDependentId=='' ? "00000000-0000-0000-0000-000000000000" : existDepData?.selectedClientDependentId

      this.addExistingClientEvent.emit(existDepData)
    }
  }


  onDependentSubmit()
  {
    this.isSubmitted = true;
    this.familyMemberForm.markAllAsTouched();
   if(this.familyMemberForm.valid)
   {
      const dependent  = {
        concurrencyStamp: this.familyMemberForm?.controls["concurrencyStamp"].value,
        clientRelationshipId: this.familyMemberForm?.controls["clientDependentId"].value,
        clientId:  this.familyMemberForm?.controls["clientId"].value,
        relationshipTypeCode: this.familyMemberForm?.controls["relationshipCode"].value,
        firstName:  this.familyMemberForm?.controls["firstName"].value,
        lastName:  this.familyMemberForm?.controls["lastName"].value,
        ssn:  this.familyMemberForm?.controls["ssn"].value?.replace('-', '').replace('-', ''),
        dob: this.familyMemberForm?.controls["dob"].value,
        enrolledInInsuranceFlag: this.familyMemberForm?.controls["enrolledInInsuranceFlag"].value
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

    onFamilyFormLoad()
    {

      this.isExistDependent =false;
      this.dependentGet$.pipe(first((dependentData: any ) => dependentData?.clientRelationshipId != null))
      .subscribe((dependentData: any) =>
      {
          if(dependentData?.clientRelationshipId)
          {
            this.isOpenedNewFamilyMember =true;
            this.isAddFamilyMember =false;
            this.clientDependentId = dependentData?.clientRelationshipId;
              this.dependentTypeCode = dependentData?.dependentTypeCode;
              this.familyMemberForm.setValue(
                {
                  concurrencyStamp: dependentData?.concurrencyStamp,
                  clientDependentId: dependentData?.clientRelationshipId,
                  clientId:  dependentData?.clientId,
                  relationshipCode: dependentData?.relationshipCode,
                  firstName:  dependentData?.firstName,
                  lastName:  dependentData?.lastName,
                  ssn:  dependentData?.ssn,
                  dob: new Date(dependentData?.dob),
                  enrolledInInsuranceFlag: dependentData?.enrolledInInsuranceFlag,
                  dependentTypeCode : dependentData?.dependentTypeCode
                }
              )

          }
          else
          {
            this.isOpenedNewFamilyMember =false;
          }
      })
   }

   onsearchTextChange(text : string)
   {
      if(text.length > 0)
      {
        if(text.length == 5 && text[4] == '/') {
          this.showDateError = true;
        }
        else {
        this.showDateError = false;
        this.dependentSearch= [];
        this.showDependentSearchInputLoader = true;
        this.searchResultSubject.next(this.dependentSearch)
        this.filterManager.next(text);
        }
      }
    }

    searchCloseEvent()
    {
      this.showDependentSearchInputLoader = false;
    }

    dropdownFilterChange(){
      this.btnDisabled = false;
    }
}
