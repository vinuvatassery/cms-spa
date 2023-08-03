import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
} from '@angular/core';
import { FinancialVendorFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-financial-claims-provider-info',
  templateUrl: './financial-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Input() vendorId:any
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$ 
  constructor( private financialVendorFacade : FinancialVendorFacade){

  } 
  ngOnInit(): void { 
    this.loadVendorInfo()
  }

  loadVendorInfo() {
    this.financialVendorFacade.getProviderPanel(this.vendorId)
  }
 
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
}
