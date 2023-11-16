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
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Subscription, fromEvent } from 'rxjs';
import { tap, take } from 'rxjs/operators';

const tableRow = (node: any) => node.tagName.toLowerCase() === 'tr';

export const closest = (node: any, predicate: any) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};

@Component({
  selector: 'cms-widget-recently-viewed',
  templateUrl: './widget-recently-viewed.component.html',
  styleUrls: ['./widget-recently-viewed.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WidgetRecentlyViewedComponent
  implements OnInit, AfterViewInit, OnDestroy
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

  public ngAfterViewInit(): void {
    this.currentSubscription = this.handleDragAndDrop();
  }

  public ngOnDestroy(): void {
    this.currentSubscription.unsubscribe();
  }

  public dataStateChange(state: State): void {
    this.state = state;
    this.gridData = process(this.recentlyViewedProfileList, this.state);

    this.currentSubscription.unsubscribe();
    this.zone.onStable
      .pipe(take(1))
      .subscribe(() => (this.currentSubscription = this.handleDragAndDrop()));
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging,
    };
  }

  private handleDragAndDrop(): Subscription {
    const sub = new Subscription(() => {});
    let draggedItemIndex: number;

    const tableRows = Array.from(document.querySelectorAll('.k-grid tr'));
    tableRows.forEach((item) => {
      this.renderer.setAttribute(item, 'draggable', 'true');
      const dragStart = fromEvent<DragEvent>(item, 'dragstart');
      const dragOver = fromEvent(item, 'dragover');
      const dragEnd = fromEvent(item, 'dragend');
      // console.log(tableRows);
      sub.add(
        dragStart
          .pipe(
            tap(({ dataTransfer }) => {
              try {
                const dragImgEl = document.createElement('span');
                dragImgEl.setAttribute(
                  'style',
                  'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;'
                );
                document.body.appendChild(dragImgEl);
                dataTransfer!.setDragImage(dragImgEl, 0, 0);
              } catch (err) {
                // IE doesn't support setDragImage
              }
              try {
                // Firefox won't drag without setting data
                dataTransfer!.setData('application/json', '');
              } catch (err) {
                // IE doesn't support MIME types in setData
              }
            })
          )
          .subscribe(({ target }) => {
            const row: HTMLTableRowElement = <HTMLTableRowElement>target;
            draggedItemIndex = row.rowIndex - 1;
            const dataItem = this.gridData.data[draggedItemIndex];
            // console.log(row);
            console.log('drag', draggedItemIndex);
            // console.log(draggedItemIndex);
            // console.log(dataItem);
            dataItem.dragging = true;
          })
      );

      sub.add(
        dragOver.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.gridData.data.splice(draggedItemIndex, 1)[0];
          const dropIndex = closest(e.target, tableRow).rowIndex - 1;
          const dropItem = this.gridData.data[dropIndex];
          // console.log(dataItem);
          // console.log(dropItem);
          console.log('drop', draggedItemIndex, dropIndex);
          draggedItemIndex = dropIndex;
          this.zone.run(() => {
            this.gridData.data.splice(dropIndex, 0, dataItem);
          });
        })
      );

      sub.add(
        dragEnd.subscribe((e: any) => {
          e.preventDefault();
          console.log('end dragging');
          const dataItem = this.gridData.data[draggedItemIndex];
          dataItem.dragging = false;
        })
      );
    });

    return sub;
  }
}
