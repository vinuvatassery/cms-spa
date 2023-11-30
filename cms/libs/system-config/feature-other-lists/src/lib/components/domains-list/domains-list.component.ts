import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-domains-list',
  templateUrl: './domains-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainsListComponent {}
