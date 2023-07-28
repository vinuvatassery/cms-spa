import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-medical-premiums-recent-premiums-list',
  templateUrl: './medical-premiums-recent-premiums-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsRecentPremiumsListComponent {
  recentPremiumsGridLists$: any;
}
