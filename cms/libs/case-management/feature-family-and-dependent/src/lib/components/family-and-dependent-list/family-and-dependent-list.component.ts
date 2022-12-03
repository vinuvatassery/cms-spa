/** Angular **/
import {
  Component,  OnInit,  ChangeDetectionStrategy,  Input,
   OnChanges,  ViewChild,  EventEmitter,  Output,} from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs/internal/Subject';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
/** Enums **/
import { DependentTypeCode, ScreenType } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest } from '@cms/shared/ui-common';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Lov } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-family-and-dependent-list',
  templateUrl: './family-and-dependent-list.component.html',
  styleUrls: ['./family-and-dependent-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentListComponent implements OnInit ,  OnChanges {
/******enumeration Alias *****/
Dependent = DependentTypeCode.Dependent;
CAClient = DependentTypeCode.CAClient;


  @ViewChild('dependentsGrid') dependentsGrid!: DataBindingDirective;
  /** Input properties **/
  @Input() data: any;
  @Input() dependents$: any;
  @Input() dependentSearch$ : any;
  @Input() ddlRelationships$ : any;
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() GetNewDependentHandleEvent = new EventEmitter<any>();
  @Output()  loadDependentsEvent = new EventEmitter<any>();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public pageSize = 5;
  public skip = 0;
  public sortValue = 'fullName'
  public sortType = 'asc'
  public pageSizes = [
    {text: this.pageSize, value: this.pageSize}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100} 
  ];

  public sort: SortDescriptor[] = [{
    field: this.sortValue,
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
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  public gridView!: GridDataResult;
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Family Member",
      icon: "edit",
      click: (clientDependentId: string, dependentTypeCode : string): void => {        
        this.onEditFamilyMemberClicked(clientDependentId,dependentTypeCode,false);
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
        this.loadFamilyDependents()
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

      //this.loadFamilyDependents()
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
    this.dependentTypeCodeSelected  = DependentTypeCode.Dependent
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

  /** child event methods **/
  addUpdateDependentHandle(dependent : any) {
    this.addUpdateDependentEvent.next(dependent);
  }

  closeFamilyMemberForm(e : any)
  {
    this.onFamilyMemberClosed()
  }
  
  loadDependents(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string)
  {
    const gridDataRefinerValue = 
    {
      skipCount: skipcountValue,
      pagesize : maxResultCountValue,
      sortColumn : sortValue,
      sortType : sortTypeValue,
    }
    this.loadDependentsEvent.next(gridDataRefinerValue)
  }
   /** grid event methods **/

   public dataStateChange(state: any): void {  

    /**
     * The number of records to be skipped by the pager.
     */
     this.skip = state?.skip;
     /**
      * The number of records to take.
      */
      this.pageSize = state?.take;
     /**
      * The descriptors used for sorting.
      *  */
     
      this.sort = state.sort;
      this.loadFamilyDependents();   
  }

  private loadFamilyDependents(): void {    
    this.loadDependents(this.pageSize,this.skip ,this.sortValue , this.sortType)
    this.mapRelationshipstoLov()     
    // this.gridView = {
    //     data: this.dependentsObject.slice(0, 100),
    //     total: this.dependentsObject.length
    // };  
  }


  
}
