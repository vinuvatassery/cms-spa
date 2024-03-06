/** Angular **/
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
/** Facades **/
import { CerTrackingFacade, GridFacade, GridStateKey, ModuleCode, WorkflowFacade } from '@cms/case-management/domain';
import { UserDataService } from '@cms/system-config/domain';
import { Subject } from 'rxjs';

@Component({
  selector: 'case-management-cer-tracking-page',
  templateUrl: './cer-tracking-page.component.html',
  styleUrls: ['./cer-tracking-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerTrackingPageComponent implements OnInit {
  @Input() caseStatus: string = '';
  /** Public properties **/
  cer$ = this.cerTrackingFacade.cer$;
  pageSizes = this.cerTrackingFacade.gridPageSizes;
  sortValue = this.cerTrackingFacade.sortValue;
  sortType = this.cerTrackingFacade.sortType;
  sort = this.cerTrackingFacade.sort;
  cerTrackingData$ = this.cerTrackingFacade.cerTrackingList$;
  cerTrackingDates$ = this.cerTrackingFacade.cerTrackingDates$;
  cerTrackingCount$ = this.cerTrackingFacade.cerTrackingCount$;
  sendResponse$ = this.cerTrackingFacade.sendResponse$;
  public state!: any;
  loginUserId!:any;
  

  private gridStateSubject = new Subject<any>();
  gridState$ = this.gridStateSubject.asObservable();

  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade, private readonly workflowFacade:WorkflowFacade,
    private readonly gridFacade: GridFacade, private readonly userDataService: UserDataService) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter:{logic:'and',filters:[]},
    };
    this.getLoggedInUserProfile();
  }

  /** Private methods **/

  getLoggedInUserProfile(){
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserId= profile[0]?.loginUserId;
       this.getGridState();
      }
    })
  }

  getGridState()
  {
    if (this.caseStatus == "RESTRICTED") {
      this.state?.filter?.filters?.push(
        {filters:[{ 
          field: "eligibilityStatus",
          operator: "eq",
          value:this.caseStatus
        }]});
    } 
    this.gridFacade.loadGridState(this.loginUserId,GridStateKey.GRID_STATE,ModuleCode.CER_TRACKER)
    .subscribe({
      next: (x:any) =>{
        if(x){         
          this.state=JSON.parse(x?.gridStateValue || '{}') ;
          this.gridStateSubject.next(this.state)
        }       
      },
      error: (error:any) =>{
        this.gridFacade.hideLoader();
      }
    });        
    this.gridStateSubject.next(this.state)
  }

  loadCerTrackingDateListHandle() {
    this.cerTrackingFacade.getCerTrackingDatesList();
  }

  loadCerTrackingDataHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      trackingDate: gridDataRefinerValue.trackingDate,
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
      filter: gridDataRefinerValue.filter
    };

    this.pageSizes = this.cerTrackingFacade.gridPageSizes;
    this.cerTrackingFacade.getCerTrackingList(
      gridDataRefiner.trackingDate,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType,
      gridDataRefiner.filter
    );

    this.cerTrackingFacade.getCerTrackingDateCounts(gridDataRefiner.trackingDate);
  }

  saveCersState(state : AnalyserOptions){
    const gridState: any = {
      gridStateKey: GridStateKey.GRID_STATE,
      gridStateValue: JSON.stringify(state),
      moduleCode:ModuleCode.CER_TRACKER,
      parentModuleCode:ModuleCode.CER_TRACKER,
      userId:this.loginUserId
    };
    this.gridFacade.hideLoader();
    this.gridFacade.createGridState(gridState).subscribe({
      next: (x:any) =>{
        this.gridFacade.hideLoader();
      },
      error: (error:any) =>{
        this.gridFacade.hideLoader();
      }
    });
  }

  sendCerCount(param: {cerId: any, gridDataRefinerValue: any }){
    this.cerTrackingFacade.sendCerCount(param);
  }

  createCerSession(eligibilityId:string)
  {    
    if(eligibilityId)
    {
     const cerSessionData = {
        entityId: null,     
        assignedCwUserId: null,
        caseOriginCode: null,
        caseStartDate: null,
        clientCaseEligibilityId: eligibilityId,
      };
    this.workflowFacade.createNewSession(null ,cerSessionData)
    }
  }
}
