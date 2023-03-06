/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'case-management-address-detail',
  templateUrl: './address-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressDetailComponent implements OnInit {
 
  public currentDate = new Date();
  public formUiStyle : UIFormStyle = new UIFormStyle();
 
  /** Input properties**/
  @Input() isEditValue!: boolean;

  /** Public properties **/
  ddlCountries$ = this.contactFacade.ddlCountries$;
  ddlStates$ = this.contactFacade.ddlStates$;
  ddlAddressTypes$ = this.contactFacade.ddlAddressTypes$;
  isDeactivateValue!: boolean;
  isDeactivateAddressPopup = true;
  isAddressLine1Disabled = true;
  isAddressLine2Disabled = true;
  isZIPDisabled = true;
  isCityDisabled = true;
  isStateDisabled = true;
  isCoutryDisabled = true;
  isEffectiveDateDisabled = true;

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlAddressType();
    this.loadDdlStates();
    this.onEditAddressClicked();
  }

  /** Private methods **/
  private loadDdlAddressType() {
    this.contactFacade.loadDdlAddressType();
  }

  private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }

  private onEditAddressClicked() {
    if (!this.isEditValue) {
      this.isAddressLine1Disabled = true;
      this.isAddressLine2Disabled = true;
      this.isZIPDisabled = true;
      this.isCityDisabled = true;
      this.isStateDisabled = true;
      this.isCoutryDisabled = true;
    }
  }

  /** Internal event methods **/
  onDeactivateAddressClosed() {
    this.isDeactivateAddressPopup = false;
  }

  onDeactivateClicked() {
    this.isDeactivateValue = true;
    this.isDeactivateAddressPopup = true;
  }

  onDdlAddressTypeValueChange(event: any) {
    switch (event) {
      case 'UnHoused':
        this.isAddressLine1Disabled = true;
        this.isAddressLine2Disabled = true;
        this.isZIPDisabled = true;
        break;

      case 'Home':
        this.isAddressLine1Disabled = false;
        this.isAddressLine2Disabled = false;
        this.isZIPDisabled = false;
        this.isCityDisabled = false;
        this.isStateDisabled = false;
        this.isCoutryDisabled = false;
        this.isEffectiveDateDisabled = false;
        break;
    }
  }
}
