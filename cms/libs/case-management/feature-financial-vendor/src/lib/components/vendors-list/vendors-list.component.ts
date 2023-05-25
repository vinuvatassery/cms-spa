import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa'
@Component({
  selector: 'cms-financial-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorsListComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
@Input() financeTabTypeCode! : string

vndorId! : string

constructor(private route: Router) {
 
}

  onVendorClicked()
  {
    const query = {
      queryParams: {
        v_id: '5FC56173-D137-4203-891E-D856958D8AB4' ,
        tab_code :  this.financeTabTypeCode    
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query )
  }

}
