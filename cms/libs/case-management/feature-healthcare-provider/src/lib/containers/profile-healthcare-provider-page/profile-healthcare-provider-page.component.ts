/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HealthcareProviderFacade,
  WorkflowFacade,
} from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { LoaderService } from '@cms/shared/util-core';
import { Subject, Subscription} from 'rxjs';

@Component({
  selector: 'case-management-profile-healthcare-provider-page',
  templateUrl: './profile-healthcare-provider-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHealthcareProviderPageComponent implements OnInit {
  clientId!: number;

  /** Public properties **/
  private showProvidervalidationboxSubject = new Subject<boolean>();
  healthCareProviderSearchList$ =
    this.healthProvider.healthCareProviderSearchList$;
  healthCareProviders$ = this.healthProvider.healthCareProviders$;
  removeHealthProvider$ = this.healthProvider.removeHealthProvider$;
  healthCareProvideGetFlag$ = this.healthProvider.healthCareProvideGetFlag$;
  addExistingProvider$ = this.healthProvider.addExistingProvider$;
  loadExistingProvider$ = this.healthProvider.loadExistingProvider$;
  searchProviderLoaded$ = this.healthProvider.searchProviderLoaded$;
  showProvidervalidation$ = this.healthProvider.showProvidervalidation$;
  healthCareProvideReactivate$ = this.healthProvider.healthCareProvideReactivate$;
  showAddNewProvider$ = this.healthProvider.showAddNewProvider$;
  healthCareProviderProfilePhoto$ = this.healthProvider.healthCareProviderProfilePhotoSubject;
  showProvidervalidationbox$ =
    this.showProvidervalidationboxSubject.asObservable();
  isProvidersGridDisplay = true;
  pageSizes = this.healthProvider.gridPageSizes;
  sortValue = this.healthProvider.sortValue;
  sortType = this.healthProvider.sortType;
  sort = this.healthProvider.sort;
  clientCaseId!: string;
  sessionId!: string;
  providersStatus!: StatusFlag;
  showProvidervalidationbox!: boolean;
  historychkBoxChecked = false
  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private checkBoxSubscription!: Subscription;
  private saveForLaterClickSubscription!: Subscription;
  private saveForLaterValidationSubscription!: Subscription;
  constructor(
    private readonly healthProvider: HealthcareProviderFacade,
    private readonly workFlowFacade: WorkflowFacade,
    private readonly loaderService: LoaderService,
    private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  profileClientId!: number;
  clientCaseEligibilityId!: any;
  tabId!: any;
  ngOnInit(): void {
    this.loadQueryParams();
  }

  /** Private properties **/
  loadQueryParams() {
    this.clientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.tabId = this.route.snapshot.queryParams['tid'];
    this.clientCaseId = this.route.snapshot.queryParams['cid'];
  }

  /** Private methods **/

  loadProvidersEvent(gridDataRefinerValue: any): void {
    this.showProvidervalidationboxSubject.next(false);
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };

    this.pageSizes = this.healthProvider.gridPageSizes;
    this.healthProvider.loadHealthCareProviders(
      this.clientId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType,
      this.historychkBoxChecked
    );   
  }

  onHistoryChkBoxChanged() {    
    this.historychkBoxChecked = !this.historychkBoxChecked;
    this.healthProvider.loadHealthCareProviders(
      this.clientId,
       0,
      5,
      this.sortValue,
      this.sortType,
      this.historychkBoxChecked
    );
  }

  private removeHealthCareProvider(clientProviderId: string) {
    this.healthProvider.removeHealthCareProviders(clientProviderId, true);
  }

  /** Private Methods **/

  /** events from child components**/
  handlePrvRemove(clientProviderId: string) {
    this.removeHealthCareProvider(clientProviderId);
  }
  handlePrvDeacivate(clientProviderId: string) {    
    this.healthProvider.removeHealthCareProviders(clientProviderId, false);
  }

  handlePrvReactivate(clientProviderId: string) {
    this.healthProvider.reActivateHealthCareProvider(clientProviderId);
  }

  searchTextEventHandleer(text: string) {
    this.healthProvider.searchHealthCareProviders(text, this.clientId);
  }

  addExistingProviderEventHandler(existProviderData: any) {
    existProviderData.clientId = this.clientId;
    this.healthProvider.addExistingHealthCareProvider(existProviderData);
  }

  getExistingProviderEventHandler(clientProviderId: string) {
    if (clientProviderId) {
      this.healthProvider.loadExistingHealthCareProvider(
        clientProviderId
      );
    }
  }

  checkValidations() {
    this.providersStatus =
      this.isProvidersGridDisplay ?? false ? StatusFlag.Yes : StatusFlag.No;
    if (this.showProvidervalidationbox && !this.isProvidersGridDisplay) {
      this.showProvidervalidationboxSubject.next(true);
      return false;
    }
    return true;
  }
}
