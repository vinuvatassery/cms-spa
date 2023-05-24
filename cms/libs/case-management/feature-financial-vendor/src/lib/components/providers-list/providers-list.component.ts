import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa'
@Component({
  selector: 'cms-financial-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvidersListComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
@Input() vendorTypeCode! : string
constructor(private route: Router,private activeRoute : ActivatedRoute) {
 
}

onProviderClicked()
  {
    this.route.navigate(['provider-profile'], {relativeTo: this.activeRoute})
  }

}
