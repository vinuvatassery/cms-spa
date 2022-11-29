/** Angular **/
import { Component } from '@angular/core';

@Component({
  selector: 'cms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  /** Public properties **/
  isSideMenuToggled = true;
  isOpenMobileMenu = false;

  /** Internal event methods **/
  onSideMenuToggleClicked() {
    this.isSideMenuToggled = !this.isSideMenuToggled;
  }

  openMobileMenu(){
      this.isOpenMobileMenu = !this.isOpenMobileMenu
  }
}
