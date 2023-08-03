import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-financial-premiums-recent-premiums-list',
  templateUrl: './financial-premiums-recent-premiums-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsRecentPremiumsListComponent {
  recentPremiumsGridLists$: any;
}
