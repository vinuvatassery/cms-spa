import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { LoaderService } from '@cms/shared/util-core';
import { SystemInterfaceSupportFacade } from '@cms/system-interface/domain';
import { Subject, first } from 'rxjs';

@Component({
    selector: 'sub-event-detail',
    templateUrl: './sub-event-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubEventDetailComponent implements OnInit {
    @Input() eventId: any;
    eventListString: string = "";
    isLoading: boolean = false;
    subEventListsSubject = new Subject<any>();
    subEventLists$ = this.subEventListsSubject.asObservable();
    /** Constructor **/
    constructor(private systemInterfaceSupportFacade: SystemInterfaceSupportFacade) { }

    ngOnInit(): void {
        this.loadSubEvent();
    }

    ngOnChanges(): void {
        this.loadSubEvent();
      }
    loadSubEvent() {
        this.isLoading = true; // Set loading flag to true
        this.systemInterfaceSupportFacade.getSubEventsByParentId(this.eventId).subscribe({
            next: (response) => {
                const eventListString = response
                .sort((a, b) => a.eventDesc.localeCompare(b.eventDesc))
                .map(event => `- ${event?.eventDesc ?? ''}`)
                .join('\n');
              this.subEventListsSubject.next(response);
              this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => { 
                this.isLoading = false;
            }
          });

    }
}
