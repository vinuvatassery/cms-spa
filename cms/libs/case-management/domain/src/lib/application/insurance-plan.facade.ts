/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InsurancePlanDataService } from '../infrastructure/insurance-plan.data.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class InsurancePlanFacade {

  /** Public properties **/
  planLoaderSubject = new Subject<boolean>();
  planLoaderChange$ = this.planLoaderSubject.asObservable();
  planNameChangeSubject = new Subject<any[]>();
  planNameChange$ = this.planNameChangeSubject.asObservable();
  private updateProviderPanelSubject = new Subject<any>();

  constructor(private readonly insurancePlanDataService: InsurancePlanDataService,
    private readonly loaderService: LoaderService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService
  ) { }

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  /** Public methods **/
  updateProviderPanelSubject$ = this.updateProviderPanelSubject.asObservable();


  loadInsurancePlanByProviderId(insurancePlanId: string, insuranceType: any) {
    return this.insurancePlanDataService.loadInsurancePlanByProviderId(insurancePlanId, insuranceType);
  }

  addPlan(dto: any) {
    return this.insurancePlanDataService.addPlan(dto);
  }

  updateInsurancePlan(insurancePlanDto: any) {
    this.showLoader();
    return this.insurancePlanDataService.updateInsurancePlan(insurancePlanDto).subscribe({
      next: (updatedResponse: any) => {
        if (updatedResponse) {
          this.updateProviderPanelSubject.next(updatedResponse);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, updatedResponse.Message);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

}
