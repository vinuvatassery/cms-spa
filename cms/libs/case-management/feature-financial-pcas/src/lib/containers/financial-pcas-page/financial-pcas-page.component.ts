import {
  ChangeDetectionStrategy,

  Component,
  OnInit,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialFundingSourceFacade, FinancialPcaFacade, PcaAssignmentsFacade, GridFilterParam, PcaDetails } from '@cms/case-management/domain';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-financial-pcas-page',
  templateUrl: './financial-pcas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasPageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  claimsType: any;
  state!: State;
  sortType = this.financialPcaFacade.sortType;
  pageSizes = this.financialPcaFacade.gridPageSizes;
  gridSkipCount = this.financialPcaFacade.skipCount;
  pcaReassignmentCount!: number;

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
  financialPcaReportGridLists$ = this.financialPcaFacade.financialPcaReportData$;
  financialPcaSubReportGridLists$ = this.financialPcaFacade.financialPcaSubReportData$;
  fundingSourceLookup$ = this.fundingSourceFacade.fundingSourceLookup$;
  pcaActionIsSuccess$ = this.financialPcaFacade.pcaActionIsSuccess$;
  pcaData$ = this.financialPcaFacade.pcaData$;
  pcaReassignmentByFundSourceId$ = this.financialPcaFacade.pcaReassignmentByFundSourceId$;
  objectCodesData$ = this.pcaAssignmentsFacade.objectCodesData$;
  groupCodesData$ = this.pcaAssignmentsFacade.groupCodesData$;
  pcaCodesData$ = this.pcaAssignmentsFacade.pcaCodesData$;
  pcaDatesData$ = this.pcaAssignmentsFacade.pcaDatesData$;
  pcaCodesInfoData$ = this.pcaAssignmentsFacade.pcaCodesInfoData$;
  pcaAssignmentData$ = this.pcaAssignmentsFacade.pcaAssignmentData$;
  assignPcaResponseData$ = this.pcaAssignmentsFacade.assignPcaResponseData$;

   pcaAssignOpenDatesListSubject = new Subject<any>();
  pcaAssignOpenDatesList$ = this.pcaAssignOpenDatesListSubject.asObservable();

   pcaAssignCloseDatesListSubject = new Subject<any>();
  pcaAssignCloseDatesList$ = this.pcaAssignCloseDatesListSubject.asObservable();
  getPcaAssignmentById$ = this.financialPcaFacade.getPcaAssignmentById$;
  
  constructor(
    private readonly financialPcaFacade: FinancialPcaFacade,
    private readonly fundingSourceFacade: FinancialFundingSourceFacade,
    private readonly pcaAssignmentsFacade : PcaAssignmentsFacade   
  ) { }
  ngOnInit(): void {
    this.PcaReassignmetCount();
  }

  PcaReassignmetCount() {
    this.financialPcaFacade.pcaReassignmentCount().subscribe({
      next: (val)=>{
        this.pcaReassignmentCount = val;
      },
    })
  }



  loadFinancialPcaSetupListGrid(event: GridFilterParam) {
    this.financialPcaFacade.loadFinancialPcaSetupListGrid(event);
  }

  loadFinancialPcaAssignmentListGrid(pcaAssignmentGridArguments: any) {
    this.pcaAssignmentsFacade.loadFinancialPcaAssignmentListGrid(pcaAssignmentGridArguments);
  }

  loadFinancialPcaReassignmentListGrid(event: any) {
    this.financialPcaFacade.loadFinancialPcaReassignmentListGrid(event);
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
    this.financialPcaFacade.loadFinancialPcaSubReportListGrid(data?.objecCodeGroupCodeId,data?.skipCount, data?.maxResultCount);
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
  
}


