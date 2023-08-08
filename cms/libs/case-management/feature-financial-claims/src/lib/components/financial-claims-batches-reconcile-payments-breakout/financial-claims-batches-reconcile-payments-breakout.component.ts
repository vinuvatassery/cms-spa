import { ChangeDetectionStrategy, Component,Input,Output,EventEmitter, OnInit,OnChanges,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './financial-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesReconcilePaymentsBreakoutComponent implements OnInit,OnChanges{
  public gridSkipCount  : any;
  isGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() reconcilePaymentBreakoutList$ :any;
  @Input() isBreakoutPanelShow:boolean=false;
  @Output() loadReconcilePaymentBreakOutGridEvent = new EventEmitter<any>();
  private addClientRecentClaimsDialog: any;
  public state!: State;
  public formUiStyle : UIFormStyle = new UIFormStyle();   
  sortColumn = 'clientName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  
  gridReconcilePaymentBreakoutListSubject = new Subject<any>();
  gridReconcilePaymentBreakout$ = this.gridReconcilePaymentBreakoutListSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  constructor(private route: Router,private dialogService: DialogService) { }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
   }
  ngOnInit(): void {
     this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    if(this.isBreakoutPanelShow)
    this.loadPaymentBreakoutGrid();   
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadPaymentBreakoutGrid();
  }

  private loadPaymentBreakoutGrid(): void {
    this.loadBreakList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadBreakList(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
   this.loadPaymentBreakout(gridDataRefinerValue);
  }

  loadPaymentBreakout(gridDataRefinerValue:any) {
    this.loadReconcilePaymentBreakOutGridEvent.emit(gridDataRefinerValue);
    this.isGridLoaderShow=false;
  }

  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPaymentBreakoutGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadPaymentBreakoutGrid();
  }
  
  gridDataHandle() {
    this.gridReconcilePaymentBreakout$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridReconcilePaymentBreakoutListSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isGridLoaderShow = false;
      }
    });
    this.isGridLoaderShow = false;

  }
  
  clientRecentClaimsModalClicked (template: TemplateRef<unknown>, data:any): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation:{
        direction: 'up',
        type:'slide',
        duration: 200
      }
    });
  }

  closeRecentClaimsModal(result: any){
    if (result) { 
      this.addClientRecentClaimsDialog.close();
    }
  }
}
