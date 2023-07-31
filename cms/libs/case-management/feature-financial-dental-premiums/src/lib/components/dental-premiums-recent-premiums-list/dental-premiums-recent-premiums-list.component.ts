import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-dental-premiums-recent-premiums-list',
  templateUrl: './dental-premiums-recent-premiums-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsRecentPremiumsListComponent {
  recentPremiumsGridLists$: any;
}
