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
export class SystemConfigFinancialDataService {
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
  loadFundsListsService() {
    return of([
      {
        lifetimePeriod: '48 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
      {
        lifetimePeriod: '33 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
      {
        lifetimePeriod: '44 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }
  loadIndexListsService() {
    return of([
      {
        id: 1,
        index: '1',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem ipsum dolor sit amet',
      },
      {
        id: 2,
        index: '2',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem ipsum dolor sit amet',
      },
      {
        id: 3,
        index: '3',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem ipsum dolor sit amet',
      },
    ]);
  }

  loadExpenseTypeListsService() {
    return of([
      {
        id: 1,
        expensesType: 'Housing',
        objectCode: '432',
        preferredPaymentMethod: 'Check',
        defaultFrequency: 'One Time',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
        status: 'Active',
      },
      {
        id: 2,
        expensesType: 'Rent',
        objectCode: '432',
        preferredPaymentMethod: 'cash',
        defaultFrequency: 'One Time',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
        status: 'Active',
      },
      {
        id: 3,
        expensesType: 'Utility',
        objectCode: '432',
        preferredPaymentMethod: 'check',
        defaultFrequency: 'Recurrent',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
        status: 'Active',
      },
    ]);
  }

  loadIncomeTypeListsService() {
    return of([
      {
        id: 1,
        incomeType: 'Housing',
        incomeCategory: 'Fund',
        fundType: 'Grant',
        objectCode: '432',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
        status: 'Active',
      },
      {
        id: 1,
        incomeType: 'Housing',
        incomeCategory: 'Fund',
        fundType: 'Grant',
        objectCode: '432',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
        status: 'Active',
      },
      {
        id: 1,
        incomeType: 'Housing',
        incomeCategory: 'Fund',
        fundType: 'Grant',
        objectCode: '432',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
        status: 'Active',
      },
    ]);
  }

  loadPcaCodeListsService() {
    return of([
      {
        id: 1,
        pcaCode: 'Housing',
        year: 'YYYY',
        mailCode: '234324324324',
        accountNumber: '45324234324',
        phoneNumber: '422-532-5322',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
      },
      {
        id: 1,
        pcaCode: 'Housing',
        year: 'YYYY',
        mailCode: '234324324324',
        accountNumber: '45324234324',
        phoneNumber: '422-532-5322',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
      },
      {
        id: 1,
        pcaCode: 'Housing',
        year: 'YYYY',
        mailCode: '234324324324',
        accountNumber: '45324234324',
        phoneNumber: '422-532-5322',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'Caron',
      },
    ]);
  }
}
