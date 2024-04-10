/** Angular **/
import {
  Component,  OnInit,  ChangeDetectionStrategy,  Input,
   OnChanges, EventEmitter,  Output,ChangeDetectorRef} from '@angular/core';
import {  Router ,ActivatedRoute } from '@angular/router';
/** External libraries **/
import { Subject } from 'rxjs/internal/Subject';
import { UIFormStyle } from '@cms/shared/ui-tpa'
/** Enums **/
import { DependentTypeCode, ScreenType, FamilyAndDependentFacade, CaseFacade } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest } from '@cms/shared/ui-common';
import {  State } from '@progress/kendo-data-query';
import { Subscription, first } from 'rxjs';

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
  @Input() dependentAddNewGet$ : any;
  @Input() dependentUpdateNew$ : any;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() timeFormat : any;
  @Input()  existdependentStatus$ : any;
  @Input() isCerForm: boolean = false;
  @Input() dependentProfilePhoto$!: any;
  @Output() addUpdateDependentEvent = new EventEmitter<any>();
  @Output() GetNewDependentHandleEvent = new EventEmitter<any>();
  @Output() GetExistclientDependentEvent = new EventEmitter<any>();
  @Output() loadDependentsEvent = new EventEmitter<any>();
  @Output() deleteDependentsEvent = new EventEmitter<any>();
  @Output() searchTextHandleEvent = new EventEmitter<any>();
  @Output() addExistingClientEvent = new EventEmitter<any>();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  dependentValid$ = this.familyAndDependentFacade.dependentValid$;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
    /**Constructor */
    constructor( private router: Router , private activatedRoute : ActivatedRoute,
      private familyAndDependentFacade: FamilyAndDependentFacade,private readonly cd: ChangeDetectorRef,private caseFacade: CaseFacade,) { }

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
    isDependentAvailable:boolean=true;
    public  state!: State
    userDependentSubacription= new Subscription();
  public actions = [
    {
      buttonType:"btn-h-primary",
      clientText: "Edit Family Member",
      depText: "Edit Family Member",
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
      clientText: "Delete Family Member",
      depText: "Remove Family Member",
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

  /** Lifecycle hooks **/
  ngOnChanges(): void {
      this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
  };
        this.loadFamilyDependents()
 }


  ngOnInit(): void {

    this.addOrEditFamilyDependentDisplay();
    this.dependentValid$.subscribe(response=>{
      this.isDependentAvailable = response;
      this.cd.detectChanges();
    })
    }
// updating the pagination infor based on dropdown selection
pageselectionchange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadFamilyDependents()
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
    this.deletebuttonEmitted = false;
    this.openDeleteConfirmation =false;
  }
  handleDeleteConfirmationClicked(event: any) {
    this.deletebuttonEmitted = false;
    this.openDeleteConfirmation =false;
    if(event?.isDelete ?? false)
    {
      if(event?.clientDependentId)
      {
        this.deleteDependentsEvent.next(event?.clientDependentId)
        this.dependentdelete$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((dependentData: any) =>
        {
          if(dependentData ?? false)
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
    this.onDeleteFamilyMemberClicked(event?.clientRelationshipId, event?.dependentTypeCode)
  }

  addUpdateDependentHandle(dependent : any) {
    this.addUpdateDependentEvent.next(dependent);
    this.editbuttonEmitted =false;

    this.dependentAddNewGet$.pipe(first((addResponse: any ) => addResponse != null))
    .subscribe((addResponse: any) =>
    {
      if(addResponse?.clientRelationshipId)
      {
        this.familyAndDependentFacade.dependentValidSubject.next(true);
        this.loadFamilyDependents()
        this.onFamilyMemberClosed()
      }

    })

    if(dependent?.clientRelationshipId)
      {
        this.dependentUpdateNew$.pipe(first((updateResponse: any ) => updateResponse != null))
        .subscribe((updateResponse: any) =>
        {
          if(updateResponse?.clientRelationshipId)
          {
            this.loadFamilyDependents()
            this.onFamilyMemberClosed()
          }

        })
      }

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
      this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
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

  addExistingClientEventHandle($event : any)
  {
    this.addExistingClientEvent.emit($event)
    this.editbuttonEmitted =false;
      this.existdependentStatus$.pipe(first((updateResponse: any ) => updateResponse?.clientRelationshipId != null))
      .subscribe((updateResponse: any) =>
      {
        if(updateResponse?.clientRelationshipId)
        {
          this.loadFamilyDependents()
          this.onFamilyMemberClosed()
        }

      })

  }
}
