/** Angular **/
import {    Component,    ViewEncapsulation,    ChangeDetectionStrategy  } from '@angular/core';

  @Component({
    selector: 'common-dashboard-loader-panel',
    templateUrl: './dashboard-loader-panel.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class DashboardLoaderPanelComponent  {
  }