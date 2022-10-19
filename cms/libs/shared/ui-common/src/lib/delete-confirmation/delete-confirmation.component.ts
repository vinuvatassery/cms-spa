/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
/** External libraries **/
import {
  DialogCloseResult,
  DialogRef,
  DialogResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
/** Entities **/
import { DeleteResponse } from '../entities/delere-response';
import { DeleteRequest } from '../entities/delete-request';

@Component({
  selector: 'common-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationComponent implements OnInit {
  /** Input properties **/
  @Input() data$!: Observable<DeleteRequest>;

  /** Output properties **/
  @Output() sendBackInformation = new EventEmitter();

  /** Public properties **/
  @ViewChild('deleteConfirmationTemplate', { read: TemplateRef })
  deleteConfirmationTemplate!: TemplateRef<any>;
  deleteRequestData!: DeleteRequest;
  dialogRef!: DialogRef;
  buttonAction!: any;

  /** Constructor **/
  constructor(private dialogService: DialogService) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.onDeleteConfirmationClicked();
  }

  /** Private methods **/
  private onDeleteConfirmationClicked() {
    this.data$.subscribe({
      next: (res) => {
        if (res) {
          this.deleteRequestData = res;
          this.dialogRef = this.dialogService.open({
            content: this.deleteConfirmationTemplate,
            actions: [{ text: 'Cancel' }, { text: 'Delete', primary: 'true' }],
            cssClass: 'app-c-modal app-c-modal-sm delete-confirm-modal',

            preventAction: (ev) => {
              return ev instanceof DialogCloseResult;
            },
          });

          this.dialogRef.result.subscribe((result: DialogResult) => {
            this.buttonAction = result;

            if (this.buttonAction.text === 'Delete') {
              const deleteResponse: DeleteResponse = {
                response: true,
                data: this.deleteRequestData.data,
              };
              this.sendBackInformation.emit(deleteResponse);
            } else {
              const deleteResponse: DeleteResponse = {
                response: false,
                data: this.deleteRequestData.data,
              };
              this.sendBackInformation.emit(deleteResponse);
            }
          });
        }
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
