import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { eyeIcon, SVGIcon } from "@progress/kendo-svg-icons";
@Component({
  selector: 'client-portal-account-setup',
  templateUrl: './account-setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSetupComponent {

 
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public current = 0;
  public eyeIcon: SVGIcon = eyeIcon;
  popupClassMultiSelect = 'multiSelectSearchPopup';
  public steps = [
    { label: "Personal Info"},
    { label: "Home Address" },
    { label: "Contact Information" }, 
  ];

  nextProcess(){
   if(this.current >= 0 && this.current <= this.steps.length){
    this.current = this.current + 1;
   }
  }
  previousProcess(){
    if(this.current >= 0 && this.current <= this.steps.length){
      this.current = this.current - 1;
     }
    
  }
}
