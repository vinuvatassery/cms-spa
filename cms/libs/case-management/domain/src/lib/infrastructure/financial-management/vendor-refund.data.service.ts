import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientCase } from '../../entities/client-case';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Pharmacy } from '../../entities/client-pharmacy';
 
@Injectable({ providedIn: 'root' })
export class FinancialVendorRefundDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 
 
  getInsurnaceRefundInformation(insuranceRefundInformation:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/insurance-premiums`, insuranceRefundInformation);
  }
  loadVendorRefundProcessListService( ) {
    return of([
      {
        vendorId:1,
        vendorName: 'Address `',
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
        vendorId:2,
        vendorName: 'Address `',
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
        vendorId:3,
        vendorName: 'Address `',
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
  loadVendorRefundBatchListService( ) {
    return of([
      {
        id:1,
        batch: '05012021_001 `',
        tpaRefunds:'XX',
        insRefunds:'XX',
        taxRefunds:'XX',
        rxRefunds:'XX',
        totalOriginalAmountPaid:'XX,XXX.XX',
        totalRefundAmount:'XX,XXX.XX',  
      },
      {
        id:2,
        batch: '05012021_001 `',
        tpaRefunds:'XX',
        insRefunds:'XX',
        taxRefunds:'XX',
        rxRefunds:'XX',
        totalOriginalAmountPaid:'XX,XXX.XX',
        totalRefundAmount:'XX,XXX.XX',  
      },
      {
        id:3,
        batch: '05012021_001 `',
        tpaRefunds:'XX',
        insRefunds:'XX',
        taxRefunds:'XX',
        rxRefunds:'XX',
        totalOriginalAmountPaid:'XX,XXX.XX',
        totalRefundAmount:'XX,XXX.XX',  
      },
    ]);
  }


  loadVendorRefundAllPaymentsListService(recentClaimsPageAndSortedRequestDto : any) {
       return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/payments`,recentClaimsPageAndSortedRequestDto
    );
  }
 
 
  loadBatchLogListService( ) {
    return of([
      {
        vendorName: 'Address `',
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
        vendorName: 'Address `',
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
 
  loadClaimsListService( ) {
    return of([
      {
        invoiceId: '#213213213',
        providerName:'providerName',
        taxID:'234234',
        paymentMethod:'XXXX',
        serviceStartDate:'XX/XX/XXXX',
        serviceEndDate:'XX/XX/XXXX',
        serviceCost:'XXXX.XX',
        totalCost:'XXXX.XX',
        totalDue:'XXXX.XX',
        paymentStatus:'XXXX',
        pcaCode:'XXXXXX',
        entryDate:'XX/XX/XXXX',  
        by: 'by',
      },
      {
        invoiceId: '#213213213',
        providerName:'providerName',
        taxID:'234234',
        paymentMethod:'XXXX',
        serviceStartDate:'XX/XX/XXXX',
        serviceEndDate:'XX/XX/XXXX',
        serviceCost:'XXXX.XX',
        totalCost:'XXXX.XX',
        totalDue:'XXXX.XX',
        paymentStatus:'XXXX',
        pcaCode:'XXXXXX',
        entryDate:'XX/XX/XXXX',  
        by: 'by',
      },
      {
        invoiceId: '#213213213',
        providerName:'providerName',
        taxID:'234234',
        paymentMethod:'XXXX',
        serviceStartDate:'XX/XX/XXXX',
        serviceEndDate:'XX/XX/XXXX',
        serviceCost:'XXXX.XX',
        totalCost:'XXXX.XX',
        totalDue:'XXXX.XX',
        paymentStatus:'XXXX',
        pcaCode:'XXXXXX',
        entryDate:'XX/XX/XXXX',  
        by: 'by',
      },
     
     
    ]);
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
  loadClientClaimsListService( ) {
    return of([
      {
        id:1,
        item:1,
        PharmacyName: 'XXXXXX XXXXXX',  
        paymentMethod: 'paymentMethod',
        clientName:'XXXXXX XXXXXX XXXX',
        nameOnPrimaryInsuranceCard:'address2',
        clientId:'XXXXXX',
        RXNumber:'XXXXXX',
        FillDate:'XX/XX/XXXX',
        ndcCode:'XXXXXX',
        brandName:'XXXXXX',
        drugName: 'XXXXXX',
        paymentType: 'XXXXXX',
        amountPaid: 'xx.xx',
        rxQty: 'XX',
        rxType: 'XX',
        rxDaysSupply: 'XX',
        indexCode: 'XXXX',
        pcaCode: 'XXXX',
        objectCode: 'XXXX',
        paymentStatus: 'XXXX',
        warrantNumber: 'XXXXXX',
        entryDate: 'XX/XX/XXXX',
        by: 'by',
      },
     
     
    ]);
  }
  loadPharmacyPaymentsListService( ) {
    return of([
      {
        id:1,
        item:1,
        PharmacyName: 'XXXXXX XXXXXX',  
        paymentMethod: 'paymentMethod',
        clientName:'XXXXXX XXXXXX XXXX',
        nameOnPrimaryInsuranceCard:'address2',
        clientId:'XXXXXX',
        RXNumber:'XXXXXX',
        FillDate:'XX/XX/XXXX',
        ndcCode:'XXXXXX',
        brandName:'XXXXXX',
        drugName: 'XXXXXX',
        paymentType: 'XXXXXX',
        amountPaid: 'xx.xx',
        rxQty: 'XX',
        rxType: 'XX',
        rxDaysSupply: 'XX',
        indexCode: 'XXXX',
        pcaCode: 'XXXX',
        objectCode: 'XXXX',
        paymentStatus: 'XXXX',
        warrantNumber: 'XXXXXX',
        entryDate: 'XX/XX/XXXX',
        by: 'by',
      },
     
     
    ]);
  }
  loadFinancialRefundProcessListService(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string) {
    const RefundPageAndSortedRequestDto =
    {
      sortType : sortType,
      sorting : sort,
      skipCount : skipcount,
      maxResultCount : maxResultCount,
      Filter : filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds`,
      RefundPageAndSortedRequestDto
    );
  }
  loadClientBySearchText(text: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/claims/medical/clients/SearchText=${text}`
    );
  }
  loadPharmacyBySearchText(searchText: string,) {
    return this.http.get<Pharmacy[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/claims/pharmacies/SearchText=${searchText}`
    );
  }
  loadvendorBySearchText(searchText: string,) {
    return this.http.get<Pharmacy[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/claims/medical/insurance-vendor/SearchText=${searchText}`
    );
  }
  loadMedicalPremiumList( skipcount: number,
    maxResultCount: number,
    sort: any,
    sortType: string,
    filter:string) {
      debugger
      const filterRequestBody = {
        skipcount:skipcount,
        maxResultCount:maxResultCount,
        sorting:sort,
        sortType:sortType,
        filter:filter
      }
      return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/medical/list-premiums`,filterRequestBody);
  }
  
}