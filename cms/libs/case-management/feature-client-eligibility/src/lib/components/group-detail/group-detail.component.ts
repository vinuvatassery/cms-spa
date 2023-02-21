/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ClientEligibilityFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'case-management-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent implements OnInit {
 currentDate = new Date();
 public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Public properties **/
  ddlGroups$ = this.clientEligibilityFacade.ddlGroups$;

  /** Constructor **/
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }

  /** Private methods **/
}
