import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPcaFacade } from '@cms/case-management/domain';
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
  financialPcaAssignmentGridLists$ = this.financialPcaFacade.financialPcaAssignmentData$;
  financialPcaReassignmentGridLists$ = this.financialPcaFacade.financialPcaReassignmentData$;
  financialPcaReportGridLists$ = this.financialPcaFacade.financialPcaReportData$; 

  constructor(
    private readonly financialPcaFacade: FinancialPcaFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
  ) {}

 
 
  loadFinancialPcaSetupListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaSetupListGrid();
  }

  loadFinancialPcaAssignmentListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaAssignmentListGrid();
  }

  loadFinancialPcaReassignmentListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaReassignmentListGrid();
  }

  loadFinancialPcaReportListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaReportListGrid();
  }

 
}

  
