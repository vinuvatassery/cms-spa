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

  saveHealthInsurancePolicy(healthInsurancePolicy: healthInsurancePolicy) {
    const formData = new FormData();
    if (!!healthInsurancePolicy?.copyOfInsuranceCardFile) {
      formData.append('CopyOfInsuranceCardFile', healthInsurancePolicy?.copyOfInsuranceCardFile ?? '');
    }
    if (!!healthInsurancePolicy?.copyOfSummaryFile) {
      formData.append('CopyOfSummaryFile', healthInsurancePolicy?.copyOfSummaryFile ?? '');
    }
    if (!!healthInsurancePolicy?.proofOfPremiumFile) {
      formData.append('ProofOfPremiumFile', healthInsurancePolicy?.proofOfPremiumFile ?? '');
    }
    this.FormData_append_object(formData, healthInsurancePolicy);

    return this.healthInsurancePolicyService.saveHealthInsurancePolicy(formData);
  }
  updateHealthInsurancePolicy(healthInsurancePolicy: any) {
    const formData = new FormData();
    if (!!healthInsurancePolicy?.copyOfInsuranceCardFile) {
      formData.append('CopyOfInsuranceCardFile', healthInsurancePolicy?.copyOfInsuranceCardFile ?? '');
    }
    if (!!healthInsurancePolicy?.copyOfSummaryFile) {
      formData.append('CopyOfSummaryFile', healthInsurancePolicy?.copyOfSummaryFile ?? '');
    }
    if (!!healthInsurancePolicy?.proofOfPremiumFile) {
      formData.append('ProofOfPremiumFile', healthInsurancePolicy?.proofOfPremiumFile ?? '');
    }
    this.FormData_append_object(formData, healthInsurancePolicy);

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

  FormData_append_object(fd: FormData, obj: any, key?: any) {
    var i, k;
    for (i in obj) {
      k = key ? key + '[' + i + ']' : i;
      if (obj[i] instanceof File) {
        continue;
      }
      else if (typeof obj[i] == 'object') {
        this.FormData_append_object(fd, obj[i], k);
      }
      else {
        fd.append(k, obj[i]);
        console.log(obj[i])
      }
    }
  }

}
