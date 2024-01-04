/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
/** Facades **/
import { SearchFacade, CaseStatusCode, CaseFacade} from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { groupBy } from "@progress/kendo-data-query";
import {  BehaviorSubject, debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import {
  DropDownListComponent,
  MultiSelectComponent,
  VirtualizationSettings,
} from "@progress/kendo-angular-dropdowns";
import { ClientCase } from 'libs/case-management/domain/src/lib/entities/client-case';
export interface VendorList {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
 
}


export const vendorList: VendorList[] =  [];

@Component({
  selector: 'case-management-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, AfterViewInit {
  /** Public properties **/
  showHeaderSearchInputLoader = false;
  clientSearchResult$ = this.searchFacade.clientSearch$;
  data: ClientCase[] = [];
  mobileHeaderSearchOpen = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  filterManager: Subject<string> = new Subject<string>();
  searchBars$ = this.caseFacade.searchBars$
  searchForm!: FormGroup;
  searchHeaderTypeSubject = new Subject<any>()
  searchHeaderType$ = this.searchHeaderTypeSubject.asObservable()

  vendorList: any[] = groupBy(vendorList, [{ field: "title" }]);
  pageSize=20;
  public virtual: VirtualizationSettings = {
    itemHeight: 40,
    pageSize: 5,
    total:0||0
  };
  public state: { skip: number; take: number } = {
    skip: 0,
    take: 20,
  };
  private stateChange = new BehaviorSubject<any>(this.state);
  private stateSubscription: Subscription;

  @ViewChild("dropdownlist", { static: false })
  public dropdownlist!: DropDownListComponent;
  text: any = '';
  /** Constructor **/
  constructor(private readonly searchFacade: SearchFacade,private router: Router,
    private caseFacade: CaseFacade,
    private loggingService: LoggingService,
    private loaderService: LoaderService,private cdRef : ChangeDetectorRef,
    private readonly formBuilder: FormBuilder
   ) {
    this.filterManager
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(
 
      (text : any) =>
      {
        if(text && text.length >=2)
        {
          this.text = text;
          const take = this.virtual.total || 0; // Use 0 if this.virtual.total is undefined

        
            let takedata=0;
            if(take>this.state.take){
              takedata=take-this.state.take
            }else{
              takedata=this.state.take-take
            }
            
          this.searchFacade.loadCaseBySearchText(text,this.state.skip,this.pageSize);
          this.showHeaderSearchInputLoader = false;
 
        }
      }
 
    );
  this.showHeaderSearchInputLoader = false;

   this.stateSubscription = this.stateChange
      .subscribe((state: any) => {  
          console.log(state);
          this.state = state;
          
          let take = this.virtual.total || 0; // Use 0 if this.virtual.total is undefined
          let takedata=0;
              if(take>this.state.take){
                takedata=take-this.state.take
              }else{
                takedata=this.state.take-take
              }
          this.showHeaderSearchInputLoader = true;
          if(this.text.length >=2)
       
          this.searchFacade.loadCaseBySearchText(this.text,this.state.skip,this.pageSize);

      });
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.buildForm();
      this.clientSearchResult$.subscribe((data: any)=>{
        this.data = data.items;
        this.virtual.total=data.totalCount;
      this.showHeaderSearchInputLoader = false;
      this.cdRef.detectChanges();
    }) 

  }

  private buildForm() {
    this.searchForm =  this.formBuilder.group({
      itemSelected: []
    });
  }

  ngAfterViewInit() {
    
    this.searchBars$.subscribe((searchHeaderType: string) =>
    {
      if(searchHeaderType)
      {       
         this.searchHeaderTypeSubject.next(searchHeaderType);
         this.cdRef.detectChanges();
      }
    });    
  }

  public ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
  }

  public onDropDownListOpen(): void {    
    this.dropdownlist.optionsList.pageChange.subscribe((state) =>{
      
      console.log('onDropDownListOpen :'+state)
      this.stateChange.next(state)
    }
    
      
    );
  }
  public onDropDownListClose(): void {
    
    // optionsList is a reference to the internal kendo-list component used in the DropDownList popup
    // pass the current state to the stateChange BehaviorSubject on each pageChange event
    console.log('onDropDownListClose')
  }

  clickMobileHeaderSearchOpen(){
      this.mobileHeaderSearchOpen = !this.mobileHeaderSearchOpen
  }
  
  onSearchTextChange(selectedValue : string)
  {
    if(selectedValue && selectedValue.length >=2){
      this.showHeaderSearchInputLoader = true;
      this.filterManager.next(selectedValue);
    }
  }
  onSelectChange(selectedValue: any) {
    if (selectedValue !== undefined) {
      if (selectedValue) {
        if (selectedValue.caseStatus !== CaseStatusCode.incomplete) {
          this.router.navigate([`/case-management/cases/case360/${selectedValue.clientId}`]);
        }
        else {
          this.loaderService.show();
          this.caseFacade.getSessionInfoByCaseEligibilityId(selectedValue.clientCaseEligibilityId).subscribe({
            next: (response: any) => {
              if (response) {                
                this.loaderService.hide();
                this.router.navigate(['case-management/case-detail'], {
                  queryParams: {
                    sid: response.sessionId,
                    eid: response.entityID,                   
                    wtc: response?.workflowTypeCode
                  },
                });
              }
            },
            error: (err: any) => {
              this.loaderService.hide();
              this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
              this.loggingService.logException(err)
            }
          })
        }
      }
      this.searchForm.controls["itemSelected"].setValue(null);
      this.cdRef.detectChanges();
    }
  }

}


