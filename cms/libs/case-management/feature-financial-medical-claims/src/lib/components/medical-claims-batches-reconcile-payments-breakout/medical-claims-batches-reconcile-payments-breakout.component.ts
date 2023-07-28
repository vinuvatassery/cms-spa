import { ChangeDetectionStrategy, Component,Input, OnInit,OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialMedicalClaimsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
@Component({
  selector: 'cms-medical-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './medical-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchesReconcilePaymentsBreakoutComponent implements OnInit,OnChanges{
  public sortValue = this.financialMedicalClaimsFacade.sortValue;
  public sortType = this.financialMedicalClaimsFacade.sortType;
  public pageSizes = this.financialMedicalClaimsFacade.gridPageSizes;
  public gridSkipCount = this.financialMedicalClaimsFacade.skipCount;
  public sort = this.financialMedicalClaimsFacade.sortList;
  public state!: State;
  public formUiStyle : UIFormStyle = new UIFormStyle();   
  @Input() entityId: any;
  @Input() batchId: any;
  @Input() reconcileBreakoutSummary$: any;
  @Input() isBreakoutPanelShow:boolean=false;
  reconcilePaymentBreakoutList$ = this.financialMedicalClaimsFacade.reconcilePaymentBreakoutList$
  constructor(private route: Router, private financialMedicalClaimsFacade: FinancialMedicalClaimsFacade) { }
  
  filterData : CompositeFilterDescriptor={logic:'and',filters:[]};
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
   }
  ngOnInit(): void {
    if(this.isBreakoutPanelShow)
    this.loadPaymentBreakoutGrid();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadPaymentBreakoutGrid();
  }

  private loadPaymentBreakoutGrid(): void {
    this.loadReconcilePayementList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadReconcilePayementList(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
   this.loadPaymentBreakout(gridDataRefinerValue);
  }

  loadPaymentBreakout(gridDataRefinerValue:any) {
    this.financialMedicalClaimsFacade.loadReconcilePaymentBreakoutListGrid(this.batchId, this.entityId, gridDataRefinerValue.skipcount,gridDataRefinerValue.pagesize , gridDataRefinerValue.sortColumn , gridDataRefinerValue.sortType)
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
    this.loadPaymentBreakoutGrid();
  }
  
  onCaseClicked(session: any) {
    this.route.navigate([`/case-management/cases/case360/${session?.clientId}`])
  }

  close()
  {
    this.isBreakoutPanelShow=!this.isBreakoutPanelShow;
  }
}
