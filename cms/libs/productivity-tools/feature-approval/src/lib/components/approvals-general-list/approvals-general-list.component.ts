/** Angular **/
import { 
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,

} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import {
  PanelBarCollapseEvent,
  PanelBarExpandEvent,
} from "@progress/kendo-angular-layout";
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'productivity-tools-approvals-general-list',
  templateUrl: './approvals-general-list.component.html', 
})
export class ApprovalsGeneralListComponent implements OnInit, OnChanges{
 isPanelExpanded = false;
 ifApproveOrDeny: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalGeneralGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() approvalsGeneralLists$: any;
  @Output() loadApprovalsGeneralGridEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridApprovalGeneralDataSubject = new Subject<any>();
  gridApprovalGeneralBatchData$ = this.gridApprovalGeneralDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private editListITemsDialog: any;
  approvalId ! : number;
  
  /** Constructor **/
  constructor(private route: Router,
    private dialogService: DialogService ) {}

  ngOnInit(): void {
    this.loadApprovalGeneralListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadApprovalGeneralListGrid();
  }


  private loadApprovalGeneralListGrid(): void {
    this.loadApprovalGeneral(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadApprovalGeneral(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isApprovalGeneralGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadApprovalsGeneralGridEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'batch',
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
    this.loadApprovalGeneralListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadApprovalGeneralListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.approvalsGeneralLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridApprovalGeneralDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isApprovalGeneralGridLoaderShow = false;
      }
    });
    this.isApprovalGeneralGridLoaderShow = false;
  }

  public onPanelCollapse(event: PanelBarCollapseEvent): void {
    this.isPanelExpanded = false;
  }

  public onPanelExpand(event: PanelBarExpandEvent): void {
    this.isPanelExpanded = true;

  }

  approveOrDeny(result:any){
      this.ifApproveOrDeny = result;
  }

  onEditListItemsDetailClicked(  template: TemplateRef<unknown>): void {   
    this.editListITemsDialog = this.dialogService.open({
      content: template,
      animation:{
        direction: 'left',
        type: 'slide', 
      }, 
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }
  onCloseEditListItemsDetailClicked(){
    this.editListITemsDialog.close();
  }
}
