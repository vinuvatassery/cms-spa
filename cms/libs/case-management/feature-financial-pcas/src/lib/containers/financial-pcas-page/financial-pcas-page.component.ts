import {
  ChangeDetectionStrategy,

  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialFundingSourceFacade, FinancialPcaFacade, PcaAssignmentsFacade, GridFilterParam, PcaDetails } from '@cms/case-management/domain';
import { Subject } from 'rxjs';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { NavigationMenuFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-financial-pcas-page',
  templateUrl: './financial-pcas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasPageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  @ViewChild('tabStrip') tabStrip!: TabStripComponent;

  claimsType: any;
  state!: State;
  sortType = this.financialPcaFacade.sortType;
  pageSizes = this.financialPcaFacade.gridPageSizes;
  gridSkipCount = this.financialPcaFacade.skipCount;
  pcaReassignmentCount$ = this.navigationMenuFacade.pcaReassignmentCount$;

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
  financialPcaAssignmentGridLists$ = this.pcaAssignmentsFacade.financialPcaAssignmentData$;
  financialPcaReassignmentGridLists$ = this.financialPcaFacade.financialPcaReassignmentData$;
  financialPcaReportLoader$ = this.financialPcaFacade.financialPcaReportLoader$;
  financialPcaReportGridLists$ = this.financialPcaFacade.financialPcaReportData$;
  financialPcaSubReportGridLists$ = this.financialPcaFacade.financialPcaSubReportData$;
  fundingSourceLookup$ = this.fundingSourceFacade.fundingSourceLookup$;
  pcaActionIsSuccess$ = this.financialPcaFacade.pcaActionIsSuccess$;
  pcaData$ = this.financialPcaFacade.pcaData$;
  pcaReassignmentByFundSourceId$ = this.financialPcaFacade.pcaReassignmentByFundSourceId$;
  objectCodesData$ = this.pcaAssignmentsFacade.objectCodesData$;
  groupCodesData$ = this.pcaAssignmentsFacade.groupCodesData$;
  groupCodesDataFilter$ = this.pcaAssignmentsFacade.groupCodesData$;
  pcaCodesData$ = this.pcaAssignmentsFacade.pcaCodesData$;
  pcaDatesData$ = this.pcaAssignmentsFacade.pcaDatesData$;
  pcaCodesInfoData$ = this.pcaAssignmentsFacade.pcaCodesInfoData$;
  pcaAssignmentData$ = this.pcaAssignmentsFacade.pcaAssignmentData$;
  assignPcaResponseData$ = this.pcaAssignmentsFacade.assignPcaResponseData$;
  pcaAssignmentPriorityUpdate$ = this.pcaAssignmentsFacade.pcaAssignmentPriorityUpdate$;
  notAssignPcsLists$ = this.financialPcaFacade.notpcaData$;
   pcaAssignOpenDatesListSubject = new Subject<any>();
  pcaAssignOpenDatesList$ = this.pcaAssignOpenDatesListSubject.asObservable();

  pcaAssignOpenDatesSelectedSubject = new Subject<any>();
  pcaAssignOpenDatesSelected$ = this.pcaAssignOpenDatesSelectedSubject.asObservable();

  pcaAssignCloseDatesSelectedSubject = new Subject<any>();
  pcaAssignCloseDatesSelected$ = this.pcaAssignCloseDatesSelectedSubject.asObservable();

   pcaAssignCloseDatesListSubject = new Subject<any>();
  pcaAssignCloseDatesList$ = this.pcaAssignCloseDatesListSubject.asObservable();
  getPcaAssignmentById$ = this.financialPcaFacade.getPcaAssignmentById$;
  assignmentInfo:any = null;

  constructor(
    private readonly financialPcaFacade: FinancialPcaFacade,
    private readonly fundingSourceFacade: FinancialFundingSourceFacade,
    private readonly pcaAssignmentsFacade : PcaAssignmentsFacade,
    private readonly navigationMenuFacade: NavigationMenuFacade
  ) { }
  
  ngOnInit(): void {
    this.navigationMenuFacade.pcaReassignmentCount();
  }

  loadFinancialPcaSetupListGrid(event: GridFilterParam) {
    this.financialPcaFacade.loadFinancialPcaSetupListGrid(event);
  }

  loadFinancialPcaAssignmentListGrid(pcaAssignmentGridArguments: any) {
    this.pcaAssignmentsFacade.loadFinancialPcaAssignmentListGrid(pcaAssignmentGridArguments);
  }

  loadFinancialPcaReassignmentListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaReassignmentListGrid(event);
    this.navigationMenuFacade.pcaReassignmentCount();
  }

  loadPcaReassignmentList(data :any){
    this.financialPcaFacade.loadFinancialPcaReassignmentListGrid(data);
  }
  loadFinancialPcaReportListGrid(data: any) {
    this.financialPcaFacade.loadFinancialPcaReportListGrid(data?.skipCount, data?.pagesize, data?.sorting, data?.sortType, data?.filter);
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

  loadObjectCodes() {
    this.pcaAssignmentsFacade.loadObjectCodes()
  }

  loadGroupCodes() {
    this.pcaAssignmentsFacade.loadGroupCodes()
  }

  loadPcaCodes() {
    this.pcaAssignmentsFacade.loadPcaCodes()
  }

  loadPcaDates() {    
    this.pcaAssignmentsFacade.loadPcaDates()
    this.getPcaDatesList()
  }

  assignPca(assignPcaRequest : any) {

    if(assignPcaRequest?.pcaAssignmentId !== "00000000-0000-0000-0000-000000000000")
    {
      const pcaAssignmentData =
      {
        pcaAssignmentId: assignPcaRequest?.pcaAssignmentId,
        openDate: assignPcaRequest?.openDate,
        closeDate: assignPcaRequest?.closeDate,
        amount: assignPcaRequest?.amount,
        unlimitedFlag: assignPcaRequest?.unlimitedFlag
      }
     this.pcaAssignmentsFacade.editAssignedPca(pcaAssignmentData)
    }
    else
    {
      this.pcaAssignmentsFacade.assignPca(assignPcaRequest)
    }
  }


  getPcaAssignment(pcaAssignmentId : string) {
    this.pcaAssignmentsFacade.getPcaAssignment(pcaAssignmentId)
  }

  getPcaDatesList()
  {
    
   this.pcaDatesData$?.pipe()
   .subscribe((data: any) =>
   {
    this.pcaAssignOpenDatesListSubject.next(data?.pcaAssignOpenDatesList)
    this.pcaAssignCloseDatesListSubject.next(data?.pcaAssignCloseDatesList)
   })
  }
  removePca(pcaId: string) {
    if(pcaId){
      this.financialPcaFacade.deletePca(pcaId);
    }
  }

  loadFinancialPcaSubReportListGrid(data:any) {
    this.financialPcaFacade.loadFinancialPcaSubReportListGrid(data);
  }

  getPcaAssignmentById(fundingSourceId:any){
    this.financialPcaFacade.getPcaAssignmentById(fundingSourceId);
  }
  getPcaReassignmentByFundSourceId(fundingSourceId:any){
    this.financialPcaFacade.getPcaReassignmentByFundSourceId(fundingSourceId);
  }
  updateReassignmentPca(updateReassignmentData:any){
    this.financialPcaFacade.updateReassignmentPca(updateReassignmentData);
  }

  saveEditPcaReassignmentClicked(updateReassignmentValue:any){
    this.financialPcaFacade.updateReassignmentPca(updateReassignmentValue);

  }

  pcaAssignmentPriorityUpdate(pcaAssignmentPriorityArguments:any){
    this.pcaAssignmentsFacade.pcaAssignmentPriorityUpdate(pcaAssignmentPriorityArguments);
  }

  onAssignmentReportEditClick(data:any) {
    this.assignmentInfo = data;
    this.tabStrip.selectTab(1);
  }

  resetAssignmentInfo(){
    this.assignmentInfo = null;
  }
}


