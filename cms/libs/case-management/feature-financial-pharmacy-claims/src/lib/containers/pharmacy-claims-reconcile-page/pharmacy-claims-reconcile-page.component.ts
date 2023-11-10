import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade } from '@cms/case-management/domain'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-pharmacy-claims-reconcile-page',
  templateUrl: './pharmacy-claims-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsReconcilePageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialPharmacyClaimsFacade.sortValueReconcile;
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
   sort = this.financialPharmacyClaimsFacade.sortReconcileList;
   state!: State;
   reconcileGridLists$ = this.financialPharmacyClaimsFacade.reconcileDataList$;
   batchId:any;

  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private readonly route: ActivatedRoute,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private documentFacade :  DocumentFacade
  ) {}

  ngOnInit(): void { 
    //this.addNavigationSubscription();    
  }

 

  loadReconcileListGrid(event: any) { 
    debugger;
    this.financialPharmacyClaimsFacade.loadReconcileListGrid(this.batchId,event);
  }
}
