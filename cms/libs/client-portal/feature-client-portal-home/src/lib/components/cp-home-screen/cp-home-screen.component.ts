import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'client-portal-cp-home-screen',
  templateUrl: './cp-home-screen.component.html',
  styleUrls: ['./cp-home-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpHomeScreenComponent {}
