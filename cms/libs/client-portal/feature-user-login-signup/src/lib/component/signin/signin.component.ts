import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { eyeIcon, SVGIcon } from "@progress/kendo-svg-icons";
@Component({
  selector: 'client-portal-signin',
  templateUrl: './signin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public current = 0;
  public eyeIcon: SVGIcon = eyeIcon;
  public steps = [
    { label: "Personal Info"},
    { label: "Home Address" },
    { label: "Contact Information" }, 
  ];
}
