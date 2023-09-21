import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentService {
    constructor(private readonly http: HttpClient,
        private readonly configurationProvider:ConfigurationProvider){

    }

    getAllPendingApprovalPaymentCount() {
        return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/productivity-tools/pending-approval/count`);
      }
}