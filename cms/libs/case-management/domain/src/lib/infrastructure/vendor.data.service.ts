import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { Vendor } from "../entities/vendor";

@Injectable({ providedIn: 'root' })
export class VendorDataService{
    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
     
    }
    
      loadAllVendors(type:string){
        return this.http.get<Vendor>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/vendors?type=${type}`);
      }

      loadPayemntRequestVendors(type:string, vendorType:string, clientId: any, clientCaseligibilityId: any){
        return this.http.get<Vendor>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/vendors?type=${type}&vendorType=${vendorType}&clientId=${clientId}&eligibilityId=${clientCaseligibilityId}`);
      }
      searchVendor(searchText:any){
        return this.http.get(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/vendors/SearchText=${searchText}`);
      }
}