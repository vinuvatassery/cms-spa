/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-profile-cer-tracking-page',
  templateUrl: './profile-cer-tracking-page.component.html',
  styleUrls: ['./profile-cer-tracking-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCerTrackingPageComponent implements OnInit {
  /** Public properties **/
  cer$ = this.cerTrackingFacade.cer$;

  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadCer();
  }

  /** Private methods **/
  private loadCer(): void {
    this.cerTrackingFacade.loadCer();
  }
}
