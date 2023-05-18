import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa'
@Component({
  selector: 'cms-financial-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorsListComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
@Input() vendorTypeCode! : string
constructor(private route: Router,private activeRoute : ActivatedRoute) {
 
}

  onVendorClicked()
  {
    this.route.navigate(['profile'], {relativeTo: this.activeRoute})
  }

}
