import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ClientInsurancePlans, InsurancePremiumCoverage, FinancialClaimsFacade, InsurancePremium, PolicyPremiumCoverage, ObjectCode, PremiumCoverageDates } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { RowArgs } from '@progress/kendo-angular-grid';
import { DatePipe, IntlService } from '@progress/kendo-angular-intl';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cms-financial-premiums-add-details-form',
  templateUrl: './financial-premiums-add-details-form.component.html',
  styleUrls: ['./financial-premiums-add-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class FinancialPremiumsAddDetailsFormComponent implements OnInit, OnDestroy {
  @ViewChild('pcaExceptionDialogTemplate', { read: TemplateRef })
  pcaExceptionDialogTemplate!: TemplateRef<any>;

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
  exceptionText = 'Make Exception';
  pcaExceptionDialogService: any;
  chosenPcaForReAssignment: any;

  /* Private Properties  */
  private premiumExistCheckingRequired = true;
  private hasException = false;

  /* Constructor */
  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private dialogService: DialogService,
    private datePipe: DatePipe) {
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
    coverage.exceptionReasonRequired = charactersCount <= 0;
    coverage.exceptionReasonCount = `${charactersCount}/150`;
  }

  premiumAmountValuesChanges(coverage: InsurancePremiumCoverage, value: number) {
    coverage.premiumAmountRequired = !value;
  }

  coverageDatesValueChanges(policyId: string, coverage: InsurancePremiumCoverage, value: any) {
    this.premiumExistCheckingRequired = true;
    coverage.coverageDateRequired = !value;
    coverage.premiumExistException = false;
    if (value) {
      this.coverageDateExistChecking(policyId, coverage);
    }
  }

  planSelectionChange(event: any, plan: ClientInsurancePlans) {
    if (event?.target?.checked ?? false) {
      this.showPlanSelectionRequiredValidation = false;
      if (!plan?.coverages || plan?.coverages?.length <= 0) {
        this.addCoverage(plan);
      }
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

    if (this.hasException) {
      this.savePremiums(selectedPlans);
      return;
    }

    this.checkValidPcaAndSave(selectedPlans);
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

      this.makeAutoPlanSelection(plan);
    }
  }

  addCoverage(plan: ClientInsurancePlans) {
    if (!plan?.coverages) {
      plan.coverages = [];
    }

    const newCoverageId = `${plan.coverages.length + 1}`;
    const newCoverage: InsurancePremiumCoverage = {
      id: newCoverageId,
      comment: '',
      commentCount: '0/100',
      exceptionReason: '',
      exceptionReasonCount: '0/150',
      premiumAmount: plan?.premiumAmt ?? 0,
      premiumCoverageDateList: this.getPremiumCoverageDates(plan.startDate, plan.endDate, plan.eligibilityEndDate)
    };

    plan.coverages.push(newCoverage);
    this.showPremiumRequiredValidation = false;
    this.makeAutoPlanSelection(plan);
  }

  private getPremiumCoverageDates(startDate: Date, endDate: Date, eligibilityEndDate: Date) {
    let coverageDate: PremiumCoverageDates[] = [];
    let firstDayOfMonth = new Date(startDate);
    endDate =  new Date(endDate ? endDate : eligibilityEndDate);
    do {
      const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
      coverageDate.push({ coverageStartDate: this.datePipe.transform(firstDayOfMonth, 'yyyy-MM-ddTHH:mm:ss'), coverageDate: `${this.datePipe.transform(firstDayOfMonth, 'MM/dd/yyyy')} - ${this.datePipe.transform(lastDayOfMonth, 'MM/dd/yyyy')}` })
      firstDayOfMonth = new Date(lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1));
    } while (firstDayOfMonth < endDate);

    return coverageDate;
  }

  onMakeExceptionClick(coverage: InsurancePremiumCoverage) {
    coverage.makeExceptionFlag = !coverage.makeExceptionFlag
    coverage.exceptionText = coverage.makeExceptionFlag ? "Don't Make Exception" : "Make Exception";
    if (!coverage.makeExceptionFlag) { coverage.exceptionReasonRequired = false; }
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

  private checkValidPcaAndSave(selectedPlans: ClientInsurancePlans[]) {
    let request: any[] = [];
    selectedPlans.forEach((plan: any) => {
      const planPremiums = this.createPcaPayload(plan);
      if (planPremiums) {
        request.push(...planPremiums);
      }
    });

    this.loaderService.show();
    const payload = {
      serviceList: request
    }
    this.financialClaimsFacade.getPcaCode(payload)
      .subscribe({
        next: (response: any) => {
          this.loaderService.hide();
          if (response) {
            const reAssignPca = response?.filter((i: any) => i.isReAssignmentNeeded ?? false);

            if (reAssignPca.length > 0) {
              this.chosenPcaForReAssignment = { pcaCode: [...new Set(reAssignPca.map((p: any) => p.pcaCode))].join(", ") };
              this.onPcaReportAlertClicked(this.pcaExceptionDialogTemplate);
              return;
            }

            this.savePremiums(selectedPlans);
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
        },
      });
  }

  onPcaReportAlertClicked(template: TemplateRef<unknown>): void {
    this.pcaExceptionDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onPcaAlertCloseClicked(result: any) {
    if (result) {
      this.pcaExceptionDialogService.close();
    }
  }

  onConfirmPcaAlertClicked(chosenPca: any) {
    const selectedPlans = this.insurancePlans?.filter(i => i.isPlanSelected);
    this.savePremiums(selectedPlans);
    this.pcaExceptionDialogService?.close();
  }

  private savePremiums(selectedPlans: ClientInsurancePlans[]) {
    const insurancePremiums = this.getPremiumData(selectedPlans);
    this.savePremiumsEvent.emit(insurancePremiums);
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
        exceptionType: coverage.premiumExistException ? 'PREMIUM_EXIST' : '',
        exceptionReason: coverage.exceptionReason,
      };
    });
  }

  private createPcaPayload(plan: ClientInsurancePlans): any[] {
    return plan.coverages.map((coverage: InsurancePremiumCoverage) => {
      const firstDayOfMonth = coverage?.coverageDates ? new Date(coverage.coverageDates) : new Date();
      const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

      return {
        clientId: this.selectedClient.clientId,
        claimAmount: coverage.premiumAmount,
        serviceStartDate: firstDayOfMonth,
        serviceEndDate: lastDayOfMonth,
        paymentRequestId: null,
        objectLedgerName: ObjectCode.InsurancePremium
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
      cvg.exceptionReasonRequired = (cvg?.makeExceptionFlag ?? false) && !cvg?.exceptionReason;
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
        this.hasException = true;
      })
    }
    else {
      this.hasException = false;
      this.save();
    }
  }

  private makeAutoPlanSelection(plan: ClientInsurancePlans) {
    plan.isPlanSelected = plan?.coverages?.length > 0;
  }
}
