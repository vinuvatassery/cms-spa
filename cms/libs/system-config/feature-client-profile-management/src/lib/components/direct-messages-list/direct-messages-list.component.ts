import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-direct-messages-list',
  templateUrl: './direct-messages-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessagesListComponent {}
