/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,  Component,
  EventEmitter,  Input,
  NgZone,  OnChanges,
  OnDestroy,  OnInit,
  Output,  Renderer2,
  SimpleChanges,  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult, RowClassArgs } from '@progress/kendo-angular-grid';
import {  CompositeFilterDescriptor,  State,} from '@progress/kendo-data-query';
import { Subject, Subscription, first } from 'rxjs';


@Component({
  selector: 'cms-financial-pcas-assignment-list',
  templateUrl: './financial-pcas-assignment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FinancialPcasAssignmentListComponent implements OnInit  , OnDestroy, OnChanges {
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
  pcaAssignmentFormData : any

  @Input() financialPcaAssignmentGridLists$: any;
  @Input() financialPcaAssignmentGridListsData$: any;
  @Input() objectCodesData$:any
  @Input() groupCodesData$:any
  @Input() pcaCodesData$:any
  @Input() pcaAssignOpenDatesList$ : any
  @Input() pcaAssignCloseDatesList$ : any
  @Input() pcaCodesInfoData$ : any
  @Input() pcaAssignmentData$ : any
  @Input() assignPcaResponseData$ : any
  @Input() groupCodesDataFilter$ : any
  @Input() pcaAssignmentPriorityUpdate$ : any
  @Input() assignmentInfo : any

  @Output() loadFinancialPcaAssignmentListEvent = new EventEmitter<any>();
  @Output() loadObjectCodesEvent = new EventEmitter<any>();
  @Output() loadGroupCodesEvent = new EventEmitter<any>();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Output() validatePcaDates = new EventEmitter<any>();
  @Output() getPcaAssignmentEvent = new EventEmitter<any>();
  @Output() addPcaDataEvent = new EventEmitter<any>();
  @Output() loadFinancialPcaAssignmentEvent = new EventEmitter<any>();
  @Output() pcaAssignmentPriorityUpdateEvent = new EventEmitter<any>();
  @Input() pcaAssignmentDatesValidation$ :any

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
  selectedGroupCodeIds : string[] = [];
  selectedGroupCodeList: any;

  pcaAssignmentGroupForm!: FormGroup;
  objectCodeValid = true
  groupCodesValid = true

  gridFinancialPcaAssignmentDataSubject = new Subject<any>();
  gridFinancialPcaAssignmentData$ =  this.gridFinancialPcaAssignmentDataSubject.asObservable();

  pcaAssignmentFormDataSubject = new Subject<any>();
  pcaAssignmentFormDataModel$ =  this.pcaAssignmentFormDataSubject.asObservable();
  @Output() resetAssignmentInfoObject: EventEmitter<void> = new EventEmitter<void>();

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  editButtonClicked = false
  newForm = false
  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.editButtonClicked) {
          this.editButtonClicked =true
          this.isEditAssignmentClosed = true;
          this.onOpenAddPcaAssignmentClicked(data);
        }
      },
    },
  ];

  private currentSubscription!: Subscription;
  pcaAssignmentId: any;
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2, private zone: NgZone
  ) {
  }


  loadDefaultGroupCodes(){
    if(this.selectedGroupCodeList!=undefined && this.selectedGroupCodeIds.length>0){
      let transformedArray = this.selectedGroupCodeList
      .filter((item: any) => this.selectedGroupCodeIds.includes(item.groupCodeId));

      transformedArray = transformedArray.map((item:any) => ({
        groupCodeId: item.groupCodeId,
        groupCodeDesc: item.groupCodeDesc
      }));

      this.pcaAssignmentGroupForm.get('groupCodes')?.setValue(transformedArray);
      this.groupChange(true,'false');
    }
  }

ngOnChanges(changes: SimpleChanges) {
    if (changes['groupCodesData$']) {
      if (this.groupCodesData$ && this.groupCodesData$.length>0) {
        this.selectedGroupCodeList = this.groupCodesData$;
        this.loadDefaultGroupCodes();
      }
    }
}

public ngOnDestroy(): void {
  this.resetAssignmentInfoObject.emit();
}

public rowCallback(context: RowClassArgs) {
  return {
      dragging: context.dataItem.dragging
  };
}
  ngOnInit(): void {
    this.loadObjectCodesEvent.emit()
    this.loadGroupCodesEvent.emit()

    this.onPcaChangeEvent()
    this.pcaAssignmentGroupForm = this.formBuilder.group({

      groupCodes:[[]],

    });

    if (this.assignmentInfo!=null){
      this.objectCodeIdValue = this.assignmentInfo?.objectId;
      this.selectedGroupCodeIds = this.assignmentInfo?.groupsCoveredIdsList;
    }
  }

  addPcaData(pcaAssignmentData : any)
  {
  this.addPcaDataEvent.emit(pcaAssignmentData)

  this.assignPcaResponseData$.pipe(first((deleteResponse: any ) => deleteResponse != null))
  .subscribe((dependentData: any) =>
  {
    if(dependentData?.status ?? false)
    {
      this.onCloseAddEditPcaAssignmentClicked(true)
      this.groupChange(true, 'false')
    }

  })
  }

  onLoadPcaEvent($event :  any)
  {
  this.loadPcaEvent.emit()
  }

  objectCodeChange(data : any)
  {
  this.objectCodeIdValue = data?.objectCodeId
  if(this.objectCodeIdValue)
    {
      this.objectCodeValid = true
    }
    if(this.groupCodeIdsdValue.length > 0)
    {
      this.groupCodesValid = true
    }
    else
    {
      this.groupCodesValid = false
    }
  this.groupChange(true,'false')
  }

  public onPriorityChange(e: any): void {
    this.isFinancialPcaAssignmentGridLoaderShow = true;
   const draggedRows = e?.draggedRows[0]?.dataItem
   const dropTargetRow = e?.dropTargetRow?.dataItem

   const pcaAssignmentPriorityArguments =
   {
     objectId : this.objectCodeIdValue,
     groupId :  draggedRows?.groupCodeId,
     newPriority : dropTargetRow?.priority,
     pcaAssignmentId : draggedRows?.pcaAssignmentId
   }
   this.pcaAssignmentPriorityUpdateEvent.emit(pcaAssignmentPriorityArguments)

  }

  groupChange($event : any, removeTag : any)
  {
    this.groupCodeIdsdValue = this.pcaAssignmentGroupForm.controls['groupCodes']?.value;   
   
    let  groupCodeIdsdValueData= []

    for (const key in this.groupCodeIdsdValue)
    {
      groupCodeIdsdValueData.push(this.groupCodeIdsdValue[key]?.groupCodeId)
    }

    if(this.objectCodeIdValue)
    {
      this.objectCodeValid = true
    }
    if(this.groupCodeIdsdValue.length > 0)
    {
      this.groupCodesValid = true
    }
    else
    {
      this.groupCodesValid = false
    }

      this.isFinancialPcaAssignmentGridLoaderShow = true;
      if(removeTag === 'true')
      {
        groupCodeIdsdValueData.splice(groupCodeIdsdValueData.indexOf($event?.dataItem?.groupCodeId), 1)
      }
      const pcaAssignmentGridArguments =
      {
        objectId : this.objectCodeIdValue,
        groupIds : groupCodeIdsdValueData
      }

      this.loadFinancialPcaAssignmentEvent.emit(pcaAssignmentGridArguments)
      this.gridDataHandle();

  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  gridDataHandle() {
    this.financialPcaAssignmentGridListsData$.subscribe((data: GridDataResult) => {
        this.isFinancialPcaAssignmentGridLoaderShow = false;
    });

  }
  public rowClass = (args:any) => ({
    "table-row-disabled": (!args.dataItem.isActive),
  });

  onOpenAddPcaAssignmentClicked(pcaAssignmentId : any): void {
    this.pcaAssignmentId = pcaAssignmentId;
    this.groupCodeIdsdValue = this.pcaAssignmentGroupForm.controls['groupCodes']?.value;
    this.pcaChangeEvent.emit(pcaAssignmentId)
    if(this.objectCodeIdValue && this.groupCodeIdsdValue.length > 0)
    {
       this.objectCodeValid = true
       this.groupCodesValid = true
        this.pcaAssignmentFormData = null
        if(pcaAssignmentId != '')
        {
          this.newForm = false
        this.getPcaAssignmentEvent.emit(pcaAssignmentId)
        this.onPcaAssignmentFormDataCompose()
        }
        else
        {
          this.newForm = true
        this.pcaAssignmentAddEditDialogService = this.dialogService.open({
          content: this.addEditPcaAssignmentDialogTemplate,
          cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
        });
      }
    }
    else
    {
      if(!this.objectCodeIdValue)
      {
          this.objectCodeValid = false
      }

      if(this.groupCodeIdsdValue.length == 0)
      {
        this.groupCodesValid = false
      }
    }
  }

  onPcaAssignmentFormDataCompose()
  {
    this.pcaAssignmentData$?.pipe(first((existPcaData: any ) => existPcaData?.pcaAssignmentId != null))
    .subscribe((existPcaData: any) =>
    {
        if(existPcaData?.pcaAssignmentId)
        {
         this.pcaAssignmentFormData =
          {
            pcaAssignmentId:  existPcaData?.pcaAssignmentId ,
            objectCodeId:  existPcaData?.objectCodeId,
            pcaId: existPcaData?.pcaId,
            openDate: existPcaData?.openDate,
            closeDate: existPcaData?.closeDate,
            amount: existPcaData?.totalAmount,
            unlimited: (existPcaData?.unlimitedFlag === 'Y') ,
            groupCodeIds: existPcaData?.groupCodeIds
          }
          //this.pcaAssignmentFormDataSubject.next(pcaAssignmentFormData)
          this.pcaAssignmentAddEditDialogService = this.dialogService.open({
            content: this.addEditPcaAssignmentDialogTemplate,
            cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
          });


      }
     })
  }
  onCloseAddEditPcaAssignmentClicked(result: any) {
    if (result) {
      this.isEditAssignmentClosed = false;
      this.editButtonClicked = false
      this.pcaAssignmentAddEditDialogService.close();
    }
  }

  onPcaChangeEvent()
  {
    this.pcaChangeEvent.emit()
  }

  onPcaAssignmentPriorityUpdate()
  {
    this.pcaAssignmentPriorityUpdate$.pipe(first((response: any ) => response != null))
    .subscribe((response: any) =>
    {
      if(response?.status ?? false)
      {
        this.groupChange(true, 'false')
      }

    })
  }

  isUnlimitedFlag(flag : string){
    return flag == "Y";
  }

  onValidatePcaDates(event:any){
    this.validatePcaDates.emit({pcaAssignmentId : this.pcaAssignmentId,
                          pcaAssignmentDates : event});
  }
}


