/** Angular **/
import {
  ChangeDetectionStrategy,
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
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { FinancialPcaFacade, GridFilterParam } from '@cms/case-management/domain';
import { NavigationMenuFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-pcas-reassignment-list',
  templateUrl: './financial-pcas-reassignment-list.component.html',
  styleUrls: ['./financial-pcas-reassignment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasReassignmentListComponent
  implements OnInit, OnChanges
{
  @ViewChild('addEditPcaReassignmentDialogTemplate', { read: TemplateRef })
  addEditPcaReassignmentDialogTemplate!: TemplateRef<any>;
  @ViewChild('confirmationPcaReassignmentDialogTemplate', { read: TemplateRef })
  confirmationPcaReassignmentDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pcaReassignmentConfirmationDialogService: any;
  pcaReassignmentAddEditDialogService: any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPcaReassignmentGridLoaderShow = false;
  isViewGridOptionClicked = false;
  isEditGridOptionClicked = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaReassignmentGridLists$: any;
  @Output() loadFinancialPcaReassignmentListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn = 'ALL';
  gridDataResult!: GridDataResult;

  gridFinancialPcaReassignmentDataSubject = new Subject<any>();
  gridFinancialPcaReassignmentData$ =
    this.gridFinancialPcaReassignmentDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  editPcaReassignmentItem: any;
  @Output() getPcaAssignmentByIdEvent = new EventEmitter<any>();
  @Output() updatePcaAssignmentByEvent = new EventEmitter<any>();
  @Input() getPcaAssignmentById$ :any;
  @Output() loadPcaReassignmentListEvent = new EventEmitter();
  @Input() notAssignPcaLists$: any;
  inputvalue!:string;
  reAssignPcaS:any[]=[];
  allNotAssignedPcaSList:any;
  notSelectedPcaS:any;
  selectedPcaData:any;

  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'View',
      icon: 'visibility',
      click: (data: any): void => {
        if (!this.isViewGridOptionClicked) {
          this.isViewGridOptionClicked = true;
          this.isEditGridOptionClicked=false;
          this.onOpenViewEditPcaReassignmentClicked(this.addEditPcaReassignmentDialogTemplate,data);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditGridOptionClicked) {
          this.isEditGridOptionClicked = true;
          this.isViewGridOptionClicked = false;
          this.onOpenViewEditPcaReassignmentClicked(this.addEditPcaReassignmentDialogTemplate,data);
        }
      },
    },
  ];

  dropDownColumns : { columnCode: string, columnDesc: string }[] = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'PcaCode',
      columnDesc: 'PCA',
    },
    {
      columnCode: 'ObjectName',
      columnDesc: 'Object',
    },
    {
      columnCode: 'CloseDate',
      columnDesc: 'CloseDate',
    },
  ];

  /** Constructor **/
  constructor(
    private dialogService: DialogService,
    private financialPcaFacade:FinancialPcaFacade,
    private readonly navigationMenuFacade: NavigationMenuFacade
  ) {}

  ngOnInit(): void {
    this.defaultGridState();
    this.financialPcaFacade.getPcaUnAssignments();
    this.notAssignPcaLists$.subscribe((res:any)=>{
      this.allNotAssignedPcaSList=res;
      this.notSelectedPcaS=this.allNotAssignedPcaSList;
      this.loadPcaReassignment();
    })
    this.financialPcaFacade.pcaActionIsSuccess$.subscribe((res:string) => {
      if(res=='reassignment')
      {
        this.navigationMenuFacade.pcaReassignmentCount();
        this.loadPcaReassignment();
      }
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadPcaReassignment();
  }

  loadPcaReassignment() {
    this.isFinancialPcaReassignmentGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: this.state?.skip ?? 0,
      maxResultCount: this.state?.take ?? 0,
      sorting: this.sortValue,
      sortType: this.sortType,
      columnname: this.selectedColumn,       
      filter: JSON.stringify(this.filter)
    }
    this.loadFinancialPcaReassignmentListEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'ALL',
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
    this.filter = stateData?.filter?.filters;
    this.loadPcaReassignment();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPcaReassignment();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPcaReassignmentGridLists$.subscribe(
      (data: GridDataResult) => {
        this.gridFinancialPcaReassignmentDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isFinancialPcaReassignmentGridLoaderShow = false;
        }
      }
    );
    this.isFinancialPcaReassignmentGridLoaderShow = false;  
  }

  onOpenViewEditPcaReassignmentClicked(template: TemplateRef<unknown>,data:any): void {
    this.pcaReassignmentAddEditDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.editPcaReassignmentItem = data;
  }

  onCloseEditPcaReassignmentClicked(result: any) {
    if (result) {
      this.isViewGridOptionClicked = false;
      this.isEditGridOptionClicked = false;
      this.pcaReassignmentAddEditDialogService.close();
    }
  }

  onConfirmationPcaReassignmentClicked(template: TemplateRef<unknown>): void {
    this.pcaReassignmentConfirmationDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseConfirmationPcaReassignmentClicked(result: any) {
    if (result) {
      this.pcaReassignmentConfirmationDialogService.close();
    }
  }

  getPcaAssignmentById(pcaAssignmentId:any){
    this.getPcaAssignmentByIdEvent.emit(pcaAssignmentId);
  }

  saveEditPcaReassignmentClicked(updateReassignmentValue:any){
    this.updatePcaAssignmentByEvent.emit(updateReassignmentValue);
    this.isViewGridOptionClicked = false;
    this.isEditGridOptionClicked = false;
      this.pcaReassignmentAddEditDialogService.close();
      this.loadPcaReassignmentListEvent.emit(true);
  }

  onSearchTextChange(text : any,data:any)
  {
     let  pcaCodes=this.reAssignPcaS.find((x:any)=>x.pcaAssignmentId==data.pcaAssignmentId);
     if(text!=pcaCodes.pcaCode)
           {
            let idx = this.reAssignPcaS.findIndex((x:any)=>x.pcaCode==pcaCodes.pcaCode);
            if (idx !== -1) {
              this.reAssignPcaS.splice(idx, 1);
          }
      this.allNotAssignedPcaSList=this.notSelectedPcaS;    }
   this.allNotAssignedPcaSList=this.notSelectedPcaS.filter((obj:any) =>
                         String(obj.pcaCode).includes(text)||String(obj.fundingSourceCode).includes(text))
  }

  onClientSelected(event: any,data:any) {
          let isPcAalreadySelected = this.reAssignPcaS.findIndex((x:any)=>x.pcaAssignmentId==data.pcaAssignmentId);
              if (isPcAalreadySelected !== -1)
              {
                 this.reAssignPcaS.splice(isPcAalreadySelected, 1);
              }
                 let obj={"pcaId":event.pcaId,"pcaAssignmentId":data.pcaAssignmentId,"pcaCode":event.pcaCode};
             this.reAssignPcaS.push(obj);
  }
  onPcaReassignmentClicked(action: any) {
    this.pcaReassignmentConfirmationDialogService.close();
    this.financialPcaFacade.pcaReassignment(this.reAssignPcaS);
}

onclick(data:any)
  {
     this.selectedPcaData=data;
  }

public itemDisabled(itemArgs:any)
  {
    if(this.selectedPcaData ==undefined)
    return false;
    else if(this.selectedPcaData.unlimitedFlag=='Y')
    return false
    else if(itemArgs.dataItem.pcaRemainingAmount<this.selectedPcaData.originalAmount)
    {
      return true;
    }
    else if(this.reAssignPcaS.findIndex((x:any)=>x.pcaCode==itemArgs.dataItem.pcaCode)!==-1)
    {
      return true;
    }else{
      return false
    }
  }

  isUnlimitedFlag(flag : string){
    return flag == "Y";
  }

  searchColumnChangeHandler(value: string) {
    if(this.searchValue){
      this.onChange(value);
    }
  }
  onPcaReassignmentSearch(searchValue : any){
      this.onChange(searchValue);
  }
}
