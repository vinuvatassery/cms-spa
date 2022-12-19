/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/** Data services **/
import { SnackBar } from '@cms/shared/ui-common';
import { NotificationSnackbarService,SnackBarNotificationType,LoggingService,LoaderService } from '@cms/shared/util-core';
import { healthInsurancePolicy } from '../entities/health-insurance-policy';
import{HealthInsurancePolicyDataService} from '../infrastructure/health-insurance-policy.data.service';


@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyFacade {
 
  /** Public properties **/ 
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  healthFacadesnackbar$ = this.snackbarSubject.asObservable();

  
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

  /** Constructor**/
  constructor( private readonly notificationSnackbarService : NotificationSnackbarService,
    private loggingService : LoggingService,private readonly loaderService: LoaderService,
   private healthInsurancePolicyService:HealthInsurancePolicyDataService) {}

  /** Public methods **/
  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }
 
  saveHealthInsurancePolicy(healthInsurancePolicy:healthInsurancePolicy) {
      return this.healthInsurancePolicyService.saveHealthInsurancePolicy(healthInsurancePolicy);
  }
  
}
