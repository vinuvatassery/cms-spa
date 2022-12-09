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
import { debounceTime, distinctUntilChanged, first, Subject } from 'rxjs';
import { debug } from 'console';
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
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() closeFamilyMemberFormEvent = new EventEmitter<any>();
  @Output() getNewFamilyMemberFormEvent = new EventEmitter<any>();
  @Output() formDeleteclickEvent = new EventEmitter<any>();
  @Output() searchTextEvent = new EventEmitter<string>(); 
  @Output() addExistingClientEvent = new EventEmitter<any>(); 

  filterManager: Subject<string> = new Subject<string>();
  currentDate = new Date();
  /** Public properties **/
  familyMemberForm!: FormGroup;
  existFamilyMemberForm!: FormGroup;
  isOpenedNewFamilyMember = false;
  showDependentSearchInputLoader = false;
  dependentSearch!: GroupResult[];
  popupClass = 'k-autocomplete-custom';
  isSubmitted = false;
  isExistSubmitted = false;
  isExistDependent =false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isAddFamilyMember =true;
  clientDependentId! : string
  dependentTypeCode! : string
  fullClientName! : string

  /** Constructor **/
  constructor(  
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
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
        this.showDependentSearchInputLoader = false;
        }
      }
      ); 

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.composeFamilyMemberForm();
    this.loadFamilyDependents();   
    this.loadNewFamilyMemberData();  
    this.composeExistFamilyMemberForm()
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
      ssn: ['',Validators.pattern(new RegExp(/^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/))],
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
      }
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
      clientDependentId : this.clientDependentId ,
      dependentTypeCode : this.dependentTypeCode
    }
    this.formDeleteclickEvent.next(deleteParams);
  }

  private composeExistFamilyMemberForm()
  {
        this.existFamilyMemberForm = this.formBuilder.group({    
          existRelationshipCode: ['', Validators.required],
          clientId: [0],           
          dependentClientId: [0]  ,
          clientDependentId: ['']  ,              
          dependentType   : ['', Validators.required]  
      });
      this.onExitFamilyFormLoad()
  }

  onSearchTemplateClick(dataItem : any)
  {    
   this.existFamilyMemberForm.patchValue(
     {
       clientId: dataItem?.clientId  ,    
       dependentType : dataItem?.clientId > 0 ? DependentTypeCode.CAClient : DependentTypeCode.Dependent,
       clientDependentId :  dataItem?.clientDependentId 
     })    
 
  }
  onExitFamilyFormLoad()
  {
   this.dependentGetExisting$?.pipe(first((existDependentData: any ) => existDependentData?.clientDependentId != null))
   .subscribe((existDependentData: any) =>
   {  
       if(existDependentData?.dependentClientId)
       {
         this.isAddFamilyMember =false;
           this.existFamilyMemberForm.setValue(
             {     
               clientId:  existDependentData?.clientId,  
               dependentClientId:  existDependentData?.dependentClientId,     
               relationshipCode: existDependentData?.relationshipCode, 
               clientDependentId: existDependentData?.clientDependentId,
               dependentType: existDependentData?.dependentTypeCode
             }
           )
           const fullName = existDependentData?.firstName + ' ' + existDependentData?.lastName
           this.fullClientName = fullName + ' DOB '+existDependentData?.dob.toString()+' SSN '+existDependentData?.ssn  

           this.clientDependentId = existDependentData?.clientDependentId;
           this.dependentTypeCode = existDependentData?.dependentTypeCode;
       }
   })
  }

  onExistDependentSubmit()
  {
    this.isExistSubmitted =true;
    const existDepData =
    {
      clientId : this.existFamilyMemberForm?.controls["clientId"].value,
      dependentClientId  : this.existFamilyMemberForm?.controls["dependentClientId"].value ,
      dependentType :this.existFamilyMemberForm?.controls["dependentType"].value ,
      relationshipCode : this.existFamilyMemberForm?.controls["existRelationshipCode"].value ,
      clientDependentId : this.existFamilyMemberForm?.controls["clientDependentId"].value 
    }
    this.addExistingClientEvent.emit(existDepData)
  }


  onDependentSubmit()
  {
    this.isSubmitted = true;    
    
   if(this.familyMemberForm.valid)
   {
      const dependent  = {
        concurrencyStamp: this.familyMemberForm?.controls["concurrencyStamp"].value,
        clientDependentId: this.familyMemberForm?.controls["clientDependentId"].value,
        clientId:  this.familyMemberForm?.controls["clientId"].value,     
        relationshipCode: this.familyMemberForm?.controls["relationshipCode"].value,       
        firstName:  this.familyMemberForm?.controls["firstName"].value,
        lastName:  this.familyMemberForm?.controls["lastName"].value,       
        ssn:  this.familyMemberForm?.controls["ssn"].value,
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
      this.dependentGet$?.pipe(first((dependentData: any ) => dependentData?.clientDependentId != null))
      .subscribe((dependentData: any) =>
      {  
        
          if(dependentData?.clientDependentId)
          { 
            
            this.isOpenedNewFamilyMember =true;
            this.isAddFamilyMember =false;
              this.familyMemberForm.setValue(
                {
                  concurrencyStamp: dependentData?.concurrencyStamp,
                  clientDependentId: dependentData?.clientDependentId,
                  clientId:  dependentData?.clientId,     
                  relationshipCode: dependentData?.relationshipCode,       
                  firstName:  dependentData?.firstName,
                  lastName:  dependentData?.lastName,       
                  ssn:  dependentData?.ssn,
                  dob: dependentData?.dob,       
                  enrolledInInsuranceFlag: dependentData?.enrolledInInsuranceFlag,
                  dependentTypeCode : dependentData?.dependentTypeCode
                }
              )
              
              this.clientDependentId = dependentData?.clientDependentId;
              this.dependentTypeCode = dependentData?.dependentTypeCode;
          }
          else
          {
            this.isOpenedNewFamilyMember =false;
          }
      })
   }




   onsearchTextChange(text : string)      
   {    
    if(text.length > 3)
    {
      this.showDependentSearchInputLoader = true;
    this.filterManager.next(text); 


    }
   } 
   

}
