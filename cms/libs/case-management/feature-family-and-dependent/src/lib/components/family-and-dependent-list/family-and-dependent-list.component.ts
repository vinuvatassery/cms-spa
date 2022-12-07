/** Angular **/
import {
  Component,  OnInit,  ChangeDetectionStrategy,  Input,
   OnChanges,  ViewChild,  EventEmitter,  Output,} from '@angular/core';
import {  Router ,ActivatedRoute } from '@angular/router';
/** External libraries **/
import { Subject } from 'rxjs/internal/Subject';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
/** Enums **/
import { DependentTypeCode, ScreenType } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest } from '@cms/shared/ui-common';
import { SortDescriptor, State ,process} from '@progress/kendo-data-query';
import { DataBindingDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { inputRules } from '@progress/kendo-angular-editor';
import { first } from 'rxjs';


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
 
  /** Input properties **/
  @Input() data: any;
  @Input() dependents$: any;
  @Input() dependentSearch$ : any;
  @Input() ddlRelationships$ : any;
  @Input() dependentGet$ : any;
  @Input() dependentGetExisting$ :any;
  @Input() dependentdelete$ : any;
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() GetNewDependentHandleEvent = new EventEmitter<any>();
  @Output() GetExistclientDependentEvent = new EventEmitter<any>();
  @Output() loadDependentsEvent = new EventEmitter<any>(); 
  @Output() deleteDependentsEvent = new EventEmitter<any>(); 
  @Output() searchTextHandleEvent = new EventEmitter<any>(); 
  public formUiStyle : UIFormStyle = new UIFormStyle();

    /**Constructor */
    constructor( private router: Router , private activatedRoute : ActivatedRoute) { }

  //public pageSize = 5;
  //public skip = 0;
  public sortValue = 'fullName'
  public sortType = 'asc'
  public pageSizes = [
    {text: "5", value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20}   
  ];

  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  
  isEditFamilyMember!: boolean;
  isAddOrEditFamilyDependentDisplay!: boolean;
  isOpenedFamilyMember = false;
  isOpenedEditFamilyMember = false;
  dependentsObject! : any
  relationshipsObject! : any 
  dependentTypeCodeSelected! : DependentTypeCode
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRqclientDependentId! : string
  deleteRqdependentTypeCode! : string 
  openDeleteConfirmation! : boolean
  deletebuttonEmitted = false
  editbuttonEmitted = false
  deleteRequest$ = this.deleteRequestSubject.asObservable();  

  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Family Member",
      icon: "edit" ,   
      click: (clientDependentIdvalue: string, dependentTypeCodevalue : string): void => {     
        if(!this.editbuttonEmitted)
        {   
          this.editbuttonEmitted =true;
        this.onEditFamilyMemberClicked(clientDependentIdvalue,dependentTypeCodevalue);
        }
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Remove Family Member",
      icon: "delete",    
      click: (clientDependentIdvalue: string, dependentTypeCodevalue : string): void => {           
          
        if(!this.deletebuttonEmitted)
        {   
          this.deletebuttonEmitted = true;  
        this.onDeleteFamilyMemberClicked(clientDependentIdvalue,dependentTypeCodevalue);
        }
      },
    },  
 
  ]; 

  public  state: State = {
    skip: 0,
    take: 5,
    sort: this.sort
};

  /** Lifecycle hooks **/
  ngOnChanges(): void {            
        this.loadFamilyDependents()
 } 


  ngOnInit(): void {   
  
    this.addOrEditFamilyDependentDisplay();      
    }

  /** Private methods **/

  private addOrEditFamilyDependentDisplay() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddOrEditFamilyDependentDisplay = false;
    } else {
      this.isAddOrEditFamilyDependentDisplay = true;
    }
  }


  /** Internal event methods **/
  onExistFamilyMemberClosed()
  {    
    this.onFamilyMemberClosed()
  }

  onFamilyMemberClosed() {    
    this.isOpenedFamilyMember = false;
    this.isOpenedEditFamilyMember = false;
  }

  onFamilyMemberClicked() {
    this.isOpenedFamilyMember = true;   
    this.dependentTypeCodeSelected  = DependentTypeCode.CAClient
  }

  onEditFamilyMemberClicked(dependentId : string ,dependentTypeCode : string) {
    this.isOpenedEditFamilyMember = true;  
   
    
    if(dependentTypeCode == DependentTypeCode.CAClient)
    {     
      this.dependentTypeCodeSelected  = DependentTypeCode.CAClient
     
       //load client dependent already on system 
      this.GetExistclientDependentEvent.next(dependentId)
    }
    else
    {
      this.dependentTypeCodeSelected  = DependentTypeCode.Dependent

      //load newly adde dependent
      this.GetNewDependentHandleEvent.next(dependentId);
    } 
    
  }

 

  onDeleteFamilyMemberClicked(clientDependentId: string, dependentTypeCode : string) {       
    this.deleteRqclientDependentId = clientDependentId;
    this.deleteRqdependentTypeCode = dependentTypeCode;   
    this.onOpenDeleteConfirmation()
  }

  onOpenDeleteConfirmation()
  {
    this.openDeleteConfirmation =true;
  }
  onDeleteConfirmCloseClicked()
  {
    this.openDeleteConfirmation =false;
  }
  handleDeleteConfirmationClicked(event: any) {
    this.deletebuttonEmitted = false;       
    this.openDeleteConfirmation =false;    
    if(event?.isDelete == true)
    {
      if(event?.clientDependentId)
      {
        this.deleteDependentsEvent.next(event?.clientDependentId)
        this.dependentdelete$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((dependentData: any) =>
        {  
          if(dependentData == true)
          {
            this.loadFamilyDependents()
          }
          
        })
      }
    }

  }

  /** child event methods **/
  onFormDeleteclickEvent(event: any)
  {
    this.onDeleteFamilyMemberClicked(event?.clientDependentId, event?.dependentTypeCode)
  }

  addUpdateDependentHandle(dependent : any) {
    this.addUpdateDependentEvent.next(dependent);
  }

  closeFamilyMemberForm(e : any)
  {
    this.editbuttonEmitted =false;
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
 
   public dataStateChange(stateData: any): void {         
      this.sort = stateData.sort;
      this.sortValue = stateData.sort[0]?.field
      this.sortType = stateData.sort[0]?.dir ?? 'asc'
      this.state=stateData;
      this.loadFamilyDependents();   
  }

  private loadFamilyDependents(): void {   
    this.loadDependents(this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType)    
  }
  searchTextEventHandle($event : any)
  {    
   this.searchTextHandleEvent.emit($event)
  }
}
