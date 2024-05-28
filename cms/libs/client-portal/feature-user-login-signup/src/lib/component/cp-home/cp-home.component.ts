import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'client-portal-cp-home',
  templateUrl: './cp-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpHomeComponent {}
