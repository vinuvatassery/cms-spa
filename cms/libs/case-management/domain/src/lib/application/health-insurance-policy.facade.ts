/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { SnackBar } from '@cms/shared/ui-common';
import { NotificationSnackbarService, SnackBarNotificationType, LoggingService, LoaderService } from '@cms/shared/util-core';
import { healthInsurancePolicy } from '../entities/health-insurance-policy';
import { HealthInsurancePolicyDataService } from '../infrastructure/health-insurance-policy.data.service';


@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyFacade {

  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  //healthInsurancePolicySubject = new Subject<SnackBar>();
  private healthInsurancePolicySubject = new Subject<healthInsurancePolicy>();
  healthFacadesnackbar$ = this.snackbarSubject.asObservable();
  healthInsurancePolicy$ = this.healthInsurancePolicySubject.asObservable();


  ShowHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.HideLoader();

  }

  /** Constructor**/
  constructor(private readonly notificationSnackbarService: NotificationSnackbarService,
    private loggingService: LoggingService, private readonly loaderService: LoaderService,
    private healthInsurancePolicyService: HealthInsurancePolicyDataService) { }

  /** Public methods **/
  ShowLoader() {
    this.loaderService.show();
  }

  HideLoader() {
    this.loaderService.hide();
  }

  saveHealthInsurancePolicy(healthInsurancePolicy: any) {
    const formData: any = new FormData();
    for (var key in healthInsurancePolicy) {
      formData.append(key, healthInsurancePolicy[key]);
    }
    return this.healthInsurancePolicyService.saveHealthInsurancePolicy(formData);
  }
  updateHealthInsurancePolicy(healthInsurancePolicy: any) {
    const formData: any = new FormData();
    for (var key in healthInsurancePolicy) {
      formData.append(key, healthInsurancePolicy);
    }
    return this.healthInsurancePolicyService.updateHealthInsurancePolicy(formData);
  }

  getCarrierContactInfo(carrierId: any) {
    return this.healthInsurancePolicyService.getCarrierContactInfo(carrierId);
  }

  getHealthInsurancePolicyById(clientInsurancePolicyId: string): void {
    this.healthInsurancePolicyService.getHealthInsurancePolicyById(clientInsurancePolicyId).subscribe({
      next: (response) => {
        this.healthInsurancePolicySubject.next(response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

}
