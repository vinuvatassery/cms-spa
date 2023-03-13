/** Angular **/
import { Component, OnInit, Output, ChangeDetectionStrategy, Input, ChangeDetectorRef, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
/** Facades **/
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { HealthInsurancePolicyFacade, PriorityCode } from '@cms/case-management/domain';
import { SnackBarNotificationType, NotificationSnackbarService, NotificationSource } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-set-health-insurance-priority',
  templateUrl: './set-health-insurance-priority.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetHealthInsurancePriorityComponent implements OnInit {
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() selectedInsurance: any;
  @Input() insurancePriorityModalButtonText: any;
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() priorityAdded = new EventEmitter();

  /** Public properties **/
  gridList: any;
  ddlMedicalHealthPlanPriority$ = this.lovFacade.priorityCodeType$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  form: FormGroup;
  formSubmitted!: boolean;
  /** Constructor **/
  constructor(
    private readonly lovFacade: LovFacade,
    private readonly insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly cdr: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder

  ) {
    this.form = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlMedicalHealthPlanPriority();
    this.insurancePolicyFacade.showLoader();
    this.insurancePolicyFacade.getHealthInsurancePolicyPriorities(this.clientId, this.caseEligibilityId).subscribe((data: any) => {
      this.gridList = data;
      this.gridList.forEach((row: any) => {
        this.form.addControl(
          row.clientInsurancePolicyId,
          new FormControl(row.priorityCode, Validators.required)
        );
      });
      this.insurancePolicyFacade.hideLoader();
      this.cdr.detectChanges();
    }, (error: any) => {
      this.insurancePolicyFacade.hideLoader();
      this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
    });


  }

  /** Private methods **/
  private loadDdlMedicalHealthPlanPriority() {
    this.lovFacade.getCaseCodeLovs();
  }
  public onChangePriority(value: any, insurance: any): void {
    if (value === PriorityCode.Primary) {
      if (insurance.canPayForMedicationFlag === "N") {
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING,'Primary insurance always consists of insurance that pays for medications.', NotificationSource.UI)
        this.form.controls[insurance.clientInsurancePolicyId].setValue(null);
        return;
      }
      if (insurance.dentalPlanFlag === "Y") {
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING,'A dental plan cannot be the set Primary Insurance even if the only plan is dental.', NotificationSource.UI)
        this.form.controls[insurance.clientInsurancePolicyId].setValue(null);
        return;
      }
      this.insuranceDateOverlapCheck(insurance, value, 'There cannot be two Primary Insurance Policies with overlapping date ranges.');

    }
    else if (value === PriorityCode.Secondary) {
      this.insuranceDateOverlapCheck(insurance, value, 'There cannot be two Secondary Insurance Policies with overlapping date ranges.');
    }

  }
  insuranceDateOverlapCheck(insurance: any, priorityCode: string, errorMessage: string) {
    this.gridList.forEach((row: any) => {
      row.priorityCode = this.form.controls[row.clientInsurancePolicyId].value;
    });
    const primarySelections = this.gridList.filter((m: any) => m.priorityCode === priorityCode);
    if (primarySelections.length === 2) {
      if (this.dateRangeOverlaps(primarySelections[0].startDate, primarySelections[0].endDate, primarySelections[1].startDate, primarySelections[1].endDate)) {
        const previousControl = primarySelections.find((m: any) => m.clientInsurancePolicyId !== insurance.clientInsurancePolicyId);
        this.form.controls[previousControl.clientInsurancePolicyId].setValue(null);
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING,errorMessage, NotificationSource.UI)
        return true;
      }
    }
    return false;
  }

  dateRangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    if (aEnd === null && bEnd === null && aStart === bStart) return true;
    if (aEnd === null && aStart >= bStart && aStart <= bEnd) return true;
    if (bEnd === null && bStart >= aStart && bStart <= aEnd) return true;
    if (aStart <= bStart && bStart <= aEnd) return true;
    if (aStart <= bEnd && bEnd <= aEnd) return true;
    if (bStart < aStart && aEnd < bEnd) return true;
    return false;
  }

  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }

  prioritySave() {
    this.gridList.forEach((row: any) => {
      row.priorityCode = this.form.controls[row.clientInsurancePolicyId].value;
    });
    if (this.gridList.length<=3 && !this.form.valid) {
      this.formSubmitted = true;
      return;
    }
    let primaryExist = false;
    let secondaryExist = false;
    const tertiaryExist = this.gridList.some((m: any) => m.priorityCode === PriorityCode.Tertiary);
    const multiplePrimarySelection = this.gridList.filter((m: any) => m.priorityCode === PriorityCode.Primary);

    if (multiplePrimarySelection.length > 0) {
      primaryExist = true;
    }
    if (!primaryExist) {
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING,'A Primary Insurance is required', NotificationSource.UI)
      return;
    }
    const multipleSecondarySelection = this.gridList.filter((m: any) => m.priorityCode === PriorityCode.Secondary);
    if (multipleSecondarySelection.length > 0) {
      secondaryExist = true;
    }
    if (tertiaryExist && !secondaryExist) {
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING,'A Tertiary Insurance cannot be created if there is no Secondary Insurance', NotificationSource.UI)
      return;
    }
    if (secondaryExist && !primaryExist) {
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING,'A Secondary Insurance ​can be created when there is no Primary Insurance', NotificationSource.UI)
      return;
    }
    this.insurancePolicyFacade.showLoader();
    this.insurancePolicyFacade.setHealthInsurancePolicyPriority(this.gridList)
      .subscribe({
        next: (x: any) => {
          this.insurancePolicyFacade.hideLoader();
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Insurance priorities updated successfully')
          this.onModalCloseClicked();
          this.priorityAdded.emit();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.hideLoader();
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      });
  }
}
