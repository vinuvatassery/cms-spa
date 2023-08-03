import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FinancialMedicalClaimsFacade, GridFilterParam, PaymentsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'cms-payment-service-list',
    templateUrl: './claims-payment-service-list-list.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimsPaymentServiceList implements OnInit {

    /** Input Properties **/
    @Input() paymentId!: string;

    /* Public properties */
    formUiStyle: UIFormStyle = new UIFormStyle();
    pageSizes = this.claimsFacade.gridPageSizes;
    gridSkipCount = this.claimsFacade.skipCount;
    sort: SortDescriptor[] = [{ field: 'creationTime', dir: 'desc' }];
    state!: State;
    paymentList$ = new BehaviorSubject<any>([]);
    loader$ = new BehaviorSubject<boolean>(false);
    isPaymentLoadFailed = false;
    /** Constructor **/
    constructor(private readonly claimsFacade: FinancialMedicalClaimsFacade,
        private loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService,) { }

    /* Life cycle events */
    ngOnInit(): void {
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
        this.isPaymentLoadFailed = false;
        this.paymentList$.next({ data: [], total: 0 });
        this.loader$.next(true);
        const params = new GridFilterParam(this.state.skip, this.state.take , this.sort[0]?.field, this.sort[0]?.dir,'')
        this.claimsFacade.loadServicesByPayment(this.paymentId, params).subscribe({
            next: (dataResponse: any) => {
                const gridView: any = {
                    data: dataResponse['items'],
                    total: dataResponse?.totalCount,
                };
                this.paymentList$.next(gridView);
                this.loader$.next(false);
            },
            error: (err: any) => {
                this.isPaymentLoadFailed = true;
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