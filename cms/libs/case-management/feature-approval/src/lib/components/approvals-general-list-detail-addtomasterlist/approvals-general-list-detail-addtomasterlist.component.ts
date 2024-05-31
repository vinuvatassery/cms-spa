import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  DrugsFacade,
  FinancialVendorFacade,
  GeneralApprovalApproveDeny,
  InsurancePlan,
  InsurancePlanFacade,
  PendingApprovalGeneralFacade,
  PendingApprovalGeneralTypeCode,
} from '@cms/case-management/domain';
import { Observable, Subscription } from 'rxjs';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'productivity-tools-approvals-general-list-detail-addtomasterlist',
  templateUrl: './approvals-general-list-detail-addtomasterlist.component.html',
})
export class ApprovalsGeneralListDetailAddtomasterlistComponent
  implements OnInit, OnDestroy
{
  @Input() onUserProfileDetailsHovered: any;
  @Input() approvalId: any;
  @Output() openEditModal = new EventEmitter<any>();
  @Input() subTypeCode: any;
  @Input() approvalEntityId: any;
  ifApproveOrDeny: any;
  isPanelExpanded = false;
  selectedMasterDetailSubscription!: Subscription;
  isUpdating = false;
  updateProviderPanelSubject$: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  readonly approveOrDenyConst = GeneralApprovalApproveDeny;
  vendorData: any;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade,
    private readonly drugFacade: DrugsFacade,
    private readonly insurancePlanFacade: InsurancePlanFacade
  ) {}

  ngOnInit(): void {
    this.getMasterDetailData();
    this.subscribeEdits();
    this.updateProviderPanelSubject$.subscribe({
      next: (response: any) => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.getMasterDetailData();
        }
      },
    });
  }

  subscribeEdits() {
    if (
      this.subTypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.subTypeCode === PendingApprovalGeneralTypeCode.DentalProvider ||
      this.subTypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.subTypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
      this.subTypeCode === PendingApprovalGeneralTypeCode.InsuranceProvider ||
      this.subTypeCode === PendingApprovalGeneralTypeCode.InsuranceVendor ||
      this.subTypeCode === PendingApprovalGeneralTypeCode.Pharmacy
    ) {
      this.updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
    } else if (this.subTypeCode === PendingApprovalGeneralTypeCode.Drug) {
      this.updateProviderPanelSubject$ = this.drugFacade.updateProviderPanelSubject$;
    } else if (this.subTypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.updateProviderPanelSubject$ = this.insurancePlanFacade.updateProviderPanelSubject$;
    }
  }

  private getMasterDetailData() {
    if (this.approvalEntityId && this.subTypeCode) {
      if (
        this.subTypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.DentalProvider ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.InsuranceProvider ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.InsuranceVendor ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.Pharmacy
      ) {
        this.getHealthCareData();
      } else if (
        this.subTypeCode === PendingApprovalGeneralTypeCode.Drug ||
        this.subTypeCode === PendingApprovalGeneralTypeCode.InsurancePlan
      ) {
        this.getDrugData();
      }
    }
  }

  getHealthCareData() {
    this.financialVendorFacade
      .getVendorDetailData(this.approvalEntityId, true)
      .subscribe({
        next: (vendorDetail: any) => {
          this.vendorData = vendorDetail;
          this.financialVendorFacade.hideLoader();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.financialVendorFacade.hideLoader();
          this.financialVendorFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        },
      });
  }

  getDrugData() {
    this.pendingApprovalGeneralFacade
      .getMasterDetailData(this.approvalEntityId, this.subTypeCode)
      .subscribe({
        next: (data: any) => {
          this.vendorData = data;
          this.financialVendorFacade.hideLoader();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.financialVendorFacade.hideLoader();
          this.financialVendorFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        },
      });
  }

  approveOrDeny(result: any) {
    this.ifApproveOrDeny = result;
  }

  onEditListItemsDetailClicked(): void {
    const detailData = {
      subTypeCode: this.subTypeCode,
      vendorData: this.vendorData,
    };
    this.isUpdating = true;
    this.openEditModal.emit(detailData);
  }

  ngOnDestroy(): void {
    this.selectedMasterDetailSubscription?.unsubscribe();
  }
  onCloseEditListItemsDetailClicked() {}
}
