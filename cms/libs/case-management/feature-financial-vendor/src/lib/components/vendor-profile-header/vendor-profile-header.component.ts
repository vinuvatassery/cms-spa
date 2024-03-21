import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { VendorHeaderToolsComponent } from '../vendor-header-tools/vendor-header-tools.component';

@Component({
  selector: 'cms-vendor-profile-header',
  templateUrl: './vendor-profile-header.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorProfileHeaderComponent implements OnInit {
@Input() vendorProfileSpecialHandling$ : any
@Input() vendorProfile$ : any
vendorProfile:any
@Input() clientCaseEligibilityId!: any;
@Input() clientId!: any;
@Output() loadSpecialHandlingEvent =  new EventEmitter();
@Output() updateRecentlyViewedEvent = new EventEmitter();
@Input()  alertList$ :any;
@Output() isLoadAlertBannerContainerEvent = new EventEmitter<any>();
@Output() onMarkAlertAsDoneEvent = new EventEmitter<any>();
@Output() onDeleteAlertEvent = new EventEmitter<any>();
notificationReminderDialog : any;
@ViewChild('vendorHeaderTools', { static: false })
vendorHeaderTools!: VendorHeaderToolsComponent;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  showMoreAlert = false;
  newReminderDetailsDialog!:any
  @Output() openAddReminderEvent = new EventEmitter()
  @Output() openEditReminderEvent = new EventEmitter()
  @Output() openDeleteReminderEvent = new EventEmitter()
  public list = [
    {
      item: 'a'
    },
  ]
  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      click: (): void => {
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      isVisible: false,
      click: (): void => {

      },
    },

  ];

  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {

      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {

      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {

      },
    },
  ];
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  constructor(private route: Router,private activeRoute : ActivatedRoute, 
    private dialogService: DialogService) {

  }
  ngOnInit(): void {
    this.vendorProfile$.subscribe((vendorProfile :any) =>{
      this.vendorProfile = vendorProfile
      this.updateRecentlyViewedEvent.emit(vendorProfile.vendorId)
    });
   
  }


  onBackClicked()
  {
    this.route.navigate(['financial-management/vendors'])
  }

  loadSpecialHandling()
  {
    this.loadSpecialHandlingEvent.emit()
  }

  getHeaderPreferredFlag(vendorProfile : any)
  {    
     return vendorProfile?.preferredFlag === 'Y' ? 'preferred-heading' : ''
  }


  onNotificationsAndRemindersClosed() { 
    this.notificationReminderDialog.close()
  }

  onNotificationsAndRemindersOpenClicked(template: TemplateRef<unknown>): void {
    this.notificationReminderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-wid-md-full no_body_padding-modal reminder_modal',
    });  
  } 
  isLoadAlertBannerEvent(entityId: any)
  {
    this.isLoadAlertBannerContainerEvent.emit(entityId)
  }
  onMarkAlertAsDoneClick(event:any){
    this.onMarkAlertAsDoneEvent.emit(event);
  }
  onDeleteAlertClick(event:any){
    this.onDeleteAlertEvent.emit(event);
  }

  openAddReminder(){
   this.openAddReminderEvent.emit()
  }

  onEditReminder(event:any){
    this.openEditReminderEvent.emit(event)
  }

  onDeleteReminder(event:any){
    this.openDeleteReminderEvent.emit(event)
  }
}
