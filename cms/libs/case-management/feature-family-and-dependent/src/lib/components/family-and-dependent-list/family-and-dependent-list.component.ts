/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs/internal/Subject';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
/** Enums **/
import { Dependent, DependentTypeCode, ScreenType } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest } from '@cms/shared/ui-common';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { first } from 'rxjs';
import { debug } from 'console';
import { Lov } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-family-and-dependent-list',
  templateUrl: './family-and-dependent-list.component.html',
  styleUrls: ['./family-and-dependent-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentListComponent implements OnInit ,  OnChanges {
  @ViewChild('dependentsGrid') dependentsGrid!: DataBindingDirective;
  /** Input properties **/
  @Input() data: any;
  @Input() dependents$: any;
  @Input() dependentSearch$ : any;
  @Input() ddlRelationships$ : any;
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() GetNewDependentHandleEvent = new EventEmitter<any>();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100} 
  ];

  public sort: SortDescriptor[] = [{
    field: 'fullName',
    dir: 'asc'
  }];

  isAddFamilyMember = true;
  isEditFamilyMember!: boolean;
  isAddOrEditFamilyDependentDisplay!: boolean;
  isOpenedFamilyMember = false;
  isOpenedEditFamilyMember = false;
  dependentsObject! : any
  relationshipsObject! : any 
  dependentTypeCodeSelected! : DependentTypeCode
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  // actions: Array<any> = [{ text: 'Action' }];
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  public gridView!: GridDataResult;
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Family Member",
      icon: "edit",
      click: (clientDependentId: string, isCareAssistFlag : string): void => {        
        this.onEditFamilyMemberClicked(clientDependentId,isCareAssistFlag,false);
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Remove Family Member",
      icon: "delete",
      click: (): void => {
        
        // this.onDeleteFamilyMemberClicked();
      },
    },  
 
  ]; 

  /** Lifecycle hooks **/
  ngOnChanges(): void {      
              
      this.mapRelationshipstoLov()     
 } 


  ngOnInit(): void {   

    this.addOrEditFamilyDependentDisplay();
    
    }

  /** Private methods **/

  private mapRelationshipstoLov()
  {
    this.ddlRelationships$.pipe()
    .subscribe((relations: any[]) => {             
      this.relationshipsObject = [...relations]; 
       
      });
    this.dependents$.pipe()
    .subscribe((dependents: any[]) => {             
      this.dependentsObject = [...dependents];     
      
      Object.keys(this.dependentsObject).forEach(key => {      
        this.dependentsObject[key].relationship =
         this.relationshipsObject.find((item : Lov) => 
         item.lovCode === this.dependentsObject[key].relationshipCode)?.lovDesc         
      });

      this.loadFamilyDependents()
    }); 
  
  }

  private addOrEditFamilyDependentDisplay() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddOrEditFamilyDependentDisplay = false;
    } else {
      this.isAddOrEditFamilyDependentDisplay = true;
    }
  }


  /** Internal event methods **/
  onFamilyMemberClosed() {
    this.isOpenedFamilyMember = false;
    this.isOpenedEditFamilyMember = false;
  }

  onFamilyMemberClicked(isFamilyAdd: boolean) {
    this.isOpenedFamilyMember = true;
    this.isAddFamilyMember = isFamilyAdd;
  }

  onEditFamilyMemberClicked(dependentId : string ,dependentTypeCode : string, isFamilyAdd: boolean) {
    this.isOpenedEditFamilyMember = true;
    this.isAddFamilyMember = isFamilyAdd;
    
    if(dependentTypeCode == DependentTypeCode.CAClient)
    {
      this.dependentTypeCodeSelected  = DependentTypeCode.CAClient
    }
    else
    {
      this.dependentTypeCodeSelected  = DependentTypeCode.Dependent
    } 
    this.GetNewDependentHandleEvent.next(dependentId);
  }

  onDeleteFamilyMemberClicked(dependentName: any) {
    const deleteConfirmation: DeleteRequest = {
      title: ' Family Member',
      content: 'Content from family and dependent',
      data: dependentName,
    };
    this.deleteRequestSubject.next(deleteConfirmation);
  }

  handleDeleteConfirmationClicked(event: any) {
    console.log('Response Data :', event);
  }

  public sortChange(sort: SortDescriptor[]): void {       
    this.sort = sort;
    this.loadFamilyDependents();
  }

  private loadFamilyDependents(): void {
    this.gridView = {
        data: orderBy(this.dependentsObject.slice(0, 100), this.sort),
        total: this.dependentsObject.length
    };  
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadFamilyDependents();
  }
  

  /** child event methods **/
  addUpdateDependentHandle(dependent : any) {
    this.addUpdateDependentEvent.next(dependent);
  }

  closeFamilyMemberForm(e : any)
  {
    this.onFamilyMemberClosed()
  }
  
}
