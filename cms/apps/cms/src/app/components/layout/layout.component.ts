/** Angular **/
import { Component } from '@angular/core';

@Component({
  selector: 'cms-layout',
  templateUrl: './layout.component.html',
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
