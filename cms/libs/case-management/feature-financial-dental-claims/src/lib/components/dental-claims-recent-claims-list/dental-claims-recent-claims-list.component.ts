import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-dental-claims-recent-claims-list',
  templateUrl: './dental-claims-recent-claims-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsRecentClaimsListComponent {
  recentClaimsGridLists$: any;
}
