/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-cer-tracking-page',
  templateUrl: './cer-tracking-page.component.html',
  styleUrls: ['./cer-tracking-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerTrackingPageComponent implements OnInit {
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
