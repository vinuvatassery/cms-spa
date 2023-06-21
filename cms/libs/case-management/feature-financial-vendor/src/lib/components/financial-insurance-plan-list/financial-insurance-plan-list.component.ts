import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { VendorInsurancePlanFacade } from '@cms/case-management/domain';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
    selector: 'cms-financial-insurance-plan-list',
    templateUrl: './financial-insurance-plan-list.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInsurancePlanListComponent implements OnInit {
    /* Input Properties */
    @Input() vendorId!: string;
    @Input() providerId!: string;

    public formUiStyle: UIFormStyle = new UIFormStyle();
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public pageSizes = this.vendorInsurancePlanFacade.gridPageSizes;
    public gridSkipCount = this.vendorInsurancePlanFacade.skipCount;
    public sort = this.vendorInsurancePlanFacade.sort;
    public state!: State;
    vendorInsurancePlanList$ = new BehaviorSubject<any>([]);
    loader$ = new BehaviorSubject<boolean>(false);

    public actionsButtons = [
        {
            buttonType: 'btn-h-primary',
            text: 'Edit',
            icon: 'edit',
            click: (data: any): void => {
            },
        },
        {
            buttonType: 'btn-h-primary',
            text: 'Deactivate',
            icon: 'block',
            click: (data: any): void => {
            },
        },
        {
            buttonType: 'btn-h-danger',
            text: 'Delete',
            icon: 'delete',
            click: (data: any): void => {
            },
        },
    ];

    /** Constructor **/
    constructor(private readonly vendorInsurancePlanFacade: VendorInsurancePlanFacade,
        private loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService) { }

    ngOnInit(): void {
        this.initializePaging();
        this.loadVendorInsurancePlan();
    }

    ngOnChanges(): void {
        this.initializePaging();
    }

    initializePaging() {
        const sort: SortDescriptor[] = [{
            field: 'creationTime',
            dir: 'desc'
        }];
        this.state = {
            skip: this.gridSkipCount,
            take: this.pageSizes[0]?.value,
            sort: sort
        };
    }

    pageSelectionchange(data: any) {
        this.state.take = data.value;
        this.state.skip = 0;
        this.loadVendorInsurancePlan();
    }

    public dataStateChange(stateData: any): void {
        this.sort = stateData.sort;
        this.state = stateData;
        this.loadVendorInsurancePlan();
    }

    loadVendorInsurancePlan() {
        this.loader$.next(true);
        this.vendorInsurancePlanFacade.loadVendorInsurancePlan(this.vendorId, this.providerId, this.state).subscribe({
            next: (dataResponse: any) => {
                const gridView: any = {
                    data: dataResponse['items'],
                    total: dataResponse?.totalCount,
                };
                this.vendorInsurancePlanList$.next(gridView);
                this.loader$.next(false);
            },
            error: (err: any) => {
                this.loader$.next(false);
                this.loggingService.logException(err)
                this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
            },
        });
    }
}
