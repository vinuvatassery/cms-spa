/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { DrugPharmacyFacade, PriorityCode, WorkflowFacade } from '@cms/case-management/domain';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-drug-page',
  templateUrl: './drug-page.component.html',
  styleUrls: ['./drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  isBenefitsChanged = true;
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$
  addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
  editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
  removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
  selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
    this.loadClientPharmacies();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.drugPharmacyFacade.save();
    }

    return of(false)
  }

  /** Internal event methods **/
  onBenefitsValueChange() {
    this.isBenefitsChanged = !this.isBenefitsChanged;
  }


  /* Pharmacy */
  private loadClientPharmacies() {
    this.drugPharmacyFacade.loadClientPharmacyList(this.workflowFacade.clientId ?? 0);
    this.clientpharmacies$.subscribe({
      next: (pharmacies) => {
        pharmacies.forEach((pharmacyData: any) => {
          pharmacyData.PharmacyNameAndNumber =
            pharmacyData.PharmacyName + ' #' + pharmacyData.PharmcayId;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }

  addPharmacy(vendorId: string) {
    this.drugPharmacyFacade.addClientPharmacy(this.workflowFacade.clientId ?? 0, vendorId, PriorityCode.Primary);
  }

  editPharmacyInit(vendorId: string) {
    this.drugPharmacyFacade.getPharmacyById(vendorId);
  }

  editPharmacy(data: any) {
    this.drugPharmacyFacade.editClientPharmacy(this.workflowFacade.clientId ?? 0, data?.clientPharmacyId, data?.vendorId, PriorityCode.Primary);
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(this.workflowFacade.clientId ?? 0, clientPharmacyId);
  }
}
