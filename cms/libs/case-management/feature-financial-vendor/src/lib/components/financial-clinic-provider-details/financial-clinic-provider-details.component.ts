import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-clinic-provider-details',
  templateUrl: './financial-clinic-provider-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderDetailsComponent {
  @Output() clickCloseAddEditProvidersDetails = new EventEmitter();
  @Output() removeProviderDetailsClick = new EventEmitter();
  removeProviderOpen = false;
  selectProviderId!: string;
  providerForm!: FormGroup;
  selectedprovider!: any;
  selectedTin: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  searchProvider$ = this.ProviderFacade.searchProvider$;

  constructor(private readonly ProviderFacade: ProviderFacade,
    private formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    this.initproviderform();
  }

  initproviderform() {
    this.providerForm = this.formBuilder.group({
      provider: [this.selectProviderId, Validators.required],
      tin: [this.selectedTin, Validators.required],
    })
  }

  onProviderNameValueChange(event: any) 
  {
    let service = event;
    let providerValid = this.providerForm as FormGroup;
    providerValid.patchValue({
      providerName: service.providerName,
      tin: service.tin,
      providerId: service.vendorId,
    });
    this.providerForm.controls["provider"].setValue(event.providerName)
    this.providerForm.controls["tin"].setValue(event.tin);
    this.providerForm.controls["providerId"].setValue(event.providerId);
    this.changeDetector.detectChanges();
  }

  searchprovider(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.ProviderFacade.searchProvider(searchText);
  }

  saveprovider(provider: any) {
    this.ProviderFacade.addProvider(provider)
  }
}  
