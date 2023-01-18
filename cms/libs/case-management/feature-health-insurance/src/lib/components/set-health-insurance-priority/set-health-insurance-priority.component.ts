/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
/** Facades **/
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { HealthInsurancePolicyFacade } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-set-health-insurance-priority',
  templateUrl: './set-health-insurance-priority.component.html',
  styleUrls: ['./set-health-insurance-priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetHealthInsurancePriorityComponent implements OnInit {
  @Input() selectedInsurance: any;
  @Input() gridList: any;
  
  /** Public properties **/
  ddlMedicalHealthPlanPriority$ =this.lovFacade.priorityCodeType$;
    public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(
    private lovFacade: LovFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlMedicalHealthPlanPriority();
    if(this.gridList.length>3){
      this.gridList.length=3;
    }
  }

  /** Private methods **/
  private loadDdlMedicalHealthPlanPriority() {
    this.lovFacade.getCaseCodeLovs();
  }
  public onChangePriority(value: any,index:any): void {
    
  
   }

  prioritySave(){
    this.insurancePolicyFacade.setHealthInsurancePolicyPriority( this.gridList).subscribe((x:any) =>{
      debugger
    },(error:any) =>{
      debugger
      //this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error)
    });
  }
}
