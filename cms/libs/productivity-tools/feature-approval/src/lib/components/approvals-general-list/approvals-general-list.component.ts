/** Angular **/
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import {
  PanelBarCollapseEvent,
  PanelBarExpandEvent,
} from '@progress/kendo-angular-layout';
import { DialogService } from '@progress/kendo-angular-dialog';
import { PendingApprovalGeneralTypeCode, PendingApprovalPaymentTypeCode } from '@cms/productivity-tools/domain';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'productivity-tools-approvals-general-list',
  templateUrl: './approvals-general-list.component.html',
})
export class ApprovalsGeneralListComponent implements OnInit, OnChanges {
  isPanelExpanded = false;
  ifApproveOrDeny: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalGeneralGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() gridSkipCount:any;
  @Input() approvalsGeneralLists$: any;
  @Input() clientsSubjects$ : any;
  @Input() approvalsExceedMaxBenefitCard$:any;
  @Input() invoiceData$:any;
  @Input() isInvoiceLoading$:any;
  @Output() loadApprovalsGeneralGridEvent = new EventEmitter<any>();
  @Output() loadApprovalsExceedMaxBenefitCardEvent = new EventEmitter<any>();
  @Output() loadApprovalsExceedMaxBenefitInvoiceEvent = new EventEmitter<any>();
  pendingApprovalGeneralTypeCode:any;
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
  gridApprovalGeneralBatchData$ =
    this.gridApprovalGeneralDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private editListITemsDialog: any;
  approvalId!: number;
  selectedIndex: any;
  @ViewChild('editListItemDialogModal') editModalTemplate!: TemplateRef<any>;
  @Input() usersByRole$ : any;
  @Output() approvalEntityId = new EventEmitter<any>();
  @Input() selectedVendor$ : any;
  selectedSubtypeCode: any;

  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService,private readonly loginUserFacade : UserManagementFacade,
    ) {}

  ngOnInit(): void {
    this.loadApprovalGeneralListGrid();
    this.pendingApprovalGeneralTypeCode=PendingApprovalGeneralTypeCode;
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

  public onPanelExpand(item:any): void {
    this.selectedSubtypeCode  = item.subTypeCode;
    this.approvalEntityId.emit(item.approvalEntityId);
    this.isPanelExpanded = true;
  }

  approveOrDeny(index:any,result: any) {
    this.selectedIndex = index;
    this.ifApproveOrDeny = result;
  }

  onEditListItemsDetailClicked(template: TemplateRef<unknown>): void {
    this.editListITemsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }


  onCloseEditListItemsDetailClicked()  {
    this.editListITemsDialog.close();
  }

  getTitle(approvalTypeCode: string,subTypeCode:string) {
    switch (approvalTypeCode) {
      case PendingApprovalGeneralTypeCode.GeneralException:
        return 'Request to Exceed Max Benefits';
      case PendingApprovalGeneralTypeCode.GeneralCaseReassignment:
        return 'Request for Case reassignment';
      case PendingApprovalGeneralTypeCode.GeneralAddtoMasterList:
        return this.getMasterlistTitle(subTypeCode);
    }
    return null;
  }
  openEditModal(event:any){
    if(event){
      this.onEditListItemsDetailClicked(this.editModalTemplate);
    }
  }

  getMasterlistTitle(subTypeCode:string){
    switch(subTypeCode){
      case PendingApprovalGeneralTypeCode.DentalClinic:
        return 'Request to add Dental Clinics To Master List';
      case PendingApprovalGeneralTypeCode.MedicalClinic:
        return 'Request to add Medical Clinics To Master List';
      case PendingApprovalGeneralTypeCode.MedicalProvider:
        return 'Request to add Medical Providers To Master List';
      case PendingApprovalGeneralTypeCode.DentalProvider:
        return 'Request to add Dental Providers To Master List';
      case PendingApprovalGeneralTypeCode.InsuranceVendor:
        return 'Request to add Insurance Vendors To Master List';
      case PendingApprovalGeneralTypeCode.InsuranceProvider:
        return 'Request to add Insurance Providers To Master List';
      case PendingApprovalGeneralTypeCode.Pharmacy:
        return 'Request to add Pharmacies To Master List';
    }
    return null;
  }

  loadApprovalsExceedMaxBenefitCard($event:any)
  {
    this.loadApprovalsExceedMaxBenefitCardEvent.emit($event);
  }
  loadApprovalsExceedMaxBenefitInvoice($event:any)
  {
    this.loadApprovalsExceedMaxBenefitInvoiceEvent.emit($event);
  }
}
