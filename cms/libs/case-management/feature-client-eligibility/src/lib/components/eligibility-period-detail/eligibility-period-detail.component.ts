/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** Facades **/
import { ClientEligibilityFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-eligibility-period-detail',
  templateUrl: './eligibility-period-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EligibilityPeriodDetailComponent implements OnInit {
  public formUiStyle : UIFormStyle = new UIFormStyle();
 currentDate = new Date();
  /** Public properties **/
  ddlGroups$ = this.clientEligibilityFacade.ddlGroups$;
  ddlStatus$ = this.lovFacade.eligibilityStatus$;
  showEligibilityStatusLoader = this.lovFacade.showLoaderOnEligibilityStatus$;
  disableFields: Array<string>=[];
  eligibilityPeriodForm!:FormGroup;
  

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade, 
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlStatus();
    this.buildEligibilityPeriodForm();
  }

  /** Public methods **/
  onEligibilityStatusChanged(){
    this.requiredAndEnableFieldsByStatus( this.eligibilityPeriodForm.controls['eligibilityStatus'].value);
    this.enableAllFields();
    this.disableFormFields();

  }
  /** Private methods **/
  private loadDdlStatus() {
    //this.clientEligibilityFacade.loadDdlStatus();
    this.lovFacade.getEligibilityStatusLovs();
  }
  private requiredAndEnableFieldsByStatus(status:string)
  {   
    switch(status.toUpperCase())
    {      
      case 'ACCEPT':
        this.disableFields = [];  
        break;
      case 'INCOMPLETE':
        this.disableFields = [
          'eligibilityStatus',
          'group'
        ];  
        break;

    }
  }
private disableFormFields(){
  this.disableFields.forEach((key: string) => {
    this.eligibilityPeriodForm.controls[key].disable();
  });
}
private enableAllFields(){
  if (this.eligibilityPeriodForm.controls !== null && Object.keys(this.eligibilityPeriodForm.controls).length > 0) {
    Object.keys(this.eligibilityPeriodForm.controls).forEach((key: string) => {    
        this.eligibilityPeriodForm.controls[key].enable();      
    });

  }
}
  private buildEligibilityPeriodForm() {
    this.eligibilityPeriodForm = this.formBuilder.group({
      eligibilityStatus: [''],
      statusStartDate: [''],
      statusEndDate: [''],
      group: ['']      
    });

  }
  
}
