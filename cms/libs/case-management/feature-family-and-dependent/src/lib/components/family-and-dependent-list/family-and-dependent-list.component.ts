/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs/internal/Subject';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest } from '@cms/shared/ui-common';
/** Facades **/
import { FamilyAndDependentFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-family-and-dependent-list',
  templateUrl: './family-and-dependent-list.component.html',
  styleUrls: ['./family-and-dependent-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentListComponent implements OnInit {
  /** Input properties **/
  @Input() data: any;

  /** Public properties **/
  dependents$ = this.dependentFacade.dependents$;
  isAddFamilyMember = true;
  isEditFamilyMember!: boolean;
  isAddOrEditFamilyDependentDisplay!: boolean;
  isOpenedFamilyMember = false;
  isOpenedEditFamilyMember = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  // actions: Array<any> = [{ text: 'Action' }];
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  //dependentInfo$=this.dependentFacade.dependentInfo$;

  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Family Member",
      icon: "edit",
      click: (): void => {
        this.onEditFamilyMemberClicked(false);
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Remove Family Member",
      icon: "delete",
      click: (): void => {
        
        // this.onDeleteFamilyMemberClicked();
      },
    }, 
 
  ];

  public familyMemberOptions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Family Member",
      icon: "edit",
      click: (): void => {
        this.onEditFamilyMemberClicked(false);
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Family Member",
      icon: "delete",
      click: (): void => {
        
        // this.onDeleteFamilyMemberClicked();
      },
    }, 
 
  ];


  /** Constructor **/
  constructor(private readonly dependentFacade: FamilyAndDependentFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDependents();
    this.addOrEditFamilyDependentDisplay();
  }

  /** Private methods **/
  private addOrEditFamilyDependentDisplay() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddOrEditFamilyDependentDisplay = false;
    } else {
      this.isAddOrEditFamilyDependentDisplay = true;
    }
  }

  private loadDependents() {
    this.dependentFacade.loadDependents();
  }

  /** Internal event methods **/
  onFamilyMemberClosed() {
    this.isOpenedFamilyMember = false;
    this.isOpenedEditFamilyMember = false;
  }

  onFamilyMemberClicked(isFamilyAdd: boolean) {
    this.isOpenedFamilyMember = true;
    this.isAddFamilyMember = isFamilyAdd;
  }

  onEditFamilyMemberClicked(isFamilyAdd: boolean) {
    this.isOpenedEditFamilyMember = true;
    this.isAddFamilyMember = isFamilyAdd;
  }

  onDeleteFamilyMemberClicked(dependentName: any) {
    const deleteConfirmation: DeleteRequest = {
      title: ' Family Member',
      content: 'Content from family and dependent',
      data: dependentName,
    };
    this.deleteRequestSubject.next(deleteConfirmation);
  }

  handleDeleteConfirmationClicked(event: any) {
    console.log('Response Data :', event);
  }
}
