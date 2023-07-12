/** Angular **/
import { Component,  ChangeDetectionStrategy } from '@angular/core';

import { CaseFacade  } from '@cms/case-management/domain';

import {  LovFacade } from '@cms/system-config/domain';
/** facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
@Component({
  selector: 'cms-financial-drugs-reassign',
  templateUrl: './financial-drugs-reassign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsReassignComponent {public formUiStyle: UIFormStyle = new UIFormStyle();

  currentDate = new Date();
  /** Public properties **/
  caseSearched$ = this.caseFacade.caseSearched$;
  search$ = this.todoFacade.search$;
  tareaCustomTodoMaxLength = 100;
  tareaCustomTodoCharactersCount!: number;
  ddlCaseOrigins$ = this.lovFacade.lovs$;
  tareaCustomTodoCounter!: string;
  tareaCustomTodoDescription = '';
 

  /** Constructor **/
  constructor(private readonly todoFacade: TodoFacade,
    private readonly caseFacade: CaseFacade,
    private readonly lovFacade: LovFacade) {}
  
  public date = new Date();
 
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
  }}
