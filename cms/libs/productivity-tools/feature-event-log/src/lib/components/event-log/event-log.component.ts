/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'productivity-tools-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponent implements OnInit {
  /** Output properties **/
  @Output() closeAction = new EventEmitter();

  /** Public properties **/
  events$ = this.eventLogFacade.events$;
  events: any = [];
  isShowEventLog = false;
  isOpenEventLogDetails = false;
  isShownSearch = false;
  isAddEventDialogOpen: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Sort Ascending',
      icon: 'arrow_upward',
      click: (): void => {},
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Sort Descending',
      icon: 'arrow_downward',
      click: (): void => {},
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Filter',
      icon: 'filter_list',
      click: (): void => {},
    },
  ];
  filterData: any = { logic: 'and', filters: [] };

  /** Constructor **/

  constructor(
    private readonly eventLogFacade: EventLogFacade,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEvents();
    this.subscribeEvents();
  }

  /** Private methods **/
  private loadEvents(): void {
    this.createFilterData('1');
    const paginationData = {
      skipCount: 0,
      pagesize: 10,
      sortColumn: 'creationTime',
      sortType: "desc",
      filter: JSON.stringify(this.filterData),
    };
    this.eventLogFacade.loadEvents("1", paginationData);
  }

  createFilterData(data: string){
    this.filterData = [
      {
        filters: [{ field: 'entityId', operator: 'eq', value: data }],
        logic: 'and',
      },
    ];
  }

  private subscribeEvents() {
    this.events$.subscribe((data) => {
      this.events = data;
      this.cd.detectChanges();
    });
  }

  onShowSearchClicked() {
    this.isShownSearch = !this.isShownSearch;
  }

  onCloseEventLogClicked() {
    this.closeAction.emit();
    this.isShowEventLog = !this.isShowEventLog;
  }

  onOpenEventDetailsClicked(template: TemplateRef<unknown>): void {
    this.isAddEventDialogOpen = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }
  onCloseEventDetailsClicked(data: any) {
    if (data) {
      this.isAddEventDialogOpen.close();
    }
  }

  
}
