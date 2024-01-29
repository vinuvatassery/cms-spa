import { AnimationKeyframesSequenceMetadata } from '@angular/animations';
import {
  Component,
  Renderer2,
  NgZone,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain'; 
import { State, process } from '@progress/kendo-data-query';
import { Subscription, fromEvent } from 'rxjs'; 
 

 
@Component({
  selector: 'dashboard-widget-recently-viewed',
  templateUrl: './widget-recently-viewed.component.html',
  styleUrls: ['./widget-recently-viewed.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WidgetRecentlyViewedComponent
  implements OnInit,  OnDestroy
{
  public recentlyViewedProfileList$ =
    this.widgetFacade.recentlyViewedProfileList$;

  public recentlyViewedProfileList: any;
  public state: State = {
    skip: 0,
    take: 10,
  };
  public gridData: any;
  private currentSubscription!: Subscription;

  constructor(
    private renderer: Renderer2,
    private zone: NgZone,
    private widgetFacade: WidgetFacade
  ) {}

  ngOnInit(): void {
    this.loadRecentlyViewedProfiles();

    this.recentlyViewedProfileList$.subscribe({
      next: (profiles) => {
        console.log(profiles);
        this.recentlyViewedProfileList = profiles;
        this.gridData = process(this.recentlyViewedProfileList, this.state);
      },
      error: (err) => {
        console.error('err', err);
      },
    });

    console.log('original', this.gridData);
  }

  loadRecentlyViewedProfiles() {
    this.widgetFacade.loadRecentlyViewedProfiles();
  }

 

  public ngOnDestroy(): void {
    this.currentSubscription.unsubscribe();
  }

 
 

 
}
