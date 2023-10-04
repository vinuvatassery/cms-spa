import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ClientInsurancePlans, InsurancePremiumCoverage, FinancialClaimsFacade, InsurancePremium, PolicyPremiumCoverage, StatusFlag } from '@cms/case-management/domain';
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
  @Input() existingPremiums$!: Observable<PolicyPremiumCoverage[]>;

  /* Output Properties */
  @Output() clientChangeEvent = new EventEmitter<any>();
  @Output() modalCloseAddPremiumsFormModal = new EventEmitter();
  @Output() premiumsExistValidationEvent = new EventEmitter<{ clientId: number, premiums: PolicyPremiumCoverage[] }>();
  @Output() savePremiumsEvent = new EventEmitter<InsurancePremium[]>();

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
  clientSearchLoader$ = new BehaviorSubject(false);
  selectedClient!: any;
  counter = '0/100';
  isDetailExpanded = true;
  coverageDateList: any;
  insurancePlans!: ClientInsurancePlans[];

  clientSubscription = new Subscription;
  insurancePlansSubscription = new Subscription;
  coverageDatesSubscription = new Subscription;
  existingPremiumSubscription = new Subscription;

  showClientRequiredValidation = false;
  showPlanSelectionRequiredValidation = false;
  showPremiumRequiredValidation = false;
  exceptionText = 'Make Exception'

  /* Private Properties  */
  private premiumExistCheckingRequired = true;

  /* Constructor */
  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider) {
  }

  /* Life cycle events */
  ngOnInit(): void {
    this.addSubscriptions();
  }

  ngOnDestroy(): void {
    this.clientSubscription.unsubscribe();
    this.insurancePlansSubscription.unsubscribe();
    this.coverageDatesSubscription.unsubscribe();
    this.existingPremiumSubscription.unsubscribe();
  }

  /* Public Methods */
  loadClients(clientSearchText: any) {
    clientSearchText = clientSearchText.replace("/", "-");
    this.clientSearchLoader$.next(true);
    this.financialClaimsFacade.loadClientBySearchText(clientSearchText);
  }

  clientChanged(client: any) {
    this.showClientRequiredValidation = !client;
    this.clientChangeEvent.emit(
      {
        clientId: client?.clientId,
        eligibilityId: client?.clientCaseEligibilityId
      });
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
    this.premiumExistCheckingRequired = true;
    coverage.coverageDateRequired = !value
    if (value) {
      this.coverageDateExistChecking(policyId, coverage);
    }
  }

  planSelectionChange(event: any) {
    if (event?.target?.checked ?? false) {
      this.showPlanSelectionRequiredValidation = false;
    }
  }

  save() {
    if (!this.selectedClient) {
      this.showClientRequiredValidation = true;
      return;
    }

    const selectedPlans = this.insurancePlans?.filter(i => i.isPlanSelected);
    const isValid = this.validate(selectedPlans);
    if (!isValid) {
      return;
    }

    const insurancePremiums = this.getPremiumData(selectedPlans);
    this.savePremiumsEvent.emit(insurancePremiums);
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
        this.coverageDateExistChecking(policyId, coverage);
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
    this.showPremiumRequiredValidation = false;
  }

  onMakeExceptionClick(coverage: InsurancePremiumCoverage) {
    coverage.makeExceptionFlag = !coverage.makeExceptionFlag
    coverage.exceptionText = coverage.makeExceptionFlag ? "Don't Make Exception" : "Make Exception";
  }

  /* Private Methods */
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

  private createPremium(plan: ClientInsurancePlans): InsurancePremium[] {
    return plan.coverages.map((coverage: InsurancePremiumCoverage) => {
      const firstDayOfMonth = coverage?.coverageDates ? new Date(coverage.coverageDates) : new Date();
      const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

      return {
        clientId: this.selectedClient.clientId,
        clientInsurancePolicyId: plan.clientInsurancePolicyId,
        clientCaseEligibilityId: this.selectedClient.clientCaseEligibilityId,
        vendorId: plan.vendorId,
        vendorAddressId: plan.vendorAddressId,
        policyNbr: plan.insuranceIdNbr,
        clientFirstName: this.selectedClient.clientFirstName,
        clientLastName: this.selectedClient.clientLastName,
        coverageStartDate: this.intl.formatDate(firstDayOfMonth, this.configProvider?.appSettings?.dateFormat),
        coverageEndDate: this.intl.formatDate(lastDayOfMonth, this.configProvider?.appSettings?.dateFormat),
        premiumAmount: coverage?.premiumAmount,
        notes: coverage?.comment,
        exceptionFlag: coverage.premiumExistException ? StatusFlag.Yes : StatusFlag.No,
        exceptionType: 'PREMIUM_EXIST',
        exceptionReason: coverage.exceptionReason,
      };
    });
  }

  private getCoverageDates(selectedPlans: ClientInsurancePlans[]) {
    let policyPremiumCoverages: PolicyPremiumCoverage[] = [];
    selectedPlans?.forEach((plan: any) => {
      plan?.coverages?.forEach((coverage: InsurancePremiumCoverage) => {
        const firstDayOfMonth = new Date(coverage?.coverageDates ?? '')
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

        const policyCoverages = {
          clientInsurancePolicyId: plan?.clientInsurancePolicyId,
          coverageStartDate: this.intl.formatDate(firstDayOfMonth, this.configProvider?.appSettings?.dateFormat),
          coverageEndDate: this.intl.formatDate(lastDayOfMonth, this.configProvider?.appSettings?.dateFormat)
        };

        policyPremiumCoverages.push(policyCoverages);
      });
    });
    return policyPremiumCoverages;
  }

  private validate(selectedPlans: ClientInsurancePlans[]): boolean {
    if (selectedPlans?.length <= 0) {
      this.showPlanSelectionRequiredValidation = true;
      return false;
    }

    const isAnyPremiumAdded = selectedPlans?.findIndex((plan: ClientInsurancePlans) => plan?.coverages?.length > 0) !== -1;
    if (!isAnyPremiumAdded) {
      this.showPremiumRequiredValidation = true;
      return false;
    }

    selectedPlans.forEach((plan: any) => {
      this.addCoveragesValidation(plan?.coverages);
    });

    const isValid = selectedPlans?.findIndex((plan: ClientInsurancePlans) =>
      plan?.coverages?.findIndex((cvg: InsurancePremiumCoverage) =>
        cvg?.coverageDateRequired
        || cvg?.premiumAmountRequired
        || cvg?.coverageDateRequired
        || cvg?.coverageDatesExist
        || ((cvg?.premiumExistException ?? false) && (cvg.exceptionReasonRequired ?? false))
      ) !== -1
    ) === -1;

    if (this.premiumExistCheckingRequired && isValid) {
      const policyPremiumCoverages = this.getCoverageDates(selectedPlans);
      this.premiumsExistValidationEvent.emit({ clientId: this.selectedClient.clientId, premiums: policyPremiumCoverages });
      return false;
    }

    return isValid;
  }

  private addCoveragesValidation(coverages: InsurancePremiumCoverage[]) {
    coverages?.map((cvg: InsurancePremiumCoverage) => {
      cvg.coverageDateRequired = cvg?.coverageDates == null;
      cvg.premiumAmountRequired = cvg?.premiumAmount == null;
      cvg.exceptionReasonRequired = (cvg?.makeExceptionFlag ?? false) && cvg?.exceptionReason == null;
    });
  }

  private addSubscriptions() {
    this.addClientSubscription();
    this.addInsurancePlansSubscription();
    this.addCoverageDateSubscription();
    this.addPremiumExistSubscription();
  }

  private addInsurancePlansSubscription() {
    this.insurancePlansSubscription = this.insuranceCoverageDates$.subscribe((value: any) => {
      this.coverageDateList = value;
    });
  }

  private addCoverageDateSubscription() {
    this.coverageDatesSubscription = this.insurancePlans$.subscribe((value: ClientInsurancePlans[]) => {
      this.insurancePlans = value;
    });
  }


  private addClientSubscription() {
    this.clientSubscription = this.clients$.subscribe((value: any) => {
      this.clientSearchLoader$.next(false);
    });
  }

  private addPremiumExistSubscription() {
    this.existingPremiumSubscription = this.existingPremiums$.subscribe((coveragesExist: PolicyPremiumCoverage[]) => {
      this.addExceptions(coveragesExist);
    });
  }

  private addExceptions(coveragesExist: PolicyPremiumCoverage[]) {
    this.premiumExistCheckingRequired = false;
    if (coveragesExist.length > 0) {
      this.insurancePlans?.forEach((plan: ClientInsurancePlans) => {
        const planCoverageExist = coveragesExist?.filter((cvg: PolicyPremiumCoverage) =>
          cvg.clientInsurancePolicyId === plan.clientInsurancePolicyId
        );

        if (planCoverageExist) {
          planCoverageExist?.forEach((cvg: PolicyPremiumCoverage) => {
            const planCoverage = plan?.coverages?.find((planCvg: InsurancePremiumCoverage) => planCvg.coverageDates === cvg.coverageStartDate);
            if (planCoverage) {
              planCoverage.premiumExistException = true;
              planCoverage.exceptionText = 'Make Exception'
            }
          })
        }
      })
    }
    else {
      this.save();
    }
  }
}
