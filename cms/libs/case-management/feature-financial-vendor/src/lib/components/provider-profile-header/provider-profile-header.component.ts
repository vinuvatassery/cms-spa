import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-provider-profile-header',
  templateUrl: './provider-profile-header.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderProfileHeaderComponent {

  constructor(private route: Router,private activeRoute : ActivatedRoute) {
 
  }
  
  onBackClicked()
  {
    this.route.navigate(['financial-management/vendors'])
  }
}