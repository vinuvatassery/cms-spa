import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialPremiumsFacade } from '@cms/case-management/domain';
import { WidgetFacade } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-widget-quick-links',
  templateUrl: './widget-quick-links.component.html',
  styleUrls: ['./widget-quick-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetQuickLinksComponent {
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade,
     private route: Router,
     private readonly financialClaimsFacade: FinancialClaimsFacade,
     private readonly financialPremiumsFacade: FinancialPremiumsFacade,
     private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }

  navigateToClaims(type:any){
    this.financialClaimsFacade.selectedClaimsTab = 1;
    this.route.navigate(['/financial-management/claims/'+type]);
  }
  navigateToPremiums(type:any){
   this.financialPremiumsFacade.selectedClaimsTab = 1
   this.route.navigate(['/financial-management/premiums/'+type]);
  }

  navigateToPharmacyClaims(){
    this.financialPharmacyClaimsFacade.selectedClaimsTab =1
    this.route.navigate(['/financial-management/pharmacy-claims']);
  }

  navigateToVendorRefunds(){
    this.route.navigate(['/financial-management/vendor-refund']);
  }

  navigateToVendorProfile(){
    this.route.navigate(['/financial-management/vendors']);
  }
}
