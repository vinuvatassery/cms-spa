/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ClientEligibilityFacade } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'case-management-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent implements OnInit {
 currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Public properties **/
  ddlGroups$ = this.clientEligibilityFacade.ddlGroups$;

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlGroups();
  }

  /** Private methods **/
  private loadDdlGroups() {
    this.clientEligibilityFacade.loadDdlGroups();
  }
}
