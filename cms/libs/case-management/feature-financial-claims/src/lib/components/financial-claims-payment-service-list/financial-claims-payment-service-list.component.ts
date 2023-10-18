import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FinancialClaimTypeCode, FinancialClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'cms-financial-payment-service-list',
    templateUrl: './financial-claims-payment-service-list.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPaymentServiceListComponent implements OnInit {

    /** Input Properties **/
    @Input() paymentId!: string;
    @Input() claimType!: string;

    /* Public properties */
    formUiStyle: UIFormStyle = new UIFormStyle();
    pageSizes = this.claimsFacade.gridPageSizes;
    gridSkipCount = this.claimsFacade.skipCount;
    sort: SortDescriptor[] = [{ field: 'creationTime', dir: 'desc' }];
    state!: State;
    servicesList$ = new BehaviorSubject<any>([]);
    loader$ = new BehaviorSubject<boolean>(false);
    serviceTitle = '';

    /** Constructor **/
    constructor(private readonly claimsFacade: FinancialClaimsFacade,
        private loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService,) { }

    /* Life cycle events */
    ngOnInit(): void {
      this.serviceTitle = this.claimType == FinancialClaimTypeCode.Medical ? 'Medical Service' : 'Dental Service'
        this.initializeGrid();
        this.loadServices();
    }

    ngOnChanges(): void {
        this.initializeGrid();
    }

    /* public methods */
    pageSelectionchange(data: any) {
        this.state.take = data.value;
        this.state.skip = 0;
        this.loadServices();
    }

    dataStateChange(stateData: any): void {
        this.sort = stateData.sort;
        this.state = stateData;
        this.loadServices();
    }

    loadServices() {
        this.servicesList$.next({ data: [], total: 0 });
        this.loader$.next(true);
        const params = new GridFilterParam(this.state.skip, this.state.take , this.sort[0]?.field, this.sort[0]?.dir,'')
        this.claimsFacade.loadServicesByPayment(this.paymentId, params, this.claimType).subscribe({
            next: (dataResponse: any) => {
                const gridView: any = {
                    data: dataResponse['items'],
                    total: dataResponse?.totalCount,
                };
                this.servicesList$.next(gridView);
                this.loader$.next(false);
            },
            error: (err: any) => {
                this.loader$.next(false);
                this.loggingService.logException(err)
                this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
            },
        });
    }

    private initializeGrid(){
        this.state = {
            skip: this.gridSkipCount,
            take: this.pageSizes[0]?.value,
            sort: this.sort,
        };
    }
}
