import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-pcas-group-list',
  templateUrl: './financial-pcas-group-list.component.html',
})
export class FinancialPcasGroupListComponent {
  @ViewChild('addEditGroupDialogTemplate', { read: TemplateRef })
  addEditGroupDialogTemplate!: TemplateRef<any>;
  @ViewChild('activeGroupDialogTemplate', { read: TemplateRef })
  activeGroupDialogTemplate!: TemplateRef<any>;
  @ViewChild('deActiveGroupDialogTemplate', { read: TemplateRef })
  deActiveGroupDialogTemplate!: TemplateRef<any>;
  @ViewChild('removeGroupDialogTemplate', { read: TemplateRef })
  removeGroupDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isEditGroupOptionClosed = false;
  isRemoveGroupOptionClosed = false;
  isActivateGroupOptionClosed = false;
  isDeactiveteGroupOptionClosed = false;
  isAddGroupOptionClosed = false;
  addEditDialogService: any;
  activateDialogService: any;
  deactivateDialogService: any;
  removeDialogService: any; 
  @Output() openAddGroupClickedEventTriggered = new EventEmitter();
 groupGridActions =[

    {
      buttonType: 'btn-h-primary',
      text: 'EditGroup',
      icon: 'edit', 
      click: (data: any): void => {
        if (!this.isEditGroupOptionClosed) {
          this.isEditGroupOptionClosed = true; 
          this.onOpenAddEditGroupClicked(this.addEditGroupDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'ActiveGroup',
      icon: 'check', 
      click: (data: any): void => {
        if (!this.isActivateGroupOptionClosed) {
          this.isActivateGroupOptionClosed = true; 
          this.onOpenActivateGroupClicked(this.activeGroupDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'De-activeGroup',
      icon: 'block', 
      click: (data: any): void => {
        if (!this.isDeactiveteGroupOptionClosed) {
          this.isDeactiveteGroupOptionClosed = true; 
          this.onOpenDeactivateGroupClicked(this.deActiveGroupDialogTemplate);
        }
      },
    },
 
    {
      buttonType: 'btn-h-danger',
      text: 'RemoveGroup',
      icon: 'delete', 
      click: (data: any): void => {
        if (!this.isRemoveGroupOptionClosed) {
          this.isRemoveGroupOptionClosed = true; 
          this.onOpenRemoveGroupClicked(this.removeGroupDialogTemplate);
        }
      },
    },

  ];
  bbbbbb = [
    {
      id: 1,  
      group: '123123`',  
      isActive: true,
    },
    {
      id: 2,
      group: '123123`',  
      isActive: true,
    },
    
  ];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}


  
   
addEditGroupEventTrigged(){
  this.openAddGroupClickedEventTriggered.emit(true);
  this.onOpenAddEditGroupClicked(this.addEditGroupDialogTemplate)
}
  onOpenAddEditGroupClicked(template: TemplateRef<unknown>): void {
    this.addEditDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseAddEditGroupClicked(result: any) {
    if (result) { 
      this.isEditGroupOptionClosed = false;
      this.addEditDialogService.close();
    }
  }
 
  onOpenActivateGroupClicked(template: TemplateRef<unknown>): void {
    this.activateDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseActivateGroupClicked(result: any) {
    if (result) { 
      this.isActivateGroupOptionClosed = false;
      this.activateDialogService.close();
    }
  }

  onOpenDeactivateGroupClicked(template: TemplateRef<unknown>): void {
    this.deactivateDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseDeactivateGroupClicked(result: any) {
    if (result) { 
      this.isDeactiveteGroupOptionClosed = false;
      this.deactivateDialogService.close();
    }
  }

  onOpenRemoveGroupClicked(template: TemplateRef<unknown>): void {
    this.removeDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseRemoveGroupClicked(result: any) {
    if (result) { 
      this.isRemoveGroupOptionClosed = false;
      this.removeDialogService.close();
    }
  }

 
}
