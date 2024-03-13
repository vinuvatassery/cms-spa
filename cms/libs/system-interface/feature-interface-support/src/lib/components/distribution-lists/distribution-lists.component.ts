import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-interface-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionListsComponent implements OnInit, OnChanges {

  isMemberDetailPopup = false;
  isMemberReactivatePopupShow = false;
  isMemberDeactivatePopupShow = false;
  isMemberDeletePopupShow = false;
  isMemberDeleteConfirmationPopupShow = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDistributionGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() selectedGroup: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  memberForm!: FormGroup;

  gridDistributionDataSubject = new Subject<any>();
  gridDistributionData$ =
    this.gridDistributionDataSubject.asObservable();

  selectedInterface = '';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActions = [
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
      click: (data: any): void => {
        this.onOpenMemberDeactivateClicked();


      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      click: (data: any): void => {
        this.onOpenMemberReactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onOpenMemberDeleteClicked();

      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loadDistributionListGrid();
  }

  ngOnChanges(): void {
    this.sortType = 'desc'
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadDistributionListGrid();
  }

  private loadDistributionListGrid(): void {
    if (!this.selectedGroup)
      return;

    this.selectedInterface = this.selectedGroup.groupName

    this.loadDistribution(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadDistribution(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: 'firstName',
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
      notificationGroupId: this.selectedGroup.notificationGroupId,
    };
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();

    // this.filterData = {
    //   logic: 'and',
    //   filters: [
    //     {
    //       filters: [
    //         {
    //           field: this.selectedColumn ?? 'vendorName',
    //           operator: 'startswith',
    //           value: data,
    //         },
    //       ],
    //       logic: 'and',
    //     },
    //   ],
    // };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);

  }


  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
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
    this.loadDistributionListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDistributionListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
  }

  onMemberDetailsClicked() {
    this.isMemberDetailPopup = true;
  }

  onCloseMemberDetailPopupClicked() {
    this.isMemberDetailPopup = false;
  }

  onOpenMemberDeleteClicked() {
    this.isMemberDeletePopupShow = true;
  }
  onCloseMemberDeleteClicked() {
    this.isMemberDeletePopupShow = false;
  }
  onOpenMemberDeactivateClicked() {
    this.isMemberDeactivatePopupShow = true;
  }
  onCloseMemberDeactivateClicked() {
    this.isMemberDeactivatePopupShow = false;
  }
  onOpenMemberReactivateClicked() {
    this.isMemberReactivatePopupShow = true;
  }
  onCloseMemberReactivateClicked() {
    this.isMemberReactivatePopupShow = false;
  }
  onOpenMemberDeleteConfirmationClicked() {
    this.isMemberDeleteConfirmationPopupShow = true;

  }
  onCloseMemberDeleteConfirmationClicked() {
    this.isMemberDeleteConfirmationPopupShow = false;

  }
  groupsDropDownList = []
  addNotificationUser(data: any): void {
    this.loadDistributionListGrid();
  }
}
