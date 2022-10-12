/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-deactivate-friend-or-family-confirmation',
  templateUrl: './deactivate-friend-or-family-confirmation.component.html',
  styleUrls: ['./deactivate-friend-or-family-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateFriendOrFamilyConfirmationComponent implements OnInit {
  /** Public properties **/
  ddlRelationshipToClient$ = this.contactFacade.ddlRelationshipToClient$;

  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlRelationshipToClientData();
  }

  /** Private methods **/
  private loadDdlRelationshipToClientData() {
    this.contactFacade.loadDdlRelationshipToClient();
  }
}
