import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-financial-claims-recent-claims-list',
  templateUrl: './financial-claims-recent-claims-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsRecentClaimsListComponent {
  recentClaimsGridLists$: any;
}
