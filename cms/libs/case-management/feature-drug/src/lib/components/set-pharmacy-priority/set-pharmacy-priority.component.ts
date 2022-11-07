/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
/** Facades **/
import { DrugPharmacyFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-set-pharmacy-priority',
  templateUrl: './set-pharmacy-priority.component.html',
  styleUrls: ['./set-pharmacy-priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPharmacyPriorityComponent implements OnInit {
  /** Output properties  **/
  @Output() closeChangePriority = new EventEmitter();

  /** Public properties **/
  ddlPriorities$ = this.drugPharmacyFacade.ddlPriorities$;

  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadPriorities();
  }

  /** Private methods **/
  private loadPriorities() {
    this.drugPharmacyFacade.loadDdlPriorities();
  }

  /** Internal event methods **/
  onCloseChangePriorityClicked() {
    this.closeChangePriority.emit();
  }
}
