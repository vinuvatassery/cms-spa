/** Angular **/
import {Component, OnInit, ChangeDetectionStrategy, Input,} from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs/internal/Subject';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/** Facades **/
import { EmploymentFacade } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest } from '@cms/shared/ui-common';
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
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Employer',
      icon: 'edit',
      click: (): void => {
        this.onEmployerClicked(false);
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Employer',
      icon: 'delete',
      click: (): void => {
         this.onDeleteEmployerDetailsClicked('john')
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

  receiveDetailFromEmpDetails($event: boolean) {
    this.isEmployerOpened = $event;
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


  onDeleteEmployerDetailsClicked(deleteDetails: any) {
    const deleteConfirmation: DeleteRequest = {
      title: ' Employer',
      content: 'The employer will be deleted from the application',
      data: deleteDetails,
    };
    this.deleteRequestSubject.next(deleteConfirmation);
  }

  handleDeleteConfirmationClicked(event: any) {
    console.log('Response Data :', event);
  }
}
