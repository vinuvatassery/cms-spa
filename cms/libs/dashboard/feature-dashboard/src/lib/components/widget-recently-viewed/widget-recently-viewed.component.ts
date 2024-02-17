 
import {
  Component,
  Renderer2,
  NgZone, 
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseStatusCode, FinancialVendorProviderTabCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { WidgetFacade } from '@cms/dashboard/domain'; 
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { State, process } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs'; 
 

 
@Component({
  selector: 'dashboard-widget-recently-viewed',
  templateUrl: './widget-recently-viewed.component.html',
  styleUrls: ['./widget-recently-viewed.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WidgetRecentlyViewedComponent
  implements OnInit,  OnDestroy
{
  public recentlyViewedClientsList$ =
    this.widgetFacade.recentlyViewedClientsList$;

    public recentlyViewedVendorsList$ =
    this.widgetFacade.recentlyViewedVendorsList$;

  public recentlyViewedClientsList: any;
  public recentlyViewedVendorsList: any;
  public state: State = {
    skip: 0,
    take: 10,
  };
  public gridData: any;
  public vendorGridData: any;
  private recentlyViewedClientsSubscription!: Subscription;
  private recentlyViewedVendorsSubscription!: Subscription;
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
 
  constructor(
    private renderer: Renderer2,
    private zone: NgZone,
    private widgetFacade: WidgetFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly changeDetector : ChangeDetectorRef
  ) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
  ngOnInit(): void {
    this.vendorGridData= null
    this.gridData = null
    this.loadRecentlyViewedClients();
    this.loadRecentlyViewedVendors();
   this.recentlyViewedClientsSubscription = this.recentlyViewedClientsList$.subscribe({
      next: (data) => { 
        this.recentlyViewedClientsList = data;
        this.gridData = process(this.recentlyViewedClientsList, this.state);
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('err', err);
      },
    });

    this.recentlyViewedVendorsSubscription = this.recentlyViewedVendorsList$.subscribe({
      next: (data) => { 
        this.recentlyViewedVendorsList = data;
        this.vendorGridData = process(this.recentlyViewedVendorsList, this.state);
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('err', err);
      },
    });


    console.log('original', this.gridData);
  }

  loadRecentlyViewedClients() {
    this.widgetFacade.loadRecentlyViewedClients();
  }

  loadRecentlyViewedVendors() {
    this.widgetFacade.loadRecentlyViewedVendors();
  }

  onCaseClicked(session: any) {
    const clientId = this.route.snapshot.queryParams['id'] ?? 0;
    const newApplicationStatus: string[] = [CaseStatusCode.incomplete];
    if (session && !newApplicationStatus.includes(session?.caseStatusCode) && clientId != session?.clientId) {
      this.router.navigate([`/case-management/cases/case360/${session?.clientId}`]);
      return;
    }

    const sessionId = this.route.snapshot.queryParams['sid'];
    if (sessionId !== session?.sessionId && newApplicationStatus.includes(session?.caseStatusCode)) {
      this.router.navigate(['case-management/case-detail'], {
        queryParams: {
          sid: session?.sessionId,
          eid: session?.entityId,
          wtc: session?.workflowTypeCode ? session?.workflowTypeCode : WorkflowTypeCode.NewCase
        }
      });
    }
  }

  onVendorClicked(vendorProfile:any){
    let tabCode = "";
    switch(vendorProfile.vendorTypeCode){
      case FinancialVendorTypeCode.DentalProviders : 
      tabCode = FinancialVendorProviderTabCode.DentalProvider
      break;
      case FinancialVendorTypeCode.MedicalProviders : 
      tabCode = FinancialVendorProviderTabCode.MedicalProvider
      break;
      case FinancialVendorTypeCode.InsuranceProviders :  
      tabCode = FinancialVendorProviderTabCode.InsuranceVendors
      break;
      case FinancialVendorTypeCode.Manufacturers :
        tabCode = FinancialVendorProviderTabCode.Manufacturers
        break;
      case FinancialVendorTypeCode.Pharmacy: 
      tabCode = FinancialVendorProviderTabCode.Pharmacy
      break;
      case FinancialVendorTypeCode.MedicalClinic : 
      tabCode = FinancialVendorProviderTabCode.MedicalProvider
      break;
      case FinancialVendorTypeCode.DentalClinic : 
      tabCode = FinancialVendorProviderTabCode.MedicalProvider
      break;
    }
    const query = {
      queryParams: {
        v_id: vendorProfile.vendorId,
        tab_code: tabCode
      },
    };
    this.router.navigate(['/financial-management/vendors/profile'], query)
  }

  public ngOnDestroy(): void {
    if(this.recentlyViewedClientsSubscription){
      this.recentlyViewedClientsSubscription.unsubscribe();

    }
    if(this.recentlyViewedVendorsSubscription){
      this.recentlyViewedVendorsSubscription.unsubscribe();
    }
  }
 
}
