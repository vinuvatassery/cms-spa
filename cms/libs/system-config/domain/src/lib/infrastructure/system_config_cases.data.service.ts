/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Data services **/
import { User } from '../entities/user';
import { LoginUser } from '../entities/login-user';

/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SystemConfigCasesDataService {
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadDomainsListsService() {
    return of([
      {
        id: 1,
        domainName: 'domainName',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 2,
        domainName: 'domainName',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 3,
        domainName: 'domainName',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
    ]);
  }
  loadEligibilityChecklistsListsService() {
    return of([
      {
        id: 1,
        assisterGroup: 'assisterGroup',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 2,
        assisterGroup: 'assisterGroup',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 3,
        assisterGroup: 'assisterGroup',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
    ]);
  }
}
