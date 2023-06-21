/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html',
  styleUrls: ['./vendor-refund-page.component.css']
})
export class VendorRefundPageComponent {
  @ViewChild('batchRefundConfirmationDialog', { read: TemplateRef })
  batchRefundConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteRefundConfirmationDialog', { read: TemplateRef })
  deleteRefundConfirmationDialog!: TemplateRef<any>;
  private deleteRefundDialog: any;
  private batchConfirmRefundDialog: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  constructor( 
    private dialogService: DialogService
  ) {}
  public onBatchRefundClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    // this.isStatusPeriodDetailOpened = true;
  }
  onModalBatchRefundModalClose(result: any) {
    if (result) {
      this.batchConfirmRefundDialog.close();
    }
  }

  public onDeleteRefundClicked(
    template: TemplateRef<unknown>
  ): void {
    this.deleteRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    // this.isStatusPeriodDetailOpened = true;
  }
  onModalDeleteRefundModalClose(result: any) {
    if (result) {
      this.deleteRefundDialog.close();
    }
  }
}
