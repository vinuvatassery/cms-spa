/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy , Input, Output, EventEmitter} from '@angular/core';
import { CaseFacade  } from '@cms/case-management/domain';
import {  LovFacade } from '@cms/system-config/domain';
/** facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'productivity-tools-todo-detail',
  templateUrl: './todo-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent implements OnInit {
  currentDate = new Date();
  /** Public properties **/
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaCustomTodoMaxLength = 100;
  tareaCustomTodoCharactersCount!: number;
  ddlCaseOrigins$ = this.lovFacade.lovs$;
  tareaCustomTodoCounter!: string;
  tareaCustomTodoDescription = '';
  @Output() isModalTodoDetailsCloseClicked = new EventEmitter();

  /** Constructor **/
  constructor(private readonly todoFacade: TodoFacade,
    private readonly caseFacade: CaseFacade,
    private readonly lovFacade: LovFacade) {}
  
  public date = new Date();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodosearch();
    this.tareaVaribalesIntialization();
  }

  /** Private methods **/
  private tareaVaribalesIntialization() {
    this.tareaCustomTodoCharactersCount = this.tareaCustomTodoDescription
      ? this.tareaCustomTodoDescription.length
      : 0;
    this.tareaCustomTodoCounter = `${this.tareaCustomTodoCharactersCount}/${this.tareaCustomTodoMaxLength}`;
  }
  private loadTodosearch() {
    this.todoFacade.loadTodosearch();
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
