/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { CommunicationFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-communication-page',
  templateUrl: './communication-page.component.html',
  styleUrls: ['./communication-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationPageComponent implements OnInit {
  /** Public properties **/
  emails$ = this.communicationFacade.emails$;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEmails();
  }

  /** Private methods **/
  private loadEmails(): void {
    this.communicationFacade.loadEmails();
  }
}
