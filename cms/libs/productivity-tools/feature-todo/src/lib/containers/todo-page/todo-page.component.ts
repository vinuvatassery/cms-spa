/** Angular **/
import {
  Component,
  ChangeDetectionStrategy, 
  Output,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { FinancialVendorFacade, SearchFacade, VendorFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'productivity-tools-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPageComponent implements OnInit {
  /** Public properties **/
  private todoDetailsDialog: any;
  @Output() isToDODetailsActionOpen!: boolean;
  todoGrid$ = this.todoFacade.todoGrid$;
  frequencyTypeCodeSubject$ = this.lovFacade.frequencyTypeCodeSubject$
  showHeaderSearchInputLoader = false;
  clientSearchResult$ = this.searchFacade.clientSearch$;
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  createTodo$ = this.todoFacade.createTodo$
  /** Constructor **/
  constructor(private dialogService: DialogService, 
    public todoFacade: TodoFacade,
    public lovFacade : LovFacade,
    private readonly searchFacade: SearchFacade,
    private readonly financialVendorFacade : FinancialVendorFacade) {}
 
    ngOnInit(): void {
      this.lovFacade.getFrequencyTypeLov()
  }

  searchClientName(event:any){
    this.searchFacade.loadCaseBySearchText(event);
  }

  searchProvider(data:any){
    this.financialVendorFacade.searchProvider(data);
  }
  /** Public methods **/
  onCloseTodoClicked(result: any) {
    if (result) {
      this.isToDODetailsActionOpen = false;
      this.todoDetailsDialog.close();
    }
  }

  onOpenTodoClicked(template: TemplateRef<unknown>): void {
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np mnl',
    });
    this.isToDODetailsActionOpen = true;
  }
  onloadTodoGrid(event: any){
    this.todoFacade.loadTodoGrid();
  }

  onTodoItemCreateClick(payload:any){
    this.todoFacade.createTodoItem(payload);
  }
}
