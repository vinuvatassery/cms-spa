/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades  **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-phone-detail',
  templateUrl: './phone-detail.component.html',
  styleUrls: ['./phone-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditValue!: boolean;

  /** Public properties **/
  ddlPhoneTypes$ = this.contactFacade.ddlPhoneTypes$;
  isDeactivateValue!: boolean;
  isDeactivatePhoneNumberPopup = true;

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlPhoneType();
  }

  /** Private methods **/
  private loadDdlPhoneType() {
    this.contactFacade.loadDdlPhoneType();
  }

  /** Internal event methods **/
  onDeactivateClicked() {
    this.isDeactivateValue = true;
    this.isDeactivatePhoneNumberPopup = true;
  }

  onDeactivatePhoneNumberClosed() {
    this.isDeactivatePhoneNumberPopup = !this.isDeactivatePhoneNumberPopup;
  }
}
