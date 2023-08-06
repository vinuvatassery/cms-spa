/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 
import { Pharmacy } from '../../entities/client-pharmacy';
import { ClientCase } from '../../entities/client-case';


@Injectable({ providedIn: 'root' })
export class FinancialVendorRefundDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 

 
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
  loadVendorRefundAllPaymentsListService( ) {
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

  searchPharmacies(searchText: string) {
    return this.http.get<Pharmacy[]>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/pharmacies?searchText=${searchText}`);
  }

  loadClientBySearchText(text: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/SearchText=${text}`
    );
  }

  saveMedicalClaim(claim: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/MedicalClaim`, claim)
  }
  
  updateMedicalClaim(claim: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/MedicalClaim`, claim)
  }
}
