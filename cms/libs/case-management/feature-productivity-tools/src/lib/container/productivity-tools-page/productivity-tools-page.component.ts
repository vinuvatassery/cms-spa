import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CaseFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-productivity-tools-page',
  templateUrl: './productivity-tools-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductivityToolsPageComponent {

  isInnerLeftMenuOpen = false;
  constructor(
    route: Router,
    activeRoute: ActivatedRoute,
    private caseFacade: CaseFacade
  ) {
   
  }
 
    
}
