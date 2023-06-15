/** Angular **/
import { Component, ChangeDetectionStrategy, TemplateRef,} from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'productivity-tools-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPageComponent {
  /** Public properties **/
  private todoDetailsDialog: any;

  /** Constructor **/
  constructor(private dialogService: DialogService) {}
  /** Public methods **/
  onCloseTodoClicked(result: any) {
    if (result) {
      this.todoDetailsDialog.close();
    }
  }

  onOpenTodoClicked(template: TemplateRef<unknown>): void {
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np mnl',
    });
  }
}
