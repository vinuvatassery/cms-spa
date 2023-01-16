import { Injectable } from '@angular/core';
/** Providers **/
import { ConfigurationProvider, LoaderService ,NotificationSnackbarService, SnackBarNotificationType,LoggingService} from '@cms/shared/util-core';
import { BehaviorSubject, Observable } from 'rxjs';
// entities library
import { PrescriptionDrug } from '../entities/prescription-drug';
/** Data services **/
import { PrescriptionDrugDataService } from '../infrastructure/prescription-drug.data.service';



@Injectable({ providedIn: 'root' })
export class PrescriptionDrugFacade {
  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {      
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }
   /** Private properties **/
   private prescriptionDrugResponseSubject = new BehaviorSubject<any>([]);
    /** Public properties **/
 
    prescriptionDrugResponse$ = this.prescriptionDrugResponseSubject.asObservable();
/** Constructor**/
constructor(
  private readonly prescriptionDrugDataService: PrescriptionDrugDataService,
  private configurationProvider : ConfigurationProvider,
  private loggingService : LoggingService,
  private readonly loaderService: LoaderService,
  private readonly notificationSnackbarService : NotificationSnackbarService,
) {}
HideLoader()
{
  this.loaderService.hide();
}
  updatePrescriptionDrug(prescriptionDrug: any, summaryBenefitFiles: any ): Observable<any> {
    const formData: any = new FormData();
    for (var key in prescriptionDrug) {
        formData.append(key, prescriptionDrug[key]);
    }
    formData.append('SummaryBenefitFiles', summaryBenefitFiles);
    return this.prescriptionDrugDataService.updatePrescriptionDrugService(formData);
  }
  
  loadPrescriptionDrug(clientCaseEligibilityId:any) {
    return this.prescriptionDrugDataService.loadPrescriptionDrug(clientCaseEligibilityId);
  }
}
