/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/** Facades **/
import { EmploymentFacade } from '@cms/case-management/domain';
import { ClientEmployer } from 'libs/case-management/domain/src/lib/entities/client-employer';
import { RemoveEmployerConfirmationComponent } from '../remove-employer-confirmation/remove-employer-confirmation.component';

@Component({
  selector: 'case-management-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerListComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;

  /** Public properties **/
  employers$ = this.employmentFacade.employers$;
  isAddEmployerButtonDisplayed!: boolean;
  isAdd = true;
  isRemoveEmployerConfirmationPopupOpened = false;
  isEmployerOpened = false;
  selectedEmployer: ClientEmployer = new ClientEmployer();

  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Employer",
      icon: "edit",
      type: "edit"
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Employer",
      icon: "delete",
      type: "delete"
    },
  ];

  /** Constructor **/
  constructor(private readonly employmentFacade: EmploymentFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.addEmployerButtonDisplay();
  }

  /** Private methods **/

  private addEmployerButtonDisplay() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddEmployerButtonDisplayed = false;
    } else {
      this.isAddEmployerButtonDisplayed = true;
    }
  }

  /** Internal event methods **/
  onEmployerClosed() {
    this.isEmployerOpened = false;
  }

  onEmployerClicked(isEmployerAdd: boolean) {
    this.isEmployerOpened = true;
    this.isAdd = isEmployerAdd;
  }

  onEmployerActionClicked(selectedEmployer: ClientEmployer, modalType: string = "") {
    this.selectedEmployer = selectedEmployer;
    if (modalType == "edit") {
      this.isEmployerOpened = true;
      this.isAdd = false;
    }
    if (modalType == "delete") {
      this.isRemoveEmployerConfirmationPopupOpened = true;
    }
  }
  
  onRemoveEmployerConfirmationClosed() {
    this.isRemoveEmployerConfirmationPopupOpened = false;
  }
}
