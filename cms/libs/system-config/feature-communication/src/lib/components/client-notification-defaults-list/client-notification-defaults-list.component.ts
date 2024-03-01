import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CancelEvent,
  EditEvent,
  GridComponent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
@Component({
  selector: 'system-config-client-notification-defaults-list',
  templateUrl: './client-notification-defaults-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientNotificationDefaultsListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/
  UpdateDefaultNotificationPopupShow = false;
  clientNotificationDefaultsLists$ =
    this.templateManagementFacade.clientNotificationDefaultsLists$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();

  public formGroup: FormGroup | undefined;
  private editedRowIndex: number | undefined;
  /** Constructor **/
  constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadClientNotificationLists();
  }

  /** Private  methods **/

  private loadClientNotificationLists() {
    this.templateManagementFacade.loadClientNotificationDefaultsLists();
  }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);

    this.formGroup = this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const product = formGroup.value;

    sender.closeRow(rowIndex);
    this.UpdateDefaultNotificationPopupShow = true;
  }
  private closeEditor(
    grid: GridComponent,
    rowIndex = this.editedRowIndex
  ): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  createFormGroup = (dataItem: any) =>
    new FormGroup({
      defaultMethod: new FormControl(
        dataItem.defaultMethod,
        Validators.required
      ),
    });

    onCloseUpdateDefaultNotificationClicked(){
this.UpdateDefaultNotificationPopupShow = false;
    }
}
