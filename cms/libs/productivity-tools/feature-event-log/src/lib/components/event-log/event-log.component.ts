/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { DialogService } from '@progress/kendo-angular-dialog';

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
  clientId = 0
  events$ = this.eventLogFacade.events$;
  isShowEventLog = false;
  isOpenEventLogDetails = false;
  isShownSearch = false;
  isAddEventDialogOpen : any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Sort Ascending",
      icon: "arrow_upward",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Sort Descending",
      icon: "arrow_downward",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Filter",
      icon: "filter_list",
      click: (): void => {
      },
    },
  ];

  /** Constructor **/
  
  constructor(private readonly eventLogFacade: EventLogFacade, private dialogService: DialogService,
    private route: ActivatedRoute) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEvents();
    debugger
    this.clientId = this.route.snapshot.queryParams['id'];
  }

  /** Private methods **/
  private loadEvents(): void {
    this.eventLogFacade.loadEvents();
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
