import { Component, Input, ChangeDetectorRef, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import {  LovFacade } from '@cms/system-config/domain';
import { InsurancePlanFacade, HealthInsurancePolicyFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-medical-premium-detail-insurance-plan-name',
  templateUrl: './medical-premium-detail-insurance-plan-name.component.html',
  styleUrls: ['./medical-premium-detail-insurance-plan-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailInsurancePlanNameComponent {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() insurancePlans :any;
  insurancePlansLoader: boolean = true;
  insurancePlan:Array<any> = [];

  
  public isaddNewInsurancePlanOpen = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  CarrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  constructor(private formBuilder: FormBuilder,private readonly lovFacade: LovFacade,private readonly insurancePlanFacade:InsurancePlanFacade,
    private changeDetector: ChangeDetectorRef, private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService, private insurancePolicyFacade: HealthInsurancePolicyFacade) {
    this.healthInsuranceForm = this.formBuilder.group({ insuranceCarrierName: [''] });
  }
  
  ngOnInit(): void {
    this.loadInsurancePlans();
  }
  public addNewInsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }
  private loadInsurancePlans(){   
    this.insurancePlanFacade.planLoaderChange$.subscribe((data)=>{
      this.insurancePlansLoader = data;
      this.changeDetector.detectChanges();     
    })
    this.insurancePlanFacade.planNameChange$.subscribe({          
           next: (data: any) => {
             this.insurancePlansLoader = false; 
             this.insurancePlans = data;
            this.changeDetector.detectChanges();       
           },
          error: (err) => {
            this.insurancePlansLoader = false;           
            this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            this.loggingService.logException(err);
            this.changeDetector.detectChanges();
          }
         });
    }

}
