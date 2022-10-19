/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-health-care-provider-detail',
  templateUrl: './health-care-provider-detail.component.html',
  styleUrls: ['./health-care-provider-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderDetailComponent implements OnInit {
  /** Public properties **/
  ddlStates$ = this.providerFacade.ddlStates$;

  /** Constructor **/
  constructor(private readonly providerFacade: ManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlStates();
  }

  /** Private methods **/
  private loadDdlStates() {
    this.providerFacade.loadDdlStates();
  }
}
