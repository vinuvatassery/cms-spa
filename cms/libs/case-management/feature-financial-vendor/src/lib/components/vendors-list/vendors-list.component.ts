import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-financial-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorsListComponent {
@Input() vendorTypeCode! : string
constructor(private route: Router,private activeRoute : ActivatedRoute) {
 
}

  onVendorClicked()
  {
    this.route.navigate(['profile'], {relativeTo: this.activeRoute})
  }

}
