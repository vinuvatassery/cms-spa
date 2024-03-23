/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { FinancialVendorProviderTabCode } from '../../enums/financial-vendor-provider-tab-code';
import { Pharmacy } from '../../entities/client-pharmacy';

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

  getVendorDetails(vendorId: string, isActive: boolean) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendors/vendor-details?vendorId=${vendorId}&isActive=${isActive}`
    );
  }
  searchInsurnaceVendor(searchText: string) {

      return this.http.get<Pharmacy[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/providers/SearchText=${searchText}`
      );
  }
  searchProvidorsById(VendorAddressId: string) {

      return this.http.get<Pharmacy[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/providers/by-vendor-address/${VendorAddressId}`
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

  getProviderPanelByVendorAddressId(vendorAddressId:string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors?vendorAddressId=${vendorAddressId}`
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
  getProviderPanelByVendorId(vendorId:string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/${vendorId}`
    );
  }

  addVendorProfile(vendorProfile:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/profile`,
      vendorProfile
    );
  }

  addVendorRecentlyViewed(vendorId : any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/recent-view/${vendorId}`,
      null
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
  searchProvider(payload: any)
  {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/search`,payload);
  }
  removeprovider(providerId: any)
  {
    return this.http.delete<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${providerId}`);
  }
  addProvider(provider:any)
  {
    return this.http.patch(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors`,provider);
  }

  updateVendorProfile (providePanelDto:any){
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/vendor-profile`,providePanelDto
    );
  }


  getValidateTinNbr(tinNbr:any){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/ValidateTin/${tinNbr}`
        );
      }

  loadVendors(searchText:any,vendorType:any){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/vendors/clinic-search?searchText=${searchText}&vendorType=${vendorType}`
    );
  }

}
