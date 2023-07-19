import { ChangeDetectionStrategy, Component } from '@angular/core';

/** facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'productivity-tools-sub-events-details',
  templateUrl: './sub-events-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubEventsDetailsComponent {
  tareaCustomTodoMaxLength = 7500;
  tareaCustomTodoCharactersCount!: number;
  tareaCustomTodoCounter!: string;
  tareaCustomTodoDescription = '';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(private readonly todoFacade: TodoFacade) {}

  /** Internal event methods **/
  onTareaCustomTodoValueChange(event: any): void {
    this.tareaCustomTodoCharactersCount = event.length;
    this.tareaCustomTodoCounter = `${this.tareaCustomTodoCharactersCount}/${this.tareaCustomTodoMaxLength}`;
  }
}
