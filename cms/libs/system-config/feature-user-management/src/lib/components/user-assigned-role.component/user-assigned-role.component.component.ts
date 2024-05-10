import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'system-config-user-assigned-role',
  templateUrl: './user-assigned-role.component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAssignedRoleComponentComponent  implements OnChanges{
  @Input() userId!: string;
  @Input() pageSizes: any;
  sort: any = "priority";
  isUserAssignedRolesGridLoaderShow = false;
  gridUserAssignedRolesSubject = new Subject<any>();
  gridUserAssignedRoles$ = this.gridUserAssignedRolesSubject.asObservable();
  userAssignedRolesGridLists$ = new Subject<any>();
  public state!: any;
  sortType = "asc"
  gridDataResult!: GridDataResult;
  loader$ = new BehaviorSubject<boolean>(false);
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public moreactions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
       // this.onUserDetailsClicked(true);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Block",
      icon: "block",
      click: (): void => {
       // this.onUserDeactivateClicked()
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
        // this.onOpenDeleteTodoClicked()
      },
    },


  ];
  /* Constructor */
  constructor(private readonly userManagementFacade: UserManagementFacade,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,) { }

/* LifeCycle Events */
ngOnInit(): void {
  this.loadUserAssignedRolesGrid();
}

ngOnChanges(): void {
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort,
  };
  this.loadUserAssignedRolesGrid();
}

loadUserAssignedRoles(data:any) {
  this.loader$.next(true);
  this.userManagementFacade.loadUserAssignedRolesByUserId(data).subscribe({
    next: (dataResponse:any) => {
      const gridView = {
        data: dataResponse['items'],
        total: dataResponse['totalCount'],
      };
      this.userAssignedRolesGridLists$.next(gridView);
      this.loader$.next(false);
    },
    error: (err:any) => {
      this.loader$.next(false);
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err)
    },
  });
  this.gridDataHandle();
}

gridDataHandle() {
  this.userAssignedRolesGridLists$.subscribe((data: GridDataResult) => {
    this.gridDataResult = data;
    this.gridUserAssignedRolesSubject.next(this.gridDataResult);
    if (data?.total >= 0 || data?.total === -1) {
      this.isUserAssignedRolesGridLoaderShow = false;
    }
  });
}

loadUserAssignedRolesGrid() {
  this.loadUserAssignedRoles({
    userId            :this.userId,
    skipCount         :this.state?.skip ?? 0,
    maxResultCount    :this.state?.take ?? 0,
    sortColumn        :this.sort,
    sortType          :this.sortType
  });
}

pageSelectionChange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadUserAssignedRolesGrid();
}

dataStateChange(stateData: any): void {
  this.sort = stateData.sort;
  this.sortType = stateData.sort[0]?.dir ?? 'asc';
  this.state = stateData;    
  this.loadUserAssignedRolesGrid();
}

onChange(data: any) {
  this.defaultGridState();
  const stateData = this.state;
  this.dataStateChange(stateData);
}

defaultGridState() {
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort,
    filter: { logic: 'and', filters: [] },
  };
}  

}
