import { ChangeDetectionStrategy, Component } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-financial-page',
  templateUrl: './financial-page.component.html',
  styleUrls: ['./financial-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialPageComponent {
  // new profile button
  // financial-navigation component
  //  router outlet
  //  reminder component(reuse)
  isInnerLeftMenuOpen = false;
  constructor(route: Router, activeRoute : ActivatedRoute) {
    route.navigate(['vendors'], {relativeTo: activeRoute})
  }

  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
