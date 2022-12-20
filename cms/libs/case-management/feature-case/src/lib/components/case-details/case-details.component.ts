/** Angular **/
import { Component,  Input, OnInit, 
  ChangeDetectorRef, ChangeDetectionStrategy,  OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
  import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; 

/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa'  

/** external Libraries **/
import { first, Subscription, tap } from 'rxjs';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import { ProgramCode } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-case-detailed-summary',
  templateUrl: './case-details.component.html',
  styleUrls :  ['./case-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsSummaryComponent   implements OnChanges , OnDestroy , OnInit  {   

  /// filter autocomplete with startswith
  public showInputLoader = false;
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  isProgramSelectionOpened = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  date =new Date();
  caseOwnersObject! : any

  @Input() isProgramVIsible!: any;
  @Input() parentForm!: FormGroup;
  @Input() isSubmitted: any;  
  @Input() caseSearchResults$! : any
  @Input() caseOwners ! : any
  @Input() ddlPrograms! : any
  @Input() ddlCaseOrigins! : any
  @Input() selectedProgram! : any
  @Input() selectedCase! : any 
 
  private caseDataDataSubscription !: Subscription;
today =new Date();

   /** Constructor**/
  constructor(private readonly router: Router,private readonly ref: ChangeDetectorRef    
   
  ) {}

  ngOnChanges(changes: SimpleChanges): void {   
    
    if(changes['caseOwners']?.currentValue?.source != null)
    {       
        this.caseOwners.pipe()
        .subscribe((Owners: any[]) => {             
          this.caseOwnersObject = [...Owners];         
          if(!this.isProgramVIsible)
          {  
          this.GetCaseData();               
          }        
        });  
    
    }  
 } 


 ngOnInit(): void {    
  this.setDefaultProgram();  
 }

  setDefaultProgram() {   
  this.ddlPrograms.subscribe({
    next: (programs: any) => {     
      this.parentForm.patchValue(
        {
          programId:  programs.filter(
            (data: any) => data.programCode == ProgramCode.DefaultProgram
          )[0].programId      
        }) 
    }
  });  
}


  ///get case details
  ///with session id
  GetCaseData()
  {    
    this.caseDataDataSubscription = this.selectedCase?.pipe(first((caseData: { programId: any; }) => caseData.programId != null))
      .subscribe((caseData: any) => {   
        this.parentForm.reset()
          if(caseData.programId != null && caseData.caseStartDate != null
            && caseData.assignedCwUserId != null)
          {            
            this.parentForm.setValue(
              {
                applicationDate : new Date(caseData.caseStartDate),
                caseOriginCode : caseData?.caseOriginCode ,
                caseOwnerId   : caseData?.assignedCwUserId,
                programId : caseData?.programId,
                concurrencyStamp : caseData?.concurrencyStamp
              }
            )
       
          }
        }        
        )   
  } 


  ngOnDestroy(): void 
  {
    if(!this.isProgramVIsible)
    { 
    this.caseDataDataSubscription.unsubscribe();
    }
  }
}
