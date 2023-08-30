/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,  
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-financial-pcas-assignment-list',
  templateUrl: './financial-pcas-assignment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasAssignmentListComponent implements OnInit {
  @ViewChild('addEditPcaAssignmentDialogTemplate', { read: TemplateRef })
  addEditPcaAssignmentDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePcaAssignmentDialogTemplate', { read: TemplateRef })
  removePcaAssignmentDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pcaAssignmentRemoveDialogService  : any;
  pcaAssignmentAddEditDialogService : any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list'; 
  isFinancialPcaAssignmentGridLoaderShow = false;
  isEditAssignmentClosed = false;
  isRemoveAssignmentClosed = false;
  
  @Input() financialPcaAssignmentGridLists$: any;
  @Input() objectCodesData$:any
  @Input() groupCodesData$:any
  @Input() pcaCodesData$:any
  @Input() pcaAssignOpenDatesList$ : any
  @Input() pcaAssignCloseDatesList$ : any
  @Input() pcaCodesInfoData$ : any
  @Input() pcaAssignmentData$ : any

  @Output() loadFinancialPcaAssignmentListEvent = new EventEmitter<any>();
  @Output() loadObjectCodesEvent = new EventEmitter<any>();
  @Output() loadGroupCodesEvent = new EventEmitter<any>();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Output() getPcaAssignmentEvent = new EventEmitter<any>();
  @Output() addPcaDataEvent = new EventEmitter<any>();
  @Output() loadFinancialPcaAssignmentEvent = new EventEmitter<any>();

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
  objectCodeIdValue! : any
  groupCodeIdsdValue : any=[];

  pcaAssignmentGroupForm!: FormGroup;

  gridFinancialPcaAssignmentDataSubject = new Subject<any>();
  gridFinancialPcaAssignmentData$ =
    this.gridFinancialPcaAssignmentDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditAssignmentClosed) {
          this.isEditAssignmentClosed = true; 
          this.onOpenAddPcaAssignmentClicked(this.addEditPcaAssignmentDialogTemplate,'');
        }
      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadObjectCodesEvent.emit()
    this.loadGroupCodesEvent.emit()  
   
    this. onPcaChangeEvent()
    this.pcaAssignmentGroupForm = this.formBuilder.group({    
   
      groupCodes:[[]],
   
    });
  }

  addPcaData(pcaAssignmentData : any)
  {
  this.addPcaDataEvent.emit(pcaAssignmentData)
  }

  onLoadPcaEvent($event :  any)
  {
  this.loadPcaEvent.emit()
  }
  groupChange($event : any)
  {   
    this.groupCodeIdsdValue = this.pcaAssignmentGroupForm.controls['groupCodes']?.value;  
    let  groupCodeIdsdValueData= []
    for (const key in this.groupCodeIdsdValue) 
    {           
      groupCodeIdsdValueData.push(this.groupCodeIdsdValue[key]?.groupCodeId)     
    }
    if(this.groupCodeIdsdValue.length > 0 && this.objectCodeIdValue) 
    {
      const pcaAssignmentGridArguments = 
      {
        objectId : this.objectCodeIdValue,
        groupIds : groupCodeIdsdValueData
      }

      this.loadFinancialPcaAssignmentEvent.emit(pcaAssignmentGridArguments)
      this.gridDataHandle();
    }
  }


  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  gridDataHandle() {
    this.financialPcaAssignmentGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialPcaAssignmentDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialPcaAssignmentGridLoaderShow = false;
      }
    });
    this.isFinancialPcaAssignmentGridLoaderShow = false;
  }
  public rowClass = (args:any) => ({
    "table-row-disabled": (!args.dataItem.isActive),
  });
 
  onOpenAddPcaAssignmentClicked(template: TemplateRef<unknown>,pcaAssignmentId : string): void {
    this.getPcaAssignmentEvent.emit(pcaAssignmentId)  
    this.pcaAssignmentAddEditDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  } 
  onCloseAddEditPcaAssignmentClicked(result: any) {
    if (result) { 
      this.isEditAssignmentClosed = false;
      this.pcaAssignmentAddEditDialogService.close();
    }
  }

  onRemovePcaAssignmentClicked(template: TemplateRef<unknown>): void {
    this.pcaAssignmentRemoveDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseRemovePcaAssignmentClicked(result: any) {
    if (result) { 
      this.isRemoveAssignmentClosed = false;
      this.pcaAssignmentRemoveDialogService.close();
    }
  }

  onPcaChangeEvent()
  {
    this.pcaChangeEvent.emit()
  }
}
 
 
 