import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable } from 'rxjs';

@Component({
  selector: 'cms-financial-premiums-provider-info',
  templateUrl: './financial-premiums-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsProviderInfoComponent {

  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Output() onEditProviderProfileEvent = new EventEmitter<any>();
  @Input() paymentMethodCode$ : Observable<any> | undefined;
  @Input()
  vendorProfile$: Observable<any> | undefined;
  @Input() updateProviderPanelSubject$ : Observable<any> | undefined;
  @Input() ddlStates$ : Observable<any> | undefined;
 
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isEditProvider = false;
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
  editProviderClicked(){
    this.isEditProvider = !this.isEditProvider
  }
}
