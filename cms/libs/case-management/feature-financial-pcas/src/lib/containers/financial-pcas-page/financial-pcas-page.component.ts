import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialFundingSourceFacade, FinancialPcaFacade, GridFilterParam, PcaDetails } from '@cms/case-management/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggingService } from '@cms/shared/util-core';
@Component({
  selector: 'cms-financial-pcas-page',
  templateUrl: './financial-pcas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  claimsType: any;
  state!: State;
  sortType = this.financialPcaFacade.sortType;
  pageSizes = this.financialPcaFacade.gridPageSizes;
  gridSkipCount = this.financialPcaFacade.skipCount;

  sortValueFinancialPcaSetup = this.financialPcaFacade.sortValueFinancialPcaSetup;
  sortPcaSetupList = this.financialPcaFacade.sortPcaSetupList;

  sortValueFinancialPcaAssignment = this.financialPcaFacade.sortValueFinancialPcaAssignment;
  sortPcaAssignmentList = this.financialPcaFacade.sortPcaAssignmentList;

  sortValueFinancialPcaReassignment = this.financialPcaFacade.sortValueFinancialPcaReassignment;
  sortPcaReassignmentList = this.financialPcaFacade.sortPcaReassignmentList;

  sortValueFinancialPcaReport = this.financialPcaFacade.sortValueFinancialPcaReport;
  sortFinancialPcaReportList = this.financialPcaFacade.sortFinancialPcaReportList;

  financialPcaSetupGridLists$ = this.financialPcaFacade.financialPcaSetupData$;
  financialPcaSetupLoader$ = this.financialPcaFacade.financialPcaSetupLoader$;
  financialPcaAssignmentGridLists$ = this.financialPcaFacade.financialPcaAssignmentData$;
  financialPcaReassignmentGridLists$ = this.financialPcaFacade.financialPcaReassignmentData$;
  financialPcaReportGridLists$ = this.financialPcaFacade.financialPcaReportData$;
  financialPcaSubReportGridLists$ = this.financialPcaFacade.financialPcaSubReportData$;
  fundingSourceLookup$ = this.fundingSourceFacade.fundingSourceLookup$;
  pcaActionIsSuccess$ = this.financialPcaFacade.pcaActionIsSuccess$;
  pcaData$ = this.financialPcaFacade.pcaData$

  constructor(
    private readonly financialPcaFacade: FinancialPcaFacade,
    private readonly fundingSourceFacade: FinancialFundingSourceFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
  ) { }



  loadFinancialPcaSetupListGrid(event: GridFilterParam) {
    this.financialPcaFacade.loadFinancialPcaSetupListGrid(event);
  }

  loadFinancialPcaAssignmentListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaAssignmentListGrid();
  }

  loadFinancialPcaReassignmentListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaReassignmentListGrid();
  }

  loadFinancialPcaReportListGrid(data: any) {
    this.financialPcaFacade.loadFinancialPcaReportListGrid(data?.skipCount, data?.pagesize, data?.sortColumn, data?.sortType, data?.filter);
  }

  loadAddOrEditPcaEvent(pcaId: any) {
    this.fundingSourceFacade.loadFundingSourceLookup();
    this.financialPcaFacade.loadPcaById(pcaId);
  }

  loadPcaById(pcaId: string){
    this.financialPcaFacade.loadPcaById(pcaId);
  }

  savePca(event: { pcaId?: string | null, pcaDetails: PcaDetails }) {
    if (event?.pcaId) {
      this.financialPcaFacade.updatePca(event?.pcaId, event?.pcaDetails);
    } else {
      this.financialPcaFacade.savePca(event?.pcaDetails);
    }
  }

  removePca(pcaId: string) {
    if(pcaId){
      this.financialPcaFacade.deletePca(pcaId);
    }
  }

  loadFinancialPcaSubReportListGrid(data:any) {
    this.financialPcaFacade.loadFinancialPcaSubReportListGrid(data?.objecCodeGroupCodeId,data?.skipCount, data?.maxResultCount);
  }
}


