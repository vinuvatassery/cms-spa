import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  styleUrls: ['./financial-vendor-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialVendorProfileComponent implements OnInit{

  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  vendorId! : string
  providerId! : string

  addressGridView = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
 

  constructor(private activeRoute : ActivatedRoute){}

  ngOnInit(): void {
    this. loadQueryParams()   
  }
     /** Private properties **/
     loadQueryParams()
     {
       this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
       this.providerId = this.activeRoute.snapshot.queryParams['prv_id'];  
         
     }
  
}
