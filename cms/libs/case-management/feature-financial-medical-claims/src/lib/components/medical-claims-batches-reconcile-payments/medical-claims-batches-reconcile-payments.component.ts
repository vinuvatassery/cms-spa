/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FinancialMedicalClaimsFacade } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'cms-medical-claims-batches-reconcile-payments',
  templateUrl: './medical-claims-batches-reconcile-payments.component.html',
  styleUrls: ['./medical-claims-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchesReconcilePaymentsComponent implements OnInit, OnChanges{
  @ViewChild('PrintAuthorizationDialog', { read: TemplateRef })
  PrintAuthorizationDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public currentDate =  new Date(); 
  public state!: State;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReconcileGridLoaderShow = false;
  printAuthorizationDialog : any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() reconcileGridLists$: any;
  @Output() loadReconcileListEvent = new EventEmitter<any>();
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  reconcilePaymentGridPagedResult!: any;
  reconcilePaymentGridUpdatedResult!: any;
  gridClaimsReconcileDataSubject = new Subject<any>();
  gridClaimsReconcileData$ = this.gridClaimsReconcileDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  datePaymentReconciled:any;
  tareaCessationCounter: string="200";
  
  /** Constructor **/
  constructor(private route: Router,   private dialogService: DialogService,
     private readonly cd: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.gridDataHandle();
    this.loadReconcileListGrid();
  }


  private loadReconcileListGrid(): void {
    this.loadReconcile(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadReconcile(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isReconcileGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadReconcileListEvent.emit(gridDataRefinerValue);
    
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
    this.loadReconcileListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.assignGridDataToMainListToSave();
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadReconcileListGrid();
  }

  assignGridDataToMainListToSave(){
  if(this.reconcilePaymentGridUpdatedResult === null || this.reconcilePaymentGridUpdatedResult === undefined){
    this.reconcilePaymentGridUpdatedResult = this.reconcilePaymentGridPagedResult.filter((x:any)=>x.datePmtReconciled !==null
    || x.datePmtSent !== null || x.warrantNumber !== null)
  }
  }
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.reconcileGridLists$.subscribe((data: any) => {
      this.reconcilePaymentGridPagedResult = data;     
      this.reconcilePaymentGridPagedResult.data = filterBy(
        this.reconcilePaymentGridPagedResult.data,
        this.filterData
      );
      this.isReconcileGridLoaderShow = false;
      this.gridClaimsReconcileDataSubject.next(this.reconcilePaymentGridPagedResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isReconcileGridLoaderShow = false;
      }
    });
    this.isReconcileGridLoaderShow = false;
    this.cd.detectChanges()
  }

  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  validateGridRecord(){

  }

  dateChange(enteredDate: Date,dataItem:any,type:any) {
    const todayDate = new Date(); 
    switch (type.toUpperCase()) {
      case "DATE_PAYMENT_RECONCILED":
        if (enteredDate > todayDate) {  
          dataItem.datePaymentRecInValid = true;
        }     
        else{
          dataItem.datePaymentRecInValid = false;
        }
        break;
      case "DATE_PAYMENT_SENT":
        if (enteredDate > todayDate) {  
          dataItem.datePaymentSentInValid = true;
        }     
        else{
          dataItem.datePaymentSentInValid = false;
        }
        break;        
    }   
  }

  noteChange(note:any,dataIem:any){
    debugger;

  }
  
  warrantNumberChange(dataItem:any){
    if(this.datePaymentReconciled === null || this.datePaymentReconciled === undefined){
      dataItem.datePmtReconciled = this.currentDate;
      dataItem.datePaymentRecInValid = false;
      dataItem.datePaymentSentInValid = false;
    }

  }
  onPrintAuthorizationCloseClicked(result: any) {
    if (result) { 
      this.printAuthorizationDialog.close();
    }
  }
     navToBatchDetails(event : any){  
       this.route.navigate(['/financial-management/medical-claims'] );
     }
}

