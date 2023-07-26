import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-medical-premiums-recent-claims-list',
  templateUrl: './medical-premiums-recent-claims-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsRecentClaimsListComponent {
  recentClaimsGridLists$: any;
}
