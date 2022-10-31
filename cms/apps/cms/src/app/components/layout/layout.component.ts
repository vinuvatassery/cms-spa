/** Angular **/
import { Component } from '@angular/core';

@Component({
  selector: 'cms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  /** Public properties **/
  isSideMenuToggled = false;

  /** Internal event methods **/
  onSideMenuToggleClicked() {
    this.isSideMenuToggled = !this.isSideMenuToggled;
  }
}
