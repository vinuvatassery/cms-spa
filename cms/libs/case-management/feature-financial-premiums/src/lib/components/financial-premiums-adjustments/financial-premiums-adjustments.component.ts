/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnInit, } from '@angular/core';
import { FinancialPremiumsFacade, GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoggingService } from '@cms/shared/util-core';
import { State } from '@progress/kendo-data-query';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'cms-financial-premium-adjustment',
    templateUrl: './financial-premiums-adjustments.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumAdjustmentsComponent implements OnInit {
    /* Input Properties */
    @Input() adjustmentId!: string
    @Input() pageSizes: any;
    @Input() premiumsType: any;

    /* Constructor */
    constructor(
        private readonly financialPremiumsFacade: FinancialPremiumsFacade,
        private readonly loggingService: LoggingService) { }

    /* Public properties */
    formUiStyle: UIFormStyle = new UIFormStyle();
    state!: State;
    sortValue: any;
    sortType: any;
    adjustments$ = new Subject<any>();
    adjustmentsLoader$ = new BehaviorSubject<boolean>(false);

    /* Lifecycle Events */
    ngOnInit(): void {
        this.state = {
            skip: 0,
            take: this.pageSizes[0]?.value,
            sort: [{ field: 'coverageStartDate', dir: 'desc' }]

        };
        this.loadAdjustments();
    }

    /* Public methods */
    dataStateChange(stateData: any): void {
        this.sortValue = stateData.sort[0]?.field ?? 'coverageStartDate';
        this.sortType = stateData.sort[0]?.dir ?? 'desc';
        this.state = stateData;
        this.loadAdjustments();
    }

    pageSelectionChange(data: any) {
        this.state.take = data.value;
        this.state.skip = 0;
        this.loadAdjustments();
    }

    /* Private Methods */
    private loadAdjustments() {
        const params = new GridFilterParam(this.state?.skip ?? 0, this.state?.take ?? 5, this.sortValue, this.sortType);
        this.loadPremiumAdjustments(this.premiumsType, this.adjustmentId, params);
    }

    private loadPremiumAdjustments(type: string, paymentId: string, params: GridFilterParam) {
        this.adjustmentsLoader$.next(true);
        this.financialPremiumsFacade.loadPremiumAdjustments(type, paymentId, params)
            .subscribe({
                next: (dataResponse: any) => {
                    const gridView = {
                        data: dataResponse['items'],
                        total: dataResponse['totalCount'],
                    };
                    this.adjustmentsLoader$.next(false);
                    this.adjustments$.next(gridView);
                },
                error: (err) => {
                    this.adjustmentsLoader$.next(false);
                    this.loggingService.logException(err);
                },
            })
    }
}