import { Injectable } from '@angular/core';
/** Providers **/
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType, LoggingService } from '@cms/shared/util-core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
/** Data services **/
import { PrescriptionDrugDataService } from '../infrastructure/prescription-drug.data.service';



@Injectable({ providedIn: 'root' })
export class PrescriptionDrugFacade {
  /** Private properties **/
  private prescriptionDrugResponseSubject = new BehaviorSubject<any>([]);
  /** Public properties **/

  prescriptionDrugResponse$ = this.prescriptionDrugResponseSubject.asObservable();
  /** Constructor**/
  constructor(
    private readonly prescriptionDrugDataService: PrescriptionDrugDataService,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
  ) { }

  updatePrescriptionDrug(prescriptionDrug: any): Observable<any> {  
    return this.prescriptionDrugDataService.updatePrescriptionDrugService(prescriptionDrug?.clientId, prescriptionDrug).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
        }
        return of(false);
      })
    );
  }

  loadPrescriptionDrug(clientId: number, clientCaseEligibilityId: any) {
    return this.prescriptionDrugDataService.loadPrescriptionDrug(clientId, clientCaseEligibilityId);
  }
}
