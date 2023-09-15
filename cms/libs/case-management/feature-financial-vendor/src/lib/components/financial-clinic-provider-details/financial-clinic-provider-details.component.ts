import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  ProviderFacade } from '@cms/case-management/domain';
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
  proId='';
  @Input() ParentVendorId :any
  @Output() closeProviderEvent = new EventEmitter();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  searchProvider$ = this.providerFacade.searchProvider$;
  providerLoaderVisibility$ =
  this.providerFacade.providerLoaderVisibility$;
  isValidateForm: boolean = false;
  constructor(private readonly providerFacade: ProviderFacade,
    private formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    this.initproviderform();
  }
  ngOnInit() {
    this.initproviderform();
    }  

  initproviderform() {
    this.providerForm = this.formBuilder.group({
      provider: new FormControl('', [Validators.required]),
      tin: new FormControl('', []),
    })
  }
  get ProviderFormControls() {
    return this.providerForm.controls as any;
  }

  onProviderNameValueChange(event: any) 
  { 
    let service = event;
    let providerValid = this.providerForm as FormGroup;
    providerValid.patchValue({
      providerName: service.providerName,
      tin: service.tin,
      providerId: service.providerId,
    });
    this.providerForm.controls["provider"].setValue(event.providerName)
    this.providerForm.controls["tin"].setValue(event.tin);
    this.proId=service.providerId;
    this.changeDetector.detectChanges();
  }

  searchprovider(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.providerFacade.searchProvider(searchText);
  }

  saveprovider() {
    let data = 
    {
      ParentVendorId: this.ParentVendorId,
      vendorId:this.proId
    }
    this.isValidateForm = true

    if (this.providerForm.valid){
      if(data)  
      {
        this.providerFacade.addProvider(data);
        this.closeProviderPopup();
      }
      this.providerFacade.addProvider(data);
     }
  }
  closeProviderPopup(){
    this.closeProviderEvent.emit(true);
  }
}  
