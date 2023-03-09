/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { ContactFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'case-management-friend-or-family-detail',
  templateUrl: './friend-or-family-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendOrFamilyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isFriendsorFamilyEditValue!: boolean;

  /** Public properties **/
  ddlRelationshipToClient$ = this.contactfacade.ddlRelationshipToClient$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
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
