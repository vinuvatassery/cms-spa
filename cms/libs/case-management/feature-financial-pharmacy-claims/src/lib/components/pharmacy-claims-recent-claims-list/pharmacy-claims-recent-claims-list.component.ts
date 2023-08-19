import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-pharmacy-claims-recent-claims-list',
  templateUrl: './pharmacy-claims-recent-claims-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsRecentClaimsListComponent {
  recentClaimsGridLists$: any;
}
