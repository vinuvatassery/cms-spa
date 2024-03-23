import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FinancialClaimTypeCode, FinancialClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject, Subject } from 'rxjs';
@Component({
    selector: 'cms-financial-payment-service-list',
    templateUrl: './financial-claims-payment-service-list.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPaymentServiceListComponent implements OnInit,OnChanges {

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
    serviceListProfileSubject = new Subject();

    /** Constructor **/
    constructor(private readonly claimsFacade: FinancialClaimsFacade,
        private loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService,
        private readonly userManagementFacade: UserManagementFacade,
        private readonly cdr: ChangeDetectorRef) { }

    /* Life cycle events */
    ngOnInit(): void {        
        this.initializeGrid();
       
    }

    ngOnChanges(): void {
        this.initializeGrid();
        this.loadServices();
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
                this.serviceTitle = this.claimType == FinancialClaimTypeCode.Medical ? 'Medical Service' : 'Dental Service';
                if(dataResponse['items']){
                    this.loadDistinctUserIdsAndProfilePhoto(dataResponse['items']);
                  }
            },
            error: (err: any) => {
                this.loader$.next(false);
                this.loggingService.logException(err)
                this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
            },
        });
    }

    loadDistinctUserIdsAndProfilePhoto(data: any[]) {
        const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
        if(distinctUserIds){
          this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
          .subscribe({
            next: (data: any[]) => {
              if (data.length > 0) {
                this.serviceListProfileSubject.next(data);
              }
            },
          });
          this.cdr.detectChanges();
        }
      } 

    private initializeGrid(){
        this.serviceTitle = this.claimType == FinancialClaimTypeCode.Medical ? 'Medical Service' : 'Dental Service';
        this.state = {
            skip: this.gridSkipCount,
            take: this.pageSizes[0]?.value,
            sort: this.sort,
        };
    }
}
