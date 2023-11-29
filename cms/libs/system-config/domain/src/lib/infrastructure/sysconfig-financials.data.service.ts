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
import { ConfigurationProvider, LoaderService } from "@cms/shared/util-core";
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SystemConfigFinancialDataService {
 
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private readonly router: Router,
    private configurationProvider : ConfigurationProvider,
    private readonly loaderService: LoaderService 
    ) {}

    showLoader()
    {
      this.loaderService.show();
    }
      
    hideLoader()
    {
      this.loaderService.hide();
    }

    
    loadIndexListsService() {
      return of([
        { id: 1, index: '1', effectiveDate: 'MM/DD/YYYY', comments: 'Lorem ipsum dolor sit amet', },
        {
          id: 2,
          index: '2',
          effectiveDate: 'MM/DD/YYYY',  comments: 'Lorem ipsum dolor sit amet',
        },
        {
          id: 3,
          index: '3',
          effectiveDate: 'MM/DD/YYYY', comments: 'Lorem ipsum dolor sit amet',
        },
      ]);
    }
}
