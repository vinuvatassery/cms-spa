import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumsFacade, InsurancePremiumDetails, PremiumAdjustment } from '@cms/case-management/domain';
import { Observable, Subscription } from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
@Component({
  selector: 'cms-financial-premiums-edit-detail-form',
  templateUrl: './financial-premiums-edit-detail-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsEditDetailFormComponent implements OnInit, OnDestroy {

  /* Input Properties */
  @Input() premiumId!: string;
  @Input() insurancePremium$!: Observable<InsurancePremiumDetails>;
  @Input() insuranceCoverageDates$: any;

  /* Output Properties */
  @Output() loadPremiumEvent = new EventEmitter<string>();
  @Output() modalCloseEditPremiumsFormModal = new EventEmitter();
  @Output() updatePremiumEvent = new EventEmitter<any>();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input() premiumsType: any;
  isShownSearchLoader = false;
  premiumsListData$ = this.financialPremiumsFacade.premiumsListData$;
  sortValue = this.financialPremiumsFacade.sortValuePremiums;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortPremiumsList;
  state!: State;
  premium!: InsurancePremiumDetails;
  coverageDateList: any;
  premiumSubscription = new Subscription;
  coverageDatesSubscription = new Subscription;

  /* Constructor */
  constructor(private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider
  ) { }

  /* Lifecycle Events */
  ngOnInit(): void {
    this.loadPremiums();
    this.addPremiumSubscription();
    this.addInsurancePlansSubscription();
  }

  ngOnDestroy(): void {
    this.premiumSubscription.unsubscribe();
    this.coverageDatesSubscription.unsubscribe();
  }

  /* Public Methods */
  loadPremiums() {
    this.loadPremiumEvent.emit(this.premiumId);
  }

  closeAddEditPremiumsFormModalClicked() {
    this.modalCloseEditPremiumsFormModal.emit(true);
  }

  loadPremiumsListGrid() {
    this.financialPremiumsFacade.loadPremiumsListGrid();
  }

  addAdjustment() {
    const adjustment: PremiumAdjustment = {
      isPositiveAdjustment: true,
      adjustmentAmountRequired: false,
      coverageDatesRequired: false,
      duplicateCoverage: false
    };

    this.premium?.premiumAdjustments?.push(adjustment);
  }

  deleteAdjustment(index: number) {
    this.premium?.premiumAdjustments.splice(index, 1);
  }

  changeAdjustmentSign(isPositiveAdjustment: boolean, adjustment: PremiumAdjustment) {
    adjustment.isPositiveAdjustment = isPositiveAdjustment;
    if (adjustment?.adjustmentAmount && adjustment?.adjustmentAmount !== 0) {
      adjustment.adjustmentAmount = adjustment.isPositiveAdjustment ? Math.abs(adjustment?.adjustmentAmount) : -Math.abs(adjustment?.adjustmentAmount);
    }
  }

  premiumAmountChanged() {
    this.premium.premiumAmountRequired = !this.premium.premiumAmount;
  }

  adjustmentAmountChanged(adjustment: PremiumAdjustment) {
    adjustment.adjustmentAmountRequired = !adjustment.adjustmentAmount || adjustment.adjustmentAmount === 0;
    if (adjustment.adjustmentAmount) {
      adjustment.adjustmentAmount = adjustment.isPositiveAdjustment ? Math.abs(adjustment?.adjustmentAmount) : -Math.abs(adjustment?.adjustmentAmount);
    }
  }

  adjustmentDateChanged(adjustment: PremiumAdjustment) {
    adjustment.coverageDatesRequired = !adjustment.coverageStartDate;
    this.duplicateCoverageCheck();
  }

  duplicateCoverageCheck() {
    this.premium?.premiumAdjustments?.forEach((parent: PremiumAdjustment) => {
      const coveragesExists = this.premium?.premiumAdjustments?.filter((child: PremiumAdjustment) => child.coverageStartDate && child.coverageStartDate === parent.coverageStartDate);
      if (coveragesExists.length > 0) {
        if (coveragesExists?.length > 1) {
          coveragesExists?.forEach((i: PremiumAdjustment) => {
            i.duplicateCoverage = true;
          });
        }
        else {
          coveragesExists[0].duplicateCoverage = false;
        }
      }
    });
  }


  save() {
    const isValid = this.validate();
    if (isValid) {
      const premiumAndAdjustments = this.getPremiumAndAdjustments();
      if(premiumAndAdjustments){
        this.updatePremiumEvent.emit(premiumAndAdjustments);
      }
    }
  }

  /* Private Methods */
  private getPremiumAndAdjustments() {
    return {
      premiumId:this.premiumId,
      isSpotsPayment: this.premium.isSpotsPayment,
      premiumAmount: this.premium.premiumAmount,
      PremiumAdjustments: this.getAdjustments()
    };
  }

  private getAdjustments() {
    return this.premium?.premiumAdjustments?.map((adj: PremiumAdjustment) => {
      const firstDayOfMonth = adj?.coverageStartDate ? new Date(adj.coverageStartDate) : new Date();
      const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
      return {
        adjustmentAmount: adj.adjustmentAmount,
        coverageStartDate: this.intl.formatDate(firstDayOfMonth, this.configProvider?.appSettings?.dateFormat),
        coverageEndDate: this.intl.formatDate(lastDayOfMonth, this.configProvider?.appSettings?.dateFormat)
      }
    });
  }

  private validate() {
    if (!this.premium?.premiumAmount || this.premium?.premiumAmount <= 0) {
      this.premium.premiumAmountRequired = true;
    }
    this.addAdjustmentRequiredValidation();

    const isValid = !this.premium?.premiumAmountRequired
      && this.premium?.premiumAdjustments?.findIndex((adj: PremiumAdjustment) =>
        adj.adjustmentAmountRequired || adj.coverageDatesRequired || adj.duplicateCoverage) === -1

    return isValid;
  }

  private addAdjustmentRequiredValidation() {
    this.premium?.premiumAdjustments?.forEach((adjustment: PremiumAdjustment) => {
      adjustment.adjustmentAmountRequired = !adjustment?.adjustmentAmount;
      adjustment.coverageDatesRequired = !adjustment?.coverageStartDate;
    });
  }

  private addPremiumSubscription() {
    this.premiumSubscription = this.insurancePremium$.subscribe((premium: any) => {
      this.premium = premium;
      if(this.premium){
        this.premium.premiumAdjustments.forEach((adj: PremiumAdjustment) => adj.isPositiveAdjustment = (adj?.adjustmentAmount ?? 0) >= 0)
      }
    })
  }

  private addInsurancePlansSubscription() {
    this.coverageDatesSubscription = this.insuranceCoverageDates$.subscribe((value: any) => {
      this.coverageDateList = value;
    });
  }
}
