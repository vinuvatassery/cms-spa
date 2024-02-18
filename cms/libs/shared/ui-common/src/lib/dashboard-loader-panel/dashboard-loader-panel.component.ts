/** Angular **/
import {    Component,    ViewEncapsulation,    ChangeDetectionStrategy  } from '@angular/core';

  @Component({
    selector: 'common-dashboard-loader-panel',
    templateUrl: './dashboard-loader-panel.component.html',
    styleUrls: ['./dashboard-loader-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class DashboardLoaderPanelComponent  {
  }