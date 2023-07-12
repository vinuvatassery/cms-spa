/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy ,  Output, EventEmitter} from '@angular/core';
/** facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'productivity-tools-todo-detail',
  templateUrl: './todo-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent implements OnInit {
  tareaCustomTodoMaxLength = 100;
  tareaCustomTodoCharactersCount!: number;
  tareaCustomTodoCounter!: string;
  tareaCustomTodoDescription = '';
  @Output() isModalTodoDetailsCloseClicked = new EventEmitter();

  /** Constructor **/
  constructor(private readonly todoFacade: TodoFacade) {}
  
  public date = new Date();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadToDoSearch();
    this.tareaVaribalesIntialization();
  }

  /** Private methods **/
  private tareaVaribalesIntialization() {
    this.tareaCustomTodoCharactersCount = this.tareaCustomTodoDescription
      ? this.tareaCustomTodoDescription.length
      : 0;
    this.tareaCustomTodoCounter = `${this.tareaCustomTodoCharactersCount}/${this.tareaCustomTodoMaxLength}`;
  }
  private loadToDoSearch() {
    this.todoFacade.loadToDoSearch();
  }

  /** Internal event methods **/
  onTareaCustomTodoValueChange(event: any): void {
    this.tareaCustomTodoCharactersCount = event.length;
    this.tareaCustomTodoCounter = `${this.tareaCustomTodoCharactersCount}/${this.tareaCustomTodoMaxLength}`;
  }
  closeTodoDetailsClicked(){
    this.isModalTodoDetailsCloseClicked.emit(true);  
  }
}
