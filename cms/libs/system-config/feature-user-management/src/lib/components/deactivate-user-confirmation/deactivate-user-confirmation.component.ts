/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy, OnInit} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NotificationSnackbarService, SnackBarNotificationType, NotificationSource } from '@cms/shared/util-core';
import { Router } from '@angular/router';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'system-config-deactivate-user-confirmation',
  templateUrl: './deactivate-user-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateUserConfirmationComponent implements OnDestroy  {
  @Input() userId: any;
  @Input() status: any;
  @Output() closeDeactivateUsers = new EventEmitter();
  @Output() refreshGrid = new EventEmitter();
  reactivate = "Active";
  deactivate = "Inactive";
  deactivateUserStatus$ = this.userManagementFacade.deactivateUser$;
  deactivatSubscription!: Subscription;
  @ViewChild('notificationTemplate', { static: true }) notificationTemplate!: TemplateRef<any>;

  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =
    this.configurationProvider.appSettings.snackbarAnimationDuration;

  /** Constructor **/ 
  constructor(
    private readonly userManagementFacade: UserManagementFacade,
    private readonly notificationService: NotificationService,
    private router: Router,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider:ConfigurationProvider
    )
    {
      this.notifyDeactivation();
    }

    onDeactivateDialogueClose(){
      this.closeDeactivateUsers.emit();
    }

    refreshUsersGrid(){
      this.refreshGrid.emit();
    }
    navigateToDetails() {
      this.router.navigate(['/system-config/cases/case-assignment']);
    }
    onDeactivateClick()
    {
      const userData={
        userId: this.userId,
        activeFlag: this.status
      };
      this.userManagementFacade.deactivateUser(userData);
    }

    notifyDeactivation(){
      this.deactivatSubscription = this.deactivateUserStatus$.subscribe((response: any) => {
        if(response.status > 0){
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
        else
        {
            this.notificationService.show({
            content: this.notificationTemplate,        
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: this.duration },
            closable: true,
            type: { style: "error", icon: true },        
            cssClass: 'reminder-notification-bar',
            hideAfter:this.hideAfter
          });
        }
        this.onDeactivateDialogueClose();
        this.refreshUsersGrid();  
      });
    }

    showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
    {
          this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
    }

    ngOnDestroy(): void {     
      if(this.deactivatSubscription){
        this.deactivatSubscription.unsubscribe();
    }
  }

    }

    notifyDeactivation(){
      this.deactivatSubscription = this.deactivateUserStatus$.subscribe((response: any) => {
        if(response.status > 0){
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
        else
        {
            this.notificationService.show({
            content: this.notificationTemplate,        
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: this.duration },
            closable: true,
            type: { style: "error", icon: true },        
            cssClass: 'reminder-notification-bar',
            hideAfter:this.hideAfter
          });
        }
        this.onDeactivateDialogueClose();
        this.refreshUsersGrid();  
      });
    }

    showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
    {
          this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
    }

    ngOnDestroy(): void {     
      if(this.deactivatSubscription){
        this.deactivatSubscription.unsubscribe();
    }
  }

}




