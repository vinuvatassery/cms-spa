import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-financial-page',
  templateUrl: './financial-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPageComponent {
 
  isInnerLeftMenuOpen = false;
  constructor(
    route: Router,
    activeRoute: ActivatedRoute,
    private caseFacade: CaseFacade
  ) {
    route.navigate(['vendors'], { relativeTo: activeRoute });
  }

  openInnerLeftMenu() {
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen;
  }
}
