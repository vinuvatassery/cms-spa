import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'cms-medical-claims-all-payments-list',
  templateUrl: './medical-claims-all-payments-list.component.html',
  styleUrls: ['./medical-claims-all-payments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsAllPaymentsListComponent {
  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'check',
      click: (data: any): void => {
         
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
       
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Print Authorizations',
      icon: 'print',
      click: (data: any): void => {
       
      },
    },
  ];
}
