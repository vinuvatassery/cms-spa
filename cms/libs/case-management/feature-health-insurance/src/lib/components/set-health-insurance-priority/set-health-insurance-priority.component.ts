/** Angular **/
import { Component, OnInit,Output, ChangeDetectionStrategy, Input,ChangeDetectorRef,EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
/** Facades **/
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { HealthInsurancePolicyFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType,NotificationSnackbarService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-set-health-insurance-priority',
  templateUrl: './set-health-insurance-priority.component.html',
  styleUrls: ['./set-health-insurance-priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetHealthInsurancePriorityComponent implements OnInit {
  @Input() selectedInsurance: any;
  @Input() gridList: any;
  @Output() isCloseInsuranceModal = new EventEmitter();

  /** Public properties **/
  ddlMedicalHealthPlanPriority$ = this.lovFacade.priorityCodeType$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  form: FormGroup;
  formSubmitted!: boolean;
  /** Constructor **/
  constructor(
    private lovFacade: LovFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private notificationSnackbarService: NotificationSnackbarService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
    
  ) {
    this.form = this.formBuilder.group({ });
   }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlMedicalHealthPlanPriority();
    if (this.gridList.length > 3) {
      this.gridList.length = 3;

      this.gridList.forEach((row:any) => {
        this.form.addControl(
          row.clientInsurancePolicyId,
          new FormControl(row.priorityCode,[Validators.required])
        );
      });
      this.cdr.detectChanges();
    }
  }

  /** Private methods **/
  private loadDdlMedicalHealthPlanPriority() {
    this.lovFacade.getCaseCodeLovs();
  }
  public onChangePriority(value: any, index: any): void {


  }
  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }

  prioritySave() {
    this.formSubmitted=true;
    if(!this.form.valid) return;
    this.gridList.forEach((row:any) => {
      row.priorityCode=this.form.controls[row.clientInsurancePolicyId].value;
    });
    let primaryExist = false;
    let secondaryExist = false;
    const tertiaryExist = this.gridList.some((m: any) => m.priorityCode === 'T');
    const multiplePrimarySelection = this.gridList.filter((m: any) => m.priorityCode === 'P');
    
    if(multiplePrimarySelection.length>0){
      primaryExist=true;
      if(multiplePrimarySelection.length>1){
        this.notificationSnackbarService.errorSnackBar('Multiple Primary Insurance is selected');
        return;
      }
    }
    if (!primaryExist) {
      this.notificationSnackbarService.errorSnackBar('A Primary Insurance is required');
      return;
    }
    const multipleSecondarySelection = this.gridList.filter((m: any) => m.priorityCode === 'S');
    if(multipleSecondarySelection.length>0){
      secondaryExist=true;
      if(multipleSecondarySelection.length>1){
        this.notificationSnackbarService.errorSnackBar('Multiple Secondary Insurance is selected');
        return;
      }
    }
    if (tertiaryExist && !secondaryExist) {
      this.notificationSnackbarService.errorSnackBar('A Tertiary Insurance cannot be created if there is no Secondary Insurance');
      return;
    }
    if (secondaryExist && !primaryExist) {
      this.notificationSnackbarService.errorSnackBar('A Secondary Insurance ​can be created when there is no Primary Insurance');
      return;
    }
    this.insurancePolicyFacade.showLoader();
    this.insurancePolicyFacade.setHealthInsurancePolicyPriority(this.gridList).subscribe((x: any) => {

      this.insurancePolicyFacade.hideLoader();
      this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Insurance priorities updated successfully')
      this.onModalCloseClicked();
    }, (error: any) => {
      this.insurancePolicyFacade.hideLoader();
      this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
    });
  }
}
