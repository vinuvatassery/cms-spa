import { Component, Input } from '@angular/core';

@Component({
  selector: 'case-management-medical-carrier-contact-info',
  templateUrl: './medical-carrier-contact-info.component.html',
  styleUrls: ['./medical-carrier-contact-info.component.scss'],
})
export class MedicalCarrierContactInfoComponent {
  @Input() carrierContactInfo: any;
  @Input() insurancePlan: any;
}
