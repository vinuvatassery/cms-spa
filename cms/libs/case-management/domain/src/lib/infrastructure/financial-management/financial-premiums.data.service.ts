/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable } from 'rxjs';
import { ClientInsurancePlans, InsurancePremium, InsurancePremiumDetails, PolicyPremiumCoverage } from '../../entities/financial-management/client-insurance-plan';
import { BatchPremium } from '../../entities/financial-management/batch-premium';

@Injectable({ providedIn: 'root' })
export class FinancialPremiumsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}



  loadFinancialPremiumsProcessListService( ) {
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
  loadFinancialPremiumsBatchListService( ) {
    return of([
      {
        id:1,
        batch: '05012021_001 `',
        ofProviders:'XX',
        ofPremiums:'XX',
        pmtsRequested:'XX',
        pmtsReconciled:'XX',
        totalAmountDue:'XX,XXX.XX',
        totalAmountReconciled:'XX,XXX.XX',
      },
      {
        id:2,
        batch: '05012021_001 `',
        ofProviders:'XX',
        ofPremiums:'XX',
        pmtsRequested:'XX',
        pmtsReconciled:'XX',
        totalAmountDue:'XX,XXX.XX',
        totalAmountReconciled:'XX,XXX.XX',
      },
      {
        id:3,
        batch: '05012021_001 `',
        ofProviders:'XX',
        ofPremiums:'XX',
        pmtsRequested:'XX',
        pmtsReconciled:'XX',
        totalAmountDue:'XX,XXX.XX',
        totalAmountReconciled:'XX,XXX.XX',
      },
    ]);
  }
  loadFinancialPremiumsAllPaymentsListService( ) {
    return of([
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA',
        clientName:'FName LName',
        primaryInsurance:'FName LName',
        memberID:'FName LName',
        refundWarrant:'address2',
        refundAmount:'address2',
        depositDate:'address2',
        depositMethod:'address2',
        originalWarranty:'XXXXXX',
        originalAmount:'XXXXXX',
        indexCode:'address2',
        pca:'address2',
        grant:'address2',
        vp:'address2',
        refundNote:'address2',
        entryDate:'XX-XX-XXXX',
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA',
        clientName:'FName LName',
        primaryInsurance:'FName LName',
        memberID:'FName LName',
        refundWarrant:'address2',
        refundAmount:'address2',
        depositDate:'address2',
        depositMethod:'address2',
        originalWarranty:'XXXXXX',
        originalAmount:'XXXXXX',
        indexCode:'address2',
        pca:'address2',
        grant:'address2',
        vp:'address2',
        refundNote:'address2',
        entryDate:'XX-XX-XXXX',
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA',
        clientName:'FName LName',
        primaryInsurance:'FName LName',
        memberID:'FName LName',
        refundWarrant:'address2',
        refundAmount:'address2',
        depositDate:'address2',
        depositMethod:'address2',
        originalWarranty:'XXXXXX',
        originalAmount:'XXXXXX',
        indexCode:'address2',
        pca:'address2',
        grant:'address2',
        vp:'address2',
        refundNote:'address2',
        entryDate:'XX-XX-XXXX',
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA',
        clientName:'FName LName',
        primaryInsurance:'FName LName',
        memberID:'FName LName',
        refundWarrant:'address2',
        refundAmount:'address2',
        depositDate:'address2',
        depositMethod:'address2',
        originalWarranty:'XXXXXX',
        originalAmount:'XXXXXX',
        indexCode:'address2',
        pca:'address2',
        grant:'address2',
        vp:'address2',
        refundNote:'address2',
        entryDate:'XX-XX-XXXX',
        by: 'by',
      },
    ]);
  }

  loadBatchName(batchId: string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/medical/payment-batches/${batchId}`);
  }


  loadBatchLogListService(premiumType : string ,batchId : string,paginationParameters : any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/payment-batches/${batchId}/payments`,paginationParameters);
  }

  loadPremiumServicesByPayment(premiumType : string ,paymentId : string,paginationParameters : any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/payments/${paymentId}/services`,paginationParameters);
  }

  loadBatchItemsListService(){
    return of([
      {
        id:101,
        vendorName: 'vendorName',
        type:'address2',
        clientName:'address2',
        refundWarrant:'address2',
        refundAmount:'address2',
        depositDate:'address2',
        depositMethod:'address2',
        indexCode:'address2',
        pca:'address2',
        grant:'address2',
        vp:'address2',
        refundNote:'address2',
        entryDate:'address2',
        by: 'by',
      },
      {
        id:102,
        vendorName: 'vendorName',
        type:'address2',
        clientName:'address2',
        refundWarrant:'address2',
        refundAmount:'address2',
        depositDate:'address2',
        depositMethod:'address2',
        indexCode:'address2',
        pca:'address2',
        grant:'address2',
        vp:'address2',
        refundNote:'address2',
        entryDate:'address2',
        by: 'by',
      },

    ]);
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
      PaymentToReconcileCount : data.paymentToReconcileCount
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${data.premiumsType}/payments/payment-reconcile-summary`,ReconcilePaymentResponseDto
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
      Filter : data.filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${data.premiumsType}/payments/payment-reconcile-breakout`,BreakoutPanelPageAndSortedRequestDto
    );
  }

  loadMedicalPremiumPrintAdviceLetterData(batchId: any, printAdviceLetterData: any, premiumType: any) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/${batchId}/print-advice-letter`, printAdviceLetterData);
  }

  reconcilePaymentsAndLoadPrintAdviceLetterContent(batchId: any, reconcileData: any, premiumType:any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/${batchId}/reconcile-payments`,reconcileData);
  }

  viewPrintAdviceLetterData(batchId: any, printAdviceLetterData: any, premiumType:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${premiumType}/batches/${batchId}/download-advice-letter`, printAdviceLetterData,
      { responseType: 'blob' }
    );
  }
 loadMedicalPremiumList( skipcount: number,
  maxResultCount: number,
  sort: string,
  sortType: string,
  filter:any) {
    const filterRequestBody = {
      skipcount:skipcount,
      maxResultCount:maxResultCount,
      sort:sort,
      sortType:sortType,
      filter:filter
    }
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/medical/list`,filterRequestBody);   
}

batchClaims(batchPremiums: BatchPremium, claimsType: string) {
  return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/${claimsType}/batch`, batchPremiums);
}
 
  loadInsurancePlans(clientId: number): Observable<ClientInsurancePlans[]>{
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurance-premiums/clients/${clientId}/plans`
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
}
