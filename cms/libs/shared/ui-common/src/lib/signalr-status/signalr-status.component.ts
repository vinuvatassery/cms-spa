/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Services **/
import { SignalrService } from '@cms/shared/util-signalr';

@Component({
  selector: 'common-signalr-status',
  templateUrl: './signalr-status.component.html',
  styleUrls: ['./signalr-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalrStatusComponent {
  /** Public properties **/
  status$ = this.signalrService.signalrEvents$;

  /** Constructor **/
  constructor(private readonly signalrService: SignalrService) {}
}
