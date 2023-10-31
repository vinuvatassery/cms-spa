/** Angular **/
import {  Component } from '@angular/core';
 

@Component({
  selector: 'cms-vendor-refund-selected-premium-list',
  templateUrl: './vendor-refund-selected-premium-list.component.html', 
})
export class VendorRefundSelectedPremiumListComponent {
  selectedPremium =[
    {
    coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
    warrant:'XXXXXXXXX', 
    amountPaid:'XXXXXXXXX', 
    groupID:'XXXXXXXXX', 
    paymentID:'XXXXXXXXX', 
    pmtMethod:'ACH', 
    pmtStatus:'Recon', 
    PCA:'XXXXXX', 
    mailCode:'XXXX',   
    by: 'by',
  },

];
}
