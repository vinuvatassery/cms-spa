/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs';
import { BatchPremium } from '../../entities/financial-management/batch-premium';
import { ClientInsurancePlans, InsurancePremium, InsurancePremiumDetails, PolicyPremiumCoverage } from '../../entities/financial-management/client-insurance-plan';
import { GridFilterParam } from '../../entities/grid-filter-param';

@Injectable({ providedIn: 'root' })
export class FinancialPremiumsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  loadFinancialPremiumsProcessListService() {
    return of([
      {
        invoiceID:1,
        providerName: 'Address `',
        taxID:'address2',
        paymentMethod:'address2',
        clientName:'address2',
        nameOnPrimaryInsuranceCard:'address2',
        memberID:'address2',
        serviceCount:'address2',
        totalCost:'address2',
        totalDue:'address2',
        paymentStatus:'address2',
        by: 'by',
      },
      {
        invoiceID:2,
        providerName: 'Address `',
        taxID:'address2',
        paymentMethod:'address2',
        clientName:'address2',
        nameOnPrimaryInsuranceCard:'address2',
        memberID:'address2',
        serviceCount:'address2',
        totalCost:'address2',
        totalDue:'address2',
        paymentStatus:'address2',
        by: 'by',
      },
    ]);
  }

  loadFinancialPremiumsAllPaymentsListService(parms: GridFilterParam, claimsType: string) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${claimsType}/payments`, parms
    );
  }

  loadFinancialPremiumsBatchListService(params: GridFilterParam, claimsType : string ) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${claimsType}/batches`, params
    );
  }

  loadBatchName(batchId: string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/medical/payment-batches/${batchId}`);
  }


  loadBatchLogListService(isReconciled: boolean, premiumType : string ,batchId : string, paginationParameters : any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/payment-batches/${batchId}/payments?isReconciled=${isReconciled}`,paginationParameters);
  }

  loadPremiumServicesByPayment(premiumType : string ,paymentId : string,paginationParameters : any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/payments/${paymentId}/services`,paginationParameters);
  }

  loadBatchItemsListService(batchId:string, paymentId: string, premiumType: string, params: GridFilterParam){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/${batchId}/payments/${paymentId}`, params);
  }
  loadReconcileListService(batchId:any,premiumType:any,paginationParameters:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/${batchId}/reconcile-payments`,paginationParameters);
  }
  loadPremiumsListService( ) {
    return of([
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name',
        insuranceType:'Off-Exchange Plan',
        amount:'XXX.XX',
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX',
        policyID:'XXXXXXXXX',
        groupID:'XXXXXXXXX',
        paymentID:'XXXXXXXXX',
        pmtMethod:'ACH',
        pmtStatus:'Recon',
        PCA:'XXXXXX',
        mailCode:'XXXX',
        by: 'by',
      },


    ]);
  }

  loadInsurancePremiumBreakoutSummaryService(data:any){
    const ReconcilePaymentResponseDto =
    {
      BatchId : data.batchId,
      EntityId : data.entityId,
      AmountTotal : data.amountTotal,
      WarrantTotal : data.warrantTotal,
      WarrantNbr : data.warrantNbr,
      PaymentToReconcileCount : data.paymentToReconcileCount,
      warrantCalculation:data.warrantCalculation,

    }

    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${data.premiumsType}/payment-reconcile-summary`,ReconcilePaymentResponseDto
    );
  }

  loadInsurancePremiumBreakoutListService(data:any){
    const BreakoutPanelPageAndSortedRequestDto =
    {
      BatchId : data.batchId,
      EntityId : data.entityId,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter,
      WarrantCalculation:data.warrantCalculation
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${data.premiumsType}/payment-reconcile-breakout`,BreakoutPanelPageAndSortedRequestDto
    );
  }

  loadPremiumPrintAdviceLetterData(isReconciled: boolean, printAdviceLetterData: any, premiumType: any) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/print-advice-letter-summary?isReconciled=${isReconciled}`, printAdviceLetterData);
  }

  reconcilePaymentsAndLoadPrintAdviceLetterContent(reconcileData: any, premiumType:any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/all/reconcile-payments`,reconcileData);
  }

  viewPrintAdviceLetterData(printAdviceLetterData: any, premiumType:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/download-advice-letter`, printAdviceLetterData,
      { responseType: 'blob' }
    );
  }
 loadMedicalPremiumList( skipcount: number,
  maxResultCount: number,
  sort: string,
  sortType: string,
  filter:any,
  premiumType : string) {
    const filterRequestBody = {
      skipcount:skipcount,
      maxResultCount:maxResultCount,
      sorting:sort,
      sortType:sortType,
      filter:filter
    }
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/list`,filterRequestBody);
}

batchClaims(batchPremiums: BatchPremium, claimsType: string) {
  return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${claimsType}/batch`, batchPremiums);
}

  loadInsurancePlans(clientId: number, eligibilityId: string, type: string): Observable<ClientInsurancePlans[]>{
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/clients/${clientId}/plans?eligibilityId=${eligibilityId}&type=${type}`
    );
  }

  loadInsurancePlansCoverageDates(clientId: number){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/clients/${clientId}/converge-dates`
    );
  }

  getExistingPremiums(clientId: number, type:string, premiums: PolicyPremiumCoverage[]): Observable<PolicyPremiumCoverage[]>{
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/clients/${clientId}/${type}/premiums`,
      premiums
    );
  }

  savePremiums(clientId: number, type:string, premiums: InsurancePremium[]){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/clients/${clientId}/${type}`,
      premiums
    );
  }

  loadRecentPremiumListService(data:any): Observable<any> {
    const recentPremiumsPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,
      hasServiceSubTypeFilter : data.includeServiceSubTypeFilter,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${data.premiumsType}/client-recent-premium`,recentPremiumsPageAndSortedRequestDto
    );
  }

  loadRecentPremiumsByClient(data:any, clientId:any){
    const recentPremiumsPageAndSortedRequestDto =
    {
     ...data,
      MaxResultCount : data.pageSize
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/clients/${clientId}/recent-premiums`,recentPremiumsPageAndSortedRequestDto);
  }

  loadPremium(type: string, premiumId: string): Observable<InsurancePremiumDetails> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/${type}/premiums/${premiumId}`
    );
  }

  updatePremium(type: string, premiumId: string, premiums: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/${type}/premiums/${premiumId}`
      , premiums
    );
  }

  unbatchEntireBatch(paymentRequestBatchIds: string[], premiumType: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/unbatch`, paymentRequestBatchIds);
  }

  unbatchPremium(paymentRequestIds: string[], premiumType: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/payment-requests/unbatch`, paymentRequestIds);
  }

  deletePremium(type: string, paymentId: string): Observable<InsurancePremiumDetails> {
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${type}/payments/${paymentId}`
    );
  }

  loadPremiumAdjustments(type: string, paymentId: string, params: GridFilterParam) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${type}/adjustments${params.convertToQueryString()}&paymentId=${paymentId}&type=${type}`
    );
  }

  removeSelectedPremiums(selectedPremiumPayments: any, premiumsType: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumsType}/payment-requests`, {
      headers,
      body: selectedPremiumPayments
    }
    );
  }

  loadEachLetterTemplate(premiumssType:any, templateParams:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumssType}/batches/print-advice-letter`,templateParams);
  }

  checkWarrantNumber(batchId:any, warrantNumber:any, vendorId:any,premiumType:any){
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/${batchId}/vendors/${vendorId}/warrants/${warrantNumber}`);
  }
}
