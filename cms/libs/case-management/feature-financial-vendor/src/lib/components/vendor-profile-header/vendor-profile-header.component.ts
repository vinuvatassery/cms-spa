import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-vendor-profile-header',
  templateUrl: './vendor-profile-header.component.html',
  styleUrls: ['./vendor-profile-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorProfileHeaderComponent {

  constructor(private route: Router,private activeRoute : ActivatedRoute) {
 
  }
  
  onBackClicked()
  {
    this.route.navigate(['financial-management/vendors'])
  }
}
