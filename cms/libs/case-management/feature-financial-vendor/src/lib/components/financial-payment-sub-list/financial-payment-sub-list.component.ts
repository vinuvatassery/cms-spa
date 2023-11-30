import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'cms-financial-payment-sub-list',
    templateUrl: './financial-payment-sub-list.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPaymentBatchSubListComponent implements OnInit {

    /** Input Properties **/
    @Input() batchId!: string;

    /* Public properties */
    formUiStyle: UIFormStyle = new UIFormStyle();
    pageSizes = this.paymentsFacade.gridPageSizes;
    gridSkipCount = this.paymentsFacade.skipCount;
    sort: SortDescriptor[] = [{ field: 'CreationTime', dir: 'asc' }];
    state!: State;
    paymentList$ = new BehaviorSubject<any>([]);
    loader$ = new BehaviorSubject<boolean>(false);
    isPaymentLoadFailed = false;
    /** Constructor **/
    constructor(
        private readonly paymentsFacade: PaymentsFacade,
        private loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService,
        private route: Router) { }

    /* Life cycle events */
    ngOnInit(): void {
        this.loadPayments();
    }

    ngOnChanges(): void {
        this.state = {
            skip: this.gridSkipCount,
            take: this.pageSizes[0]?.value,
            sort: this.sort,
        };
    }

    /* public methods */
    pageSelectionchange(data: any) {
        this.state.take = data.value;
        this.state.skip = 0;
        this.loadPayments();
    }

    dataStateChange(stateData: any): void {
        this.sort = stateData.sort;
        this.state = stateData;
        this.loadPayments();
    }

    loadPayments() {
        this.isPaymentLoadFailed = false;
        this.paymentList$.next({ data: [], total: 0 });
        this.loader$.next(true);
        this.paymentsFacade.loadPaymentBatchSubList(this.batchId, this.state).subscribe({
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

    onClientClicked(clientId: any) {
        this.route.navigate([`/case-management/cases/case360/${clientId}`]);
      }
}