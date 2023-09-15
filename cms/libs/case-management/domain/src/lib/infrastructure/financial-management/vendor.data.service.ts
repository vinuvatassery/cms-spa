/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { FinancialVendorProviderTabCode } from '../../enums/financial-vendor-provider-tab-code';

@Injectable({ providedIn: 'root' })
export class FinancialVendorDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/
  getVendors(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, vendorTypeCode: string,filter : string ) 
  {
    const VendorPageAndSortedRequest =
    {
      vendorTypeCode: vendorTypeCode,
      SortType : sortType,
      Sorting : sort,
      SkipCount : skipcount,
      MaxResultCount : maxResultCount,
      Filter : filter
    }

    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors`, VendorPageAndSortedRequest);
  }

  getVendorDetails(vendorId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendors/${vendorId}`
    );
  }

  updateVendorDetails(details: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendors`, details
    );
  }

  getVendorProfile(vendorId: string, tabCode: string) {
    let path = '';
    switch (tabCode) {
      case FinancialVendorProviderTabCode.Manufacturers:
        path = 'manufacturers';
        break;

      case FinancialVendorProviderTabCode.MedicalProvider:
        path = 'medical-providers';
        break;

      case FinancialVendorProviderTabCode.InsuranceVendors:
        path = 'insurance-vendors';
        break;

      case FinancialVendorProviderTabCode.Pharmacy:
        path = 'pharmacies';
        break;

      case FinancialVendorProviderTabCode.DentalProvider:
        path = 'dental-providers';
        break;
    }

    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/${path}/${vendorId}/profile`
    );
  }

  
  getProviderPanel(paymentRequestId:string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors?paymentRequestId=${paymentRequestId}`
    );
  }

  updateProviderPanel(providePanelDto:any){
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/profile`,providePanelDto
    );
  }

  getVendorProfileSpecialHandling(vendorId: string) {  

    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/${vendorId}/profile/special-handling`
    );
  }


  addVendorProfile(vendorProfile:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/profile`,
      vendorProfile
    );
  }
  updateManufacturerProfile(vendorProfile:any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/manufacturers/profile`,
      vendorProfile
    );
  }

  searchClinicVendors(vendorName: any)
  {
    return this.http.get<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/${vendorName}/search`
      );
  }

  loadVendorList(vendorTypeCode:string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/vendorType/${vendorTypeCode}`
    );
  }

  getProvidersList(providerPageAndSortedRequest:any) {
      return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/children`, providerPageAndSortedRequest);   
  }
  searchProvider(searchText: string) 
  {
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/search/${searchText}`);
  }
  removeprovider(providerId: any) 
  {
    return this.http.delete<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${providerId}/delink-clinic`);
  }
  addProvider(provider:any)
  {   
    return this.http.patch(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/link-clinic`,provider);
  }
}
