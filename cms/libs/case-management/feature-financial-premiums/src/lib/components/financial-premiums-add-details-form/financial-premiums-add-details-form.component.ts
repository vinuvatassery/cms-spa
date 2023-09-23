import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ClientInsurancePlans, InsurancePremiumCoverage, FinancialClaimsFacade, InsurancePremium } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { RowArgs } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cms-financial-premiums-add-details-form',
  templateUrl: './financial-premiums-add-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsAddDetailsFormComponent implements OnInit, OnDestroy {
  /* Input Properties */
  @Input() insurancePlans$!: Observable<ClientInsurancePlans[]>;
  @Input() insurancePlansLoader$: any;
  @Input() insuranceCoverageDates$: any;
  @Input() insuranceCoverageDatesLoader$: any;

  /* Output Properties */
  @Output() clientChangeEvent = new EventEmitter<any>();
  @Output() modalCloseAddPremiumsFormModal = new EventEmitter();

  /* Pubic Properties  */
  insurancePlansAction = [
    {
      buttonType: 'btn-h-primary',
      text: 'Add Premium',
      icon: 'add',
      click: (data: any): void => {
        this.addCoverage(data);
      }
    }
  ];
  insuranceCoverageAction = [
    {
      buttonType: 'btn-h-primary',
      text: 'Remove Coverage',
      icon: 'close',
      click: (policyId: string, coverage: InsurancePremiumCoverage): void => {
        this.removeCoverage(policyId, coverage);
      }
    }
  ];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  formUiStyle: UIFormStyle = new UIFormStyle();
  addPremiumGridLists$: any;
  clients$ = this.financialClaimsFacade.clients$;
  clientSubscription = new Subscription;
  clientSearchLoader$ = new BehaviorSubject(false);
  selectedClient!: any;
  counter = '0/100';
  isDetailExpanded = true;
  coverageDateList: any;
  insurancePlans!: ClientInsurancePlans[];

  showClientRequiredValidation = false;
  /* Constructor */
  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider) {
  }

  /* Life cycle events */
  ngOnInit(): void {
    this.addClientSubscription();
    this.insuranceCoverageDates$.subscribe((value: any) => {
      this.coverageDateList = value;
    })
    this.insurancePlans$.subscribe((value: ClientInsurancePlans[]) => {
      this.insurancePlans = value;
    })
  }

  ngOnDestroy(): void {
    this.clientSubscription.unsubscribe();
  }


  /* Public Methods */
  loadClients(clientSearchText: any) {
    clientSearchText = clientSearchText.replace("/", "-");
    this.clientSearchLoader$.next(true);
    this.financialClaimsFacade.loadClientBySearchText(clientSearchText);
  }

  clientChanged(client: any) {
    this.showClientRequiredValidation = !client;
    this.clientChangeEvent.emit(client?.clientId);
  }

  closeAddPremiumClicked() {
    this.modalCloseAddPremiumsFormModal.emit(true);
  }

  commentCounterChange(coverage: any, ev: string): void {
    const charactersCount = ev.length;
    coverage.commentCount = `${charactersCount}/100`;
  }

  exceptionReasonCounterChange(coverage: any, ev: string): void {
    const charactersCount = ev.length;
    coverage.exceptionReasonCount = `${charactersCount}/100`;
  }

  premiumAmountValuesChanges(coverage: InsurancePremiumCoverage, value: number) {
    coverage.premiumAmountRequired = !value;
  }

  coverageDatesValueChanges(policyId: string, coverage: InsurancePremiumCoverage, value: any) {
    coverage.coverageDateRequired = !value
    if (value) {
      this.coverageDateExistChecking(policyId, coverage);
    }
  }

  private coverageDateExistChecking(policyId: string, coverage: InsurancePremiumCoverage) {
    const plan = this.insurancePlans.find((plan: any) => plan.clientInsurancePolicyId === policyId);
    if (plan) {
      plan?.coverages?.forEach((coverage: InsurancePremiumCoverage) => {
        this.markDuplicatePremiums(plan, coverage);
      });
    }
  }

  private markDuplicatePremiums(plan: ClientInsurancePlans, coverage: InsurancePremiumCoverage) {
    const samePremiums = plan.coverages?.filter((cvg: InsurancePremiumCoverage) => cvg.coverageDates && cvg.coverageDates === coverage.coverageDates);
    if (samePremiums.length == 1) {
      samePremiums[0].coverageDatesExist = false;
    }
    else if (samePremiums.length > 1) {
      samePremiums?.map((cvg: InsurancePremiumCoverage) => {
        cvg.coverageDatesExist = cvg.coverageDates === coverage.coverageDates;
      });
    }
  }

  save() {
    const selectedPlans = this.insurancePlans.filter(i => i.isPlanSelected);
    const isValid = this.validate(selectedPlans);
    if (!isValid) {
      return;
    }

    const insurancePremiums = this.getPremiumData(selectedPlans);
    console.log(insurancePremiums);
  }

  private getPremiumData(selectedPlans: ClientInsurancePlans[]) {
    let premiums: InsurancePremium[] = [];
    selectedPlans.forEach((plan: any) => {
      const planPremiums = this.createPremium(plan);
      if (planPremiums) {
        premiums.push(...planPremiums);
      }
    });

    return premiums;
  }

  private createPremium(plan: ClientInsurancePlans) {
    let premiums: InsurancePremium[] = [];
    plan.coverages.forEach((coverage: InsurancePremiumCoverage) => {

      var firstDayOfMonth = new Date(coverage?.coverageDates ?? '')
      var lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
      const premium: InsurancePremium = {
        clientInsurancePolicyId: plan.clientInsurancePolicyId,
        //clientCaseEligibilityId
        //clientCaseEligibilityGroupId
        vendorId: plan.vendorId,
        insuranceTypeCode: plan.healthInsuranceType,
        //policyNbr
        clientFirstName: this.selectedClient.clientFirstName,
        clientLastName: this.selectedClient.clientLastName,
        coverageStartDate: this.intl.formatDate(firstDayOfMonth, this.configProvider?.appSettings?.dateFormat),
        coverageEndDate: this.intl.formatDate(lastDayOfMonth, this.configProvider?.appSettings?.dateFormat),
        premiumAmount: coverage?.premiumAmount
      };

      premiums.push(premium);
    });

    return premiums;
  }

  private validate(selectedPlans: ClientInsurancePlans[]): boolean {
    if (!this.selectedClient) {
      this.showClientRequiredValidation = true;
      return false;
    }

    selectedPlans.forEach((plan: any) => {
      this.addCoveragesValidation(plan.coverages);
    });

    const isValid = selectedPlans.findIndex((plan: ClientInsurancePlans) =>
      plan.coverages.findIndex((cvg: InsurancePremiumCoverage) =>
        cvg.coverageDateRequired
        || cvg.premiumAmountRequired
        || cvg.coverageDateRequired
        || cvg.coverageDatesExist
      ) !== -1
    ) === -1;
    return isValid;
  }

  private addCoveragesValidation(coverages: InsurancePremiumCoverage[]) {
    coverages.map((cvg: InsurancePremiumCoverage) => {
      cvg.coverageDateRequired = cvg.coverageDates == null;
      cvg.premiumAmountRequired = cvg.premiumAmount == null;
      //cvg.coverageDateRequired = cvg.coverageDates == null;
    });
  }

  expandRows({ dataItem }: RowArgs): boolean {
    return dataItem?.coverages && dataItem?.coverages?.length > 0;
  }

  removeCoverage(policyId: string, coverage: InsurancePremiumCoverage) {
    const plan = this.insurancePlans.find((plan: any) => plan.clientInsurancePolicyId === policyId);
    if (plan) {
      const coverageIndex = plan.coverages.findIndex((cvg: any) => cvg.id === coverage.id);
      if (coverageIndex !== -1) {
        plan.coverages.splice(coverageIndex, 1);
      }
    }
  }

  addCoverage(plan: ClientInsurancePlans) {
    if (!plan?.coverages) {
      plan.coverages = [];
    }

    const newCoverageId = `${plan.coverages.length + 1}`;
    const newCoverage = {
      id: newCoverageId,
      comment: '',
      commentCount: '0/100',
      exceptionReason: '',
      exceptionReasonCount: '0/100'
    };

    plan.coverages.push(newCoverage);
  }

  /* Private Methods */
  private addClientSubscription() {
    this.clientSubscription = this.clients$.subscribe((value: any) => {
      this.clientSearchLoader$.next(false);
    });
  }
}
