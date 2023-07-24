import { ChangeDetectionStrategy, Component } from '@angular/core'; 

@Component({
  selector: 'cms-medical-claims-recent-claims-list',
  templateUrl: './medical-claims-recent-claims-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsRecentClaimsListComponent {
  recentClaimsGridLists$: any;
}
