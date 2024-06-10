import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ContactResponse, VendorContactsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-contact-address-list',
  templateUrl: './contact-address-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactAddressListComponent implements OnInit, OnChanges {
  contactResponse: ContactResponse[] = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isContactAddressDeactivateShow = false;
  isContactAddressDeleteShow = false;
  isContactAddressDetailShow = false;
  isContactsDetailShow = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  VendorContactId: any;
  VendorContactAddressId = '';
  @Input() VendorAddressId: any;
  @Output() refreshPaymentAddressList: EventEmitter<any> = new EventEmitter<any>();
  @Input() vendorId:any;
  public state!: any;
  filters: any = "";
  sortColumn = "";
  sortDir = "";
  columnsReordered = false;
  isEdit !: boolean;
  showLoading = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  public sortValue = this.vendocontactsFacade.sortValue;
  public sortType = this.vendocontactsFacade.sortType;
  public pageSizes = this.vendocontactsFacade.gridPageSizes;
  public gridSkipCount = this.vendocontactsFacade.skipCount;
  public sort = this.vendocontactsFacade.sort;
  selectedColumn!: any;
  columnChangeDesc = 'Default Columns';
  contacts$ = new BehaviorSubject<any>([]);
  loader$ = new BehaviorSubject<boolean>(false);
  contactUserProfilePhotoSubject = new Subject();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  gridColumns: any = {
    contactName: "Name",
    contactDesc: "Description",
    phoneNbr: "Phone Number",
    faxNbr: "Fax Number",
    emailAddress: "Email Address",
    effectiveDate: "Effective Date",
    creatorId: "By"
  }

  public contactAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Contact',
      icon: 'edit',
      click: (data: any): void => {
        this.isEdit = true
        if (data?.vendorContactId) {
          this.VendorContactId = data;
          this.clickOpenAddEditContactAddressDetails();
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Contact',
      icon: 'block',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeactivateContactAddressDetails();
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Contact',
      icon: 'delete',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeleteContactAddressDetails();
        }
      },
    },
  ];

  constructor(
    private readonly vendocontactsFacade: VendorContactsFacade,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  ngOnInit(): void {
    this.loader$.subscribe((res:Boolean) =>{
      if(res){
        this.showLoading = true;
      }else{
        this.showLoading = false;
      }  
  })
  this.initializeGrid();
}

  initializeGrid() {
    this.contacts$.next({ data: [], total: 0 });
   this.loader$.next(true)
    this.vendocontactsFacade.loadcontacts(
      this.VendorAddressId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters
    ).subscribe({
      next: (res: any) => {
        const gridView: any = {
          data: res.items,
          total: res.totalCount,
        };
        this.contacts$.next(gridView);
        this.loader$.next(false);
        if(gridView){
          this.loadDistinctUserIdsAndProfilePhoto(gridView?.data);
        }
      },
      error: (err: any) => {
        this.loader$.next(false);
        this.loggingService.logException(err)
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })

  }

  loadDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.contactUserProfilePhotoSubject.next(data);
          }
        },
      });
      this.cd.detectChanges();
    }
  } 

  ngOnChanges(changes: SimpleChanges) {
    this.defaultGridState();
    this.initializeGrid();
  }
  rowClass = (args: any) => ({
    "table-row-disabled": (!args.dataItem.assigned),
  });
  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }
  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }
  clickOpenAddEditContactAddressDetails() {
    this.isContactsDetailShow = true;
  }

  clickOpenDeactivateContactAddressDetails() {
    this.isContactAddressDeactivateShow = true;
  }

  clickOpenDeleteContactAddressDetails() {
    this.isContactAddressDeleteShow = true;
  }

  clickCloseDeleteContactAddress() {
    this.isContactAddressDeleteShow = false;
  }

  clickCloseDeactivateContactAddress() {
    this.isContactAddressDeactivateShow = false;
  }

  onCancelPopup(isCancel: any) {
    if (isCancel) {
      this.vendocontactsFacade.loadcontacts(
        this.VendorAddressId,
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType,
        this.filters
      ).subscribe({
        next: (res: any) => {
          const gridView: any = {
            data: res.items,
            total: res.totalCount,
          };
          this.contacts$.next(gridView);
          this.loader$.next(false);
        },
        error: (err: any) => {
          this.loader$.next(false);
          this.loggingService.logException(err)
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
        },
      })
      this.clickCloseDeleteContactAddress();
    }
  }

  onDeactiveCancel(isCancel: any) {
    if (isCancel) {
      this.vendocontactsFacade.loadcontacts(
        this.VendorAddressId,
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType,
        this.filters
      ).subscribe({
        next: (res: any) => {
          const gridView: any = {
            data: res.items,
            total: res.totalCount,
          };
          this.contacts$.next(gridView);
          this.loader$.next(false);
        },
        error: (err: any) => {
          this.loader$.next(false);
          this.loggingService.logException(err)
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
        },
      })
      this.clickCloseDeactivateContactAddress();
      this.refreshPaymentAddressList.emit();
      this.initializeGrid();
    }
  }

  clickCloseAddEditContactsDetails() {
    this.isContactsDetailShow = false;
  }
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loader$.next(true)
    this.vendocontactsFacade.loadcontacts(
      this.VendorAddressId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters
    ).subscribe({
      next: (res: any) => {
        const gridView: any = {
          data: res.items,
          total: res.totalCount,
        };
        this.contacts$.next(gridView);
        this.loader$.next(false);
      },
      error: (err: any) => {
        this.loader$.next(false);
        this.loggingService.logException(err)
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  public dataStateChange(stateData: any): void {
    this.filters = JSON.stringify(stateData.filter?.filters);
    this.state = stateData;
    this.setGridState(stateData);
    this.loader$.next(true)
    this.vendocontactsFacade.loadcontacts(
      this.VendorAddressId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters
    ).subscribe({
      next: (res: any) => {
        const gridView: any = {
          data: res.items,
          total: res.totalCount,
        };
        this.contacts$.next(gridView);
        this.loader$.next(false);
      },
      error: (err: any) => {
        this.loader$.next(false);
        this.loggingService.logException(err)
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.filters = JSON.stringify(filter);
  }
  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      sortType: this.sortType,
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: '',
    };
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.filters = '';
    this.selectedColumn = 'ALL';
    this.searchValue = '';
    this.isFiltered = false;
    this.columnsReordered = false;
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      sortType: this.sortType,
      filters: { logic: 'and', filters: [] },
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: '',
    };
  }
  contactUpdated(res: boolean) {
    if (res) {
      this.initializeGrid();
    }
  }
  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    for (const val of filters) {
      if (val.field === 'startDate') {
        this.intl.formatDate(val.value, this.dateFormat);
      }
    }
    const filterList = this.state?.filter?.filters ?? [];
    this.filters = JSON.stringify(filterList);
    this.filteredBy = filterList.toString();

    if (filters.length > 0) {
      const filterListData = filters.map(
        (filter: any) => this.gridColumns[filter?.filters[0]?.field]
      );
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cd.detectChanges();
    } else {
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? '';
    this.sortType = stateData.sort[0]?.dir ?? '';
    this.state = stateData;
    this.sortColumn = this.gridColumns[stateData.sort[0]?.field];
    this.sortDir = '';
    if (this.sort[0]?.dir === 'asc') {
      this.sortDir = 'Ascending';
    }
    if (this.sort[0]?.dir === 'desc') {
      this.sortDir = 'Descending';
    }
  }

  onEditDeactivateContactClicked(event: any) {
    if (event?.vendorContactId) {
      this.VendorContactId = event?.vendorContactId;
      this.clickOpenDeactivateContactAddressDetails();
    }
  }
}
