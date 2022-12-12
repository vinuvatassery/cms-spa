/** Angular **/
import { Component,  Input, OnInit, 
  ChangeDetectorRef, ChangeDetectionStrategy,  OnChanges, SimpleChanges } from '@angular/core';
  import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; 

/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa'  

/** external Libraries **/
import { first, tap } from 'rxjs';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'case-management-case-detailed-summary',
  templateUrl: './case-details.component.html',
  styleUrls :  ['./case-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsSummaryComponent   implements OnChanges    {   

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
 

   /** Constructor**/
  constructor(private readonly router: Router,private readonly ref: ChangeDetectorRef 
   
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
   
    console.log(changes)
    if(changes['caseOwners']?.currentValue?.source != null)
    {
        // /// the startswith functionality will
        // ///  work only if the observable is
        // /// subscribed synchronously
        this.caseOwners.pipe(
      
        )
        .subscribe((Owners: any[]) => {             
          this.caseOwnersObject = [...Owners];   
      
          if(!this.isProgramVIsible)
          {  
          this.GetCaseData();   
             
          }
        
        });  
    
    }  
 } 



  ///get case details
  ///with session id
  GetCaseData()
  { 
    
    this.showInputLoader = true
      this.selectedCase?.pipe(first((caseData: { programId: any; }) => caseData.programId != null))
      .subscribe((caseData: any) => {   
          
          if(caseData.programId != null && caseData.caseStartDate != null
            && caseData.assignedCwUserId != null)
          {   this.parentForm.reset();
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
        this.showInputLoader = true 
       
  } 

}
