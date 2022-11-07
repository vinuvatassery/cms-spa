/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-friend-or-family-detail',
  templateUrl: './friend-or-family-detail.component.html',
  styleUrls: ['./friend-or-family-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendOrFamilyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isFriendsorFamilyEditValue!: boolean;

  /** Public properties **/
  ddlRelationshipToClient$ = this.contactfacade.ddlRelationshipToClient$;

  /** Constructor **/
  constructor(private readonly contactfacade: ContactFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlRelationshipToClient();
  }

  /** Private methods **/
  private loadDdlRelationshipToClient() {
    this.contactfacade.loadDdlRelationshipToClient();
  }
}
