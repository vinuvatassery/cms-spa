/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
/** Data services **/

/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
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

  loadCaseAssignment() {
    return of([
      {
        id: 1,
        language: 'language',
        range: 'range',
        assignedCaseWorker: 'assignedCaseWorker',
        ofClients: 'ofClients',
        TemporaryAssignment: 'TemporaryAssignment',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 2,
        language: 'language',
        range: 'range',
        assignedCaseWorker: 'assignedCaseWorker',
        ofClients: 'ofClients',
        TemporaryAssignment: 'TemporaryAssignment',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 3,
        language: 'language',
        range: 'range',
        assignedCaseWorker: 'assignedCaseWorker',
        ofClients: 'ofClients',
        TemporaryAssignment: 'TemporaryAssignment',
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
        eligibilityCriterion: 'eligibilityCriterion',
        appearsOn: 'appearsOn',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 2,
        eligibilityCriterion: 'eligibilityCriterion',
        appearsOn: 'appearsOn',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
      {
        id: 3,
        eligibilityCriterion: 'eligibilityCriterion',
        appearsOn: 'appearsOn',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'active',
      },
    ]);
  }
}
