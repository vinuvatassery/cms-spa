import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider ) {}

  /** Public methods **/
  loadApprovalsGeneral() {
    return of([
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }

  loadCasereassignmentExpandedInfo(approvalId : any)
  {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general/case-reassignment?approvalId=${approvalId}`
    );
  }
}
