 
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
} from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain'; 
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

  public recentlyViewedClientsList: any;
  public state: State = {
    skip: 0,
    take: 10,
  };
  public gridData: any;
  private recentlyViewedClientsSubscription!: Subscription;
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
 
  constructor(
    private renderer: Renderer2,
    private zone: NgZone,
    private widgetFacade: WidgetFacade
  ) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
  ngOnInit(): void {
    this.loadRecentlyViewedClients();

   this.recentlyViewedClientsSubscription = this.recentlyViewedClientsList$.subscribe({
      next: (data) => { 
        this.recentlyViewedClientsList = data;
        this.gridData = process(this.recentlyViewedClientsList, this.state);
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

 

  public ngOnDestroy(): void {
    if(this.recentlyViewedClientsSubscription){
      this.recentlyViewedClientsSubscription.unsubscribe();

    }
  }
 
}
