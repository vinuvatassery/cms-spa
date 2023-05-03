/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ClientFacade, CaseFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-special-handling',
  templateUrl: './special-handling.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialHandlingComponent implements OnInit {
  /** Public properties **/
  specialHandlings$ = this.clientFacade.specialHandlings$;
  isEditSpecialHandlingPopup = false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  /** Constructor**/
  constructor(private clientFacade: ClientFacade,
    private caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSpecialHandlings();
  }

  /** Private methods **/
  private loadSpecialHandlings() {
    this.clientFacade.loadSpecialHandlings();
  }

  /** Internal event methods **/
  onEditSpecialHandlingClosed() {
    this.isEditSpecialHandlingPopup = false;
  }

  onEditSpecialHandlingClicked() {
    this.isEditSpecialHandlingPopup = true;
  }
}
