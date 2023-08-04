import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
} from '@angular/core';
import { FinancialVendorFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-claims-provider-info',
  templateUrl: './financial-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Input() vendorId:any
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$ 
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isEditProvider = false;
  
  constructor( private financialVendorFacade : FinancialVendorFacade){

  } 
  ngOnInit(): void { 
    this.loadVendorInfo()
  }

  loadVendorInfo() {
    this.financialVendorFacade.getProviderPanel('5449D739-5C70-446B-8269-13A862FE771F')
  }
 

  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
  editProviderClicked(){
    this.isEditProvider = !this.isEditProvider
  }
}
