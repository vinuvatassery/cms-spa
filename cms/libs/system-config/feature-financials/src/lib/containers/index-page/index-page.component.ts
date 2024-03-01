import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-index-page',
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent {}
