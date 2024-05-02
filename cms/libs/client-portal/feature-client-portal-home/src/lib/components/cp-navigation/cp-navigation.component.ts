import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'client-portal-cp-navigation',
  templateUrl: './cp-navigation.component.html',
  styleUrls: ['./cp-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpNavigationComponent {}
