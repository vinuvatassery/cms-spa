import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { Subject } from 'rxjs';

@Component({
    selector: 'sub-event-detail',
    templateUrl: './sub-event-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubEventDetailComponent implements OnInit {
    @Input() eventId: any;
    eventListString: string = "";
    gridLoaderShow: boolean = false;
    subEventListsSubject = new Subject<any>();
    subEventLists$ = this.subEventListsSubject.asObservable();
    /** Constructor **/
    constructor(private systemInterfaceSupportFacade: SystemInterfaceSupportFacade) { }

    ngOnInit(): void {
        this.initializeGrid();
    }

    ngOnChanges(): void {
        this.initializeGrid();
      }
      initializeGrid() {
        this.gridLoaderShow = true; // Set loading flag to true
        this.systemInterfaceSupportFacade.getSubEventsByParentId(this.eventId).subscribe({
            next: (response: any) => {
                const gridView = {
                    data: response["items"],
                    total: response["totalCount"]
                  }; 
              this.subEventListsSubject.next(gridView);
              this.gridLoaderShow = false;
            },
            error: () => {
                this.gridLoaderShow = false;
            },
            complete: () => { 
                this.gridLoaderShow = false;
            }
          });

    }
}
