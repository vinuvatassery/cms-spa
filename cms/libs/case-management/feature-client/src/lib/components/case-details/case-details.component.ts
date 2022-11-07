/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** Facades **/
import { ClientFacade } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'case-management-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsComponent implements OnInit {
  currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Public properties **/
  ddlCaseOrigins$ = this.clientFacade.ddlCaseOrigins$;

  /** Constructor **/
  constructor(private readonly clientFacade: ClientFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlCaseOrigin();
  }

  /** Private methods **/
  private loadDdlCaseOrigin() {
    this.clientFacade.loadDdlCaseOrigin();
  }
}
