import { ChangeDetectionStrategy, Component, Input, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { VendorFacade, HealthInsurancePolicyFacade, InsurancePlanFacade, InsuranceStatusType,VendorTypeCode } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-vendor-name',
  templateUrl: './vendor-name.component.html',
  styleUrls: ['./vendor-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorNameComponent  implements OnInit
{
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() insuranceStatus:any;

  // @Output() insuranceCarrierNameChange = new EventEmitter<any>();
  // @Output() insuranceCarrierNameData = new EventEmitter<any>();
public isaddNewInsuranceProviderOpen =false;
public isLoading =false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  carrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  constructor(
    private formBuilder: FormBuilder,
    private readonly vendorFacade: VendorFacade,
    private readonly insurancePlanFacade:InsurancePlanFacade,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.healthInsuranceForm = this.formBuilder.group({     
      vendorName:['']
    });
  }

  ngOnInit(): void {
    debugger;
    if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) {
      this.loadInsuranceCarrierName(InsuranceStatusType.dentalInsurance);   
    }
    else{  
       this.loadInsuranceCarrierName(InsuranceStatusType.healthInsurance);   
    }
  }

  private loadInsuranceCarrierName(type:string) {
    this.isLoading=true;
    this.vendorFacade.loadAllVendors(type,VendorTypeCode.InsuranceVendor).subscribe({
      next: (data: any) => {
        if (!Array.isArray(data)) return;
        this.sortCarrier(data);   
        //this.insuranceCarrierNameData.emit(this.carrierNames);
        this.isLoading=false;  
        this.cd.detectChanges();
        //this.insurancePlanFacade.planLoaderSubject.next(false);    
      },
      error: (error: any) => { 
        this.isLoading=false;
        this.cd.detectChanges();
      }
  });
  }
  private sortCarrier(data:any){
    this.carrierNames = data.sort((a: any, b: any) => {
    if(a.vendorName > b.vendorName) return 1;
    return (b.vendorName > a.vendorName) ? -1 : 0;
    });
  }


  public addNewInsuranceProviderClose(): void {
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.isaddNewInsuranceProviderOpen = true;
  }
}