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
import { SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-set-health-insurance-priority',
  templateUrl: './set-health-insurance-priority.component.html',
  styleUrls: ['./set-health-insurance-priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetHealthInsurancePriorityComponent implements OnInit {
  @Input() selectedInsurance: any;
  @Input() gridList: any;
  @Input() insurancePriorityModalButtonText: any;
  @Output() isCloseInsuranceModal = new EventEmitter();

  /** Public properties **/
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
    if (this.gridList.length > 3) {
      this.gridList.length = 3;
    }
    this.gridList.forEach((row: any) => {
      this.form.addControl(
        row.clientInsurancePolicyId,
        new FormControl(row.priorityCode, Validators.required)
      );
    });
    this.cdr.detectChanges();

  }

  /** Private methods **/
  private loadDdlMedicalHealthPlanPriority() {
    this.lovFacade.getCaseCodeLovs();
  }
  public onChangePriority(value: any, insurance: any): void {
    if (value === PriorityCode.Primary) {
      if (insurance.canPayForMedicationFlag === "N") {
        this.notificationSnackbarService.errorSnackBar('Primary insurance always consists of insurance that pays for medications.');
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
      const primeryStartDate = new Date(primarySelections[0].startDate);
      const primeryEndDate = new Date(primarySelections[0].endDate);

      const primeryStartDate2 = new Date(primarySelections[1].startDate);
      const primeryEndDate2 = new Date(primarySelections[1].endDate);
      if (this.dateRangeOverlaps(primeryStartDate, primeryEndDate, primeryStartDate2, primeryEndDate2)) {
        this.notificationSnackbarService.errorSnackBar(errorMessage);
        this.form.controls[insurance.clientInsurancePolicyId].setValue(null);
        insurance.priorityCode = null;
        return;
      }
    }

  }
  dateRangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    if (aStart <= bStart && bStart <= aEnd) return true;
    if (aStart <= bEnd && bEnd <= aEnd) return true;
    if (bStart < aStart && aEnd < bEnd) return true;
    return false;
  }
  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }

  prioritySave() {
    this.formSubmitted = true;
    if (!this.form.valid) return;
    this.gridList.forEach((row: any) => {
      row.priorityCode = this.form.controls[row.clientInsurancePolicyId].value;
    });
    let primaryExist = false;
    let secondaryExist = false;
    const tertiaryExist = this.gridList.some((m: any) => m.priorityCode === PriorityCode.Tertiary);
    const multiplePrimarySelection = this.gridList.filter((m: any) => m.priorityCode === PriorityCode.Primary);

    if (multiplePrimarySelection.length > 0) {
      primaryExist = true;
      // if (multiplePrimarySelection.length > 1) {
      //   this.notificationSnackbarService.errorSnackBar('Multiple Primary Insurance is selected');
      //   return;
      // }
    }
    if (!primaryExist) {
      this.notificationSnackbarService.errorSnackBar('A Primary Insurance is required');
      return;
    }
    const multipleSecondarySelection = this.gridList.filter((m: any) => m.priorityCode === PriorityCode.Secondary);
    if (multipleSecondarySelection.length > 0) {
      secondaryExist = true;
      // if (multipleSecondarySelection.length > 1) {
      //   this.notificationSnackbarService.errorSnackBar('Multiple Secondary Insurance is selected');
      //   return;
      // }
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
