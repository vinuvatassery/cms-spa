import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  State,
  CompositeFilterDescriptor
} from '@progress/kendo-data-query';
import { LovFacade } from 'libs/system-config/domain/src/lib/application/lov.facade';
import { Subject, first } from 'rxjs';
@Component({
  selector: 'system-interface-support-group',
  templateUrl: './support-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGroupComponent implements OnInit, OnChanges {
  selectedGroup: any;
  public selectedRowChange(selectionEvent: any) {
    this.selectedGroup = selectionEvent.selectedRows[0].dataItem;
    this.selectedRowEvent.emit(this.selectedGroup);
  }

  isGroupDetailPopup = false;
  isSupportGroupReactivatePopupShow = false;
  isSupportGroupDeactivatePopupShow = false;
  isSupportGroupDeletePopupShow = false;
  isSupportGroupDeleteConfirmationPopupShow = false;
  addSupportGroup$ = this.systemInterfaceSupportFacade.addSupportGroup$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isSupportGroupGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() SupportGroupGridLists$: any;
  @Input() supportGroupReactivate$: any;
  @Input() supportGroupRemove$: any;
  @Output() loadSupportGroupListEvent = new EventEmitter<any>();
  @Output() deactivateConfimEvent = new EventEmitter<string>();
  @Output() reactivateConfimEvent = new EventEmitter<string>();
  @Output() deleteConfimedEvent = new EventEmitter<string>();
  @Output() selectedRowEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'groupName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn: any = 'ALL'
  gridDataResult!: GridDataResult;
  deactivateButtonEmitted = false;
  reactivateButtonEmitted = false;
  deleteButtonEmitted = false;
  notificationGroupId!: any;
  deactivebuttonEmitted = false;
  reletebuttonEmitted = false;

  gridSupportGroupDataSubject = new Subject<any>();
  gridSupportGroupData$ = this.gridSupportGroupDataSubject.asObservable();
  public selectableSettings: SelectableSettings;

  dataListsLoader$ = this.systemInterfaceSupportFacade.supportGroupListDataLoader$;

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  searchColumnList: { columnName: string, columnDesc: string }[] = [
    {
      columnName: 'ALL',
      columnDesc: 'All Columns'
    },
    {
      columnName: "groupName",
      columnDesc: "Group Name"
    },
  ]

  public gridMoreActionsSupport = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        console.log("edit")
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      buttonName: 'deactivate',
      click: (data: any): void => {
        if (!this.deactivateButtonEmitted) {
          this.deactivateButtonEmitted = true;
          this.onOpenSupportGroupDeactivateClicked(data);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      buttonName: 'reactivate',
      click: (data: any): void => {
        if (!this.reactivateButtonEmitted) {
          this.reactivateButtonEmitted = true;
          this.onOpenSupportGroupReactivateClicked(data);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      buttonName: 'delete',
      click: (data: any): void => {
        if (!this.deleteButtonEmitted) {
          this.deleteButtonEmitted = true;
          this.onOpenSupportGroupDeleteClicked(data);
        }

      },
    },
  ];
  public mode: SelectableMode = 'single';
  interfaceSupportGroupLov = this.lovFacade.interfaceSupportGroupLov$;
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
    private dialogService: DialogService,
    private readonly lovFacade: LovFacade
  ) {
    this.selectableSettings = {
      checkboxOnly: false,
      drag: false,
    };

  }

  ngOnInit(): void {
    this.loadSupportGroupListGrid();
    this.lovFacade.getInterfaceSupportGroupLovs();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadSupportGroupListGrid();
  }

  private loadSupportGroupListGrid(): void {
    this.loadSupportGroup(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadSupportGroup(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isSupportGroupGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.filter
    };
    this.loadSupportGroupListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'groupName',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] }
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';

    this.loadSupportGroupListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadSupportGroupListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.SupportGroupGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      // this.gridDataResult.data = filterBy(
      //   this.gridDataResult.data,
      //   this.filterData
      // );
      this.gridSupportGroupDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isSupportGroupGridLoaderShow = false;
      }
    });
    this.gridSupportGroupData$
      .subscribe((data) => { console.log(data) });

    this.isSupportGroupGridLoaderShow = false;
  }

  onGroupDetailsClicked() {
    this.isGroupDetailPopup = true;
  }
  onCloseGroupDetailPopupClicked() {
    this.isGroupDetailPopup = false;
  }
  onOpenSupportGroupDeleteClicked(notificationGroupId: any) {
    this.isSupportGroupDeletePopupShow = true;
    this.notificationGroupId = notificationGroupId;
  }
  onCloseSupportGroupDeleteClicked() {
    this.deleteButtonEmitted = false;
    this.isSupportGroupDeletePopupShow = false;

  }
  onOpenSupportGroupDeactivateClicked(notificationGroupId: any) {
    this.isSupportGroupDeactivatePopupShow = true;
    this.notificationGroupId = notificationGroupId;
  }
  onCloseSupportGroupDeactivateClicked() {

    this.deactivateButtonEmitted = false;
    this.isSupportGroupDeactivatePopupShow = false;

  }
  onOpenSupportGroupReactivateClicked(notificationGroupId: any) {
    this.isSupportGroupReactivatePopupShow = true;
    this.notificationGroupId = notificationGroupId;
  }
  onCloseSupportGroupReactivateClicked() {
    this.reactivateButtonEmitted = false;
    this.isSupportGroupReactivatePopupShow = false;
  }
  onOpenSupportGroupDeleteConfirmationClicked() {
    this.isSupportGroupDeleteConfirmationPopupShow = true;

  }
  onCloseSupportGroupDeleteConfirmationClicked() {
    this.isSupportGroupDeleteConfirmationPopupShow = false;

  }

  addSupportGroup(data: any): void {
    this.systemInterfaceSupportFacade.addSupportGroup(data);
    this.loadSupportGroupListGrid();
  }
  
  handleSupportGroupDeactive(isDeactivate:any)
  {
     if(isDeactivate)
     {
       this.deactivateButtonEmitted =false;
       this.deactivateConfimEvent.emit(this.notificationGroupId);

       this.supportGroupReactivate$.pipe(first((deleteResponse: any ) => deleteResponse != null))
       .subscribe((deleteResponse: any) =>
       {
         if(deleteResponse ?? false)
         {
           this.loadSupportGroupListGrid()
         }

       })
     }
     this.onCloseSupportGroupDeactivateClicked()
  }

  handleSupportGroupReactive(isReactivate:any)
  {
     if(isReactivate)
     {
       this.reactivateButtonEmitted =false;
       this.reactivateConfimEvent.emit(this.notificationGroupId);

       this.supportGroupReactivate$.pipe(first((deleteResponse: any ) => deleteResponse != null))
       .subscribe((deleteResponse: any) =>
       {
         if(deleteResponse ?? false)
         {
           this.loadSupportGroupListGrid()
         }

       })
     }
     this.onCloseSupportGroupReactivateClicked()
  }

  handleSupportGroupDelete(isHardDelete:any)
  {
     if(isHardDelete)
     {
       this.deleteButtonEmitted =false;
       this.deleteConfimedEvent.emit(this.notificationGroupId);

       this.supportGroupRemove$.pipe(first((deleteResponse: any ) => deleteResponse != null))
       .subscribe((deleteResponse: any) =>
       {
         if(deleteResponse ?? false)
         {
           this.loadSupportGroupListGrid()
         }

       })
     }
     this.onCloseSupportGroupDeleteClicked()
  }
}
