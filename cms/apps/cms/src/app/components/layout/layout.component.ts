/** Angular **/
import { Component} from '@angular/core';
import { UserDataService } from '@cms/system-config/domain';

@Component({
  selector: 'cms-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

 constructor(private readonly userDataService: UserDataService){}

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
