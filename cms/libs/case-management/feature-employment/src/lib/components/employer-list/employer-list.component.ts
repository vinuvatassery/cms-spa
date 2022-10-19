/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/** Facades **/
import { EmploymentFacade } from '@cms/case-management/domain';

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
  isEmployerOpened = false;
 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Employer",
      icon: "edit",
      click: (): void => {
        this.onEmployerClicked(false);
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Employer",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly employmentFacade: EmploymentFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadEmployers();
    this.addEmployerButtonDisplay();
  }

  /** Private methods **/
  private loadEmployers() {
    this.employmentFacade.loadEmployers();
  }

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
}
