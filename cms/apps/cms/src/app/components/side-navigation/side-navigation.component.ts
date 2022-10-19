/** Angular **/
import { Component } from '@angular/core';

@Component({
  selector: 'cms-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent {
  /** Public properties **/
  isProductivityMenuActivated = false;

  /** Internal event methods **/
  onSubMenuClicked(menu: string) {
    switch (menu) {
      case 'Home':
        this.isProductivityMenuActivated = false;
        break;
      case 'Cases':
        this.isProductivityMenuActivated = false;
        break;
      case 'Productivity Tools':
        this.isProductivityMenuActivated = true;
        break;
      case 'Financial Management':
        this.isProductivityMenuActivated = false;
        break;
      case 'System Config':
        this.isProductivityMenuActivated = false;
        break;
      default:
        this.isProductivityMenuActivated = false;
    }
  }
}
