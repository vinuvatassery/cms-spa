/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { HttpClient } from "@angular/common/http";
import { ApplicantInfo } from '../entities/applicant-info';

@Injectable({ providedIn: 'root' })
export class ApplicantInfoService {
    constructor(private readonly configurationProvider:ConfigurationProvider,private readonly http:HttpClient){

    }
    saveApplicant(applicantInfo: ApplicantInfo) {  
        return this.http.post<ApplicantInfo>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/smoking-cessation/test`,
          applicantInfo,

        )}
        
}