/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { CaseFacade } from '@cms/case-management/domain';
/** facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'productivity-tools-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent implements OnInit {
  currentDate = new Date();
  /** Public properties **/
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaCustomTodoMaxLength = 100;
  tareaCustomTodoCharactersCount!: number;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  tareaCustomTodoCounter!: string;
  tareaCustomTodoDescription = '';
 

  /** Constructor **/
  constructor(private readonly todoFacade: TodoFacade,private readonly caseFacade: CaseFacade,) {}
  
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
}
