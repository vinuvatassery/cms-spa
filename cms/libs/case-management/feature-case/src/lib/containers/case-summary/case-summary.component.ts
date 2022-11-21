/** Angular **/
import { Component,  Input, OnInit,ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
/** Internal Libraries **/
import { CaseFacade, CaseScreenTab } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'  ;
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms'; 

@Component({
  selector: 'case-management-case-summary',
  templateUrl: './case-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseSummaryComponent implements OnInit {
 
  currentDate = new Date();
  isProgramSelectionOpened = false;
  
  selectedProgram!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() isProgramVIsible!: any;
  caseDetailSummary!: FormGroup;
  isSubmitted: boolean=false;
  

  /** Constructor**/
  constructor(
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef,
    private fb:FormBuilder
   
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.caseDetailSummary=this.fb.group({
      caseOrigin: ['', Validators.required],
      caseOwner:['',Validators.required],
      dateApplicationReceived:[this.currentDate,Validators.required]
      });
  }

   
}
