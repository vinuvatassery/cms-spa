import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FinancialPharmacyClaimsFacade, GridFilterParam } from "@cms/case-management/domain";
import { UIFormStyle } from "@cms/shared/ui-tpa";
import { LoggingService } from "@cms/shared/util-core";
import { State } from "@progress/kendo-data-query";
import { BehaviorSubject, Subject } from "rxjs";

@Component({
    selector: 'cms-financial-pharmacy-prescription',
    templateUrl: './pharmacy-claims-prescription-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PharmacyClaimsPrescriptionListComponent implements OnInit {
    /* Input Properties */
    @Input() paymentId!: string;

    /* Public properties */
    formUiStyle: UIFormStyle = new UIFormStyle();
    state!: State;
    sortValue = 'fillDate';
    sortType = 'desc';
    prescriptions$ = new Subject<any>();
    prescriptionsLoader$ = new BehaviorSubject<boolean>(true);
    pageSizes = this.pharmacyClaimsFacade.gridPageSizes;

    /* Constructor */
    constructor(private readonly pharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
        private readonly loggingService: LoggingService) { }

    /* LifeCycle Events */
    ngOnInit(): void {
        this.initializeGrid();
        this.loadPrescription();
    }

    /* Public Methods */
    dataStateChange(stateData: any): void {
        this.sortValue = stateData.sort[0]?.field ?? 'fillDate';
        this.sortType = stateData.sort[0]?.dir ?? 'desc';
        this.state = stateData;
        this.loadPrescription();
    }

    pageSelectionChange(data: any) {
        this.state.take = data.value;
        this.state.skip = 0;
        this.loadPrescription();
    }


    /* Private Methods */
    private initializeGrid(){
        this.state = {
            skip: 0,
            take: this.pageSizes[0]?.value,
            sort: [{ field: 'fillDate', dir: 'desc' }]

        };
    }
    private loadPrescription() {
        const params = new GridFilterParam(this.state?.skip ?? 0, this.state?.take ?? 5, this.sortValue, this.sortType);
        this.loadPrescriptionData(this.paymentId, params);
    }

    private loadPrescriptionData(paymentId: string, params: GridFilterParam) {
        this.prescriptionsLoader$.next(true);
        this.pharmacyClaimsFacade.loadPrescriptions(paymentId, params)
            .subscribe({
                next: (dataResponse: any) => {
                    const gridView = {
                        data: dataResponse['items'],
                        total: dataResponse['totalCount'],
                    };
                    this.prescriptionsLoader$.next(false);
                    this.prescriptions$.next(gridView);
                },
                error: (err: any) => {
                    this.prescriptionsLoader$.next(false);
                    this.loggingService.logException(err);
                },
            })
    }
}