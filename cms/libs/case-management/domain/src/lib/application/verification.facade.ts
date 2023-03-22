/** Angular **/
import { Injectable } from '@angular/core';
/** External Libraries **/
import { Observable, Subject } from 'rxjs';
/** Internal Libraries **/
import { NotificationSnackbarService, SnackBarNotificationType, LoggingService, LoaderService } from '@cms/shared/util-core';
import { ClientHivVerification } from '../entities/client-hiv-verification';
import { VerificationDataService } from '../infrastructure/verification.data.service';

@Injectable({ providedIn: 'root' })
export class VerificationFacade {

  constructor(private readonly verificationDataService: VerificationDataService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService) { }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();

  }
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  private providerChange = new Subject<string>();

  /** Public properties **/
  providerValue$ = this.providerChange.asObservable();

  providerValueChange(provider: string) {
    this.providerChange.next(provider);
  }
  save(clientHivVerification: ClientHivVerification): Observable<any> {
    return this.verificationDataService.save(clientHivVerification);
  }
  getHivVerification(clientId:any){
    return this.verificationDataService.getHivVerification(clientId);
  }
}
