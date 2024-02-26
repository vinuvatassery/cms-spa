/** Angular **/
import {    ChangeDetectionStrategy,     ChangeDetectorRef,     Component,    EventEmitter,    Input,
    OnChanges,       OnDestroy,       Output,     } from '@angular/core';
import { FinancialClaimsFacade } from '@cms/case-management/domain';

  import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
  import { GridDataResult } from '@progress/kendo-angular-grid';
  import {State} from '@progress/kendo-data-query';
  import {Subject, Subscription } from 'rxjs';


  @Component({
    selector: 'cms-financial-claims-invoice-list',
    templateUrl: './financial-claims-invoice-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FinancialClaimsInvoiceListComponent implements OnChanges, OnDestroy {
   @Input() paymentRequestId : any
   @Input() financialInvoiceList$ : any
   @Input() sort : any
   @Input() claimsType: any;
   @Output() loadFinancialClaimsInvoiceListEvent = new EventEmitter<any>();
   gridFinancialClaimsInvoiceSubject = new Subject<any>();
   gridFinancialClaimsInvoice$ =  this.gridFinancialClaimsInvoiceSubject.asObservable();
   serviceTitle = ''
   isFinancialClaimsInvoiceGridLoaderShow = false
   public state!: State;
   sortType ="asc"
   gridDataResult!: GridDataResult;
   public formUiStyle: UIFormStyle = new UIFormStyle();
   financialInvoiceGridSubscription = new Subscription();
   financialInvoiceGridProfileSubject = new Subject();

   constructor(private financialClaimsFacade : FinancialClaimsFacade,
     private readonly notificationSnackbarService: NotificationSnackbarService,
     private loggingService: LoggingService,
     private readonly userManagementFacade: UserManagementFacade,
     private readonly cdr: ChangeDetectorRef){

   }

      ngOnChanges(): void {
        this.state = {
          skip: 0,
          take: 5,
          sort: this.sort,
        };
       this.serviceTitle = this.claimsType+' Service'
        this.loadFinancialInvoiceListGrid();
      }

    loadDistinctUserIdsAndProfilePhoto(data: any[]) {
      const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
      if(distinctUserIds){
        this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
        .subscribe({
          next: (data: any[]) => {
            if (data.length > 0) {
              this.financialInvoiceGridProfileSubject.next(data);
            }
          },
        });
        this.cdr.detectChanges();
      }
    } 

    ngOnDestroy(): void {
      this.financialInvoiceGridSubscription?.unsubscribe();
    }

      loadClaimsInvoices(
        paymentRequestId : string,
        skipCountValue: number,
        maxResultCountValue: number,
        sortValue: string,
        sortTypeValue: string
      ) {
        this.isFinancialClaimsInvoiceGridLoaderShow = true;
        const gridDataRefinerValue = {
          paymentRequestId : paymentRequestId,
          skipCount: skipCountValue,
          pagesize: maxResultCountValue,
          sortColumn: sortValue,
          sortType: sortTypeValue
        };
           this.financialClaimsFacade.loadFinancialClaimsInvoiceList(gridDataRefinerValue?.paymentRequestId , gridDataRefinerValue?.skipCount,   gridDataRefinerValue?.pagesize, gridDataRefinerValue?.sortColumn, gridDataRefinerValue?.sortType,this.claimsType)
           .subscribe({
            next: (dataResponse) => {
              const gridView = {
                data: dataResponse["items"],
                total: dataResponse["totalCount"]
              };
              this.isFinancialClaimsInvoiceGridLoaderShow = false;
              this.gridFinancialClaimsInvoiceSubject.next(gridView);
              this.loadDistinctUserIdsAndProfilePhoto(dataResponse["items"]);
            },
            error: (err) => {
              this.isFinancialClaimsInvoiceGridLoaderShow = false;
              this.loggingService.logException(err)
              this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)

            },
          });
        this.gridDataHandle();
      }

      gridDataHandle() {
        this.financialInvoiceList$.subscribe((data: GridDataResult) => {
          this.gridDataResult = data;
            this.isFinancialClaimsInvoiceGridLoaderShow = false;
        });
      }

      loadFinancialInvoiceListGrid()
      {
        this.loadClaimsInvoices(
            this.paymentRequestId,
            this.state?.skip ?? 0,
            this.state?.take ?? 0,
            this.sort,
            this.sortType
          );
      }
  }


