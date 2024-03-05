import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'system-interface-distribution-lists',
  templateUrl: './distribution-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionListsComponent implements OnInit, OnChanges {
onClosePopupClicked() {
throw new Error('Method not implemented.');
}
  save() {
    debugger;
    alert(JSON.stringify(this.memberForm.value));
  }
  isMemberDetailPopup = false;
  isMemberReactivatePopupShow = false;
  isMemberDeactivatePopupShow = false;
  isMemberDeletePopupShow = false;
  isMemberDeleteConfirmationPopupShow = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDistributionGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() distributionGridLists$: any;
  @Output() loadDistributionListEvent = new EventEmitter<any>();
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
    private readonly systemInterfaceSupportFacade: SystemInterfaceSupportFacade,
  ) { }

  createSupportGroupForm() {
    this.memberForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(200)]],
      lastName: ['', [Validators.maxLength(200)]],
      emailAddress: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadDistributionListGrid();
    this.createSupportGroupForm();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadDistributionListGrid();
  }

  private loadDistributionListGrid(): void {
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
    this.isDistributionGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadDistributionListEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'vendorName',
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
    this.distributionGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridDistributionDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isDistributionGridLoaderShow = false;
      }
    });
    this.isDistributionGridLoaderShow = false;
  }

  onMemberDetailsClicked() {
    this.createSupportGroupForm();
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
  addSupportGroup(data: any): void {
    this.systemInterfaceSupportFacade.addSupportGroup(data);
    // this.loadSupportGroupListGrid();
  }
}
