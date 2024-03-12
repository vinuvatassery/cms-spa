/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

@Component({
  selector: 'common-alert-banner',
  templateUrl: './alert-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBannerComponent implements OnInit {
  /** Input properties **/
  // @Input() data$!: Observable<SnackBar>;
  @Input() entityId:any;
  @Input() entityType:any;
  @Input() alertTypeCode:any;
  @Input()  alertList$ :any;
  @Output() isLoadAlertListEvent = new EventEmitter<any>();

  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =this.configurationProvider.appSettings.snackbarAnimationDuration;
  showMoreAlert = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {

      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {

      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {

      },
    },
  ];
  /** Constructor **/
  constructor(private configurationProvider : ConfigurationProvider) {

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    //alert(this.entityId)
    this.loadTodoGridData();
    this.isLoadAlertListEvent.emit();
    // this.data$.subscribe({
    //   next: (res) => {
    //     if (res) {
    //       // this.notificationService.show({
    //       //   content: this.alertTemplate,
    //       //   position: { horizontal: 'center', vertical: 'top' },
    //       //   animation: { type: 'fade', duration: this.duration },
    //       //   closable: false,
    //       //   type: { style: res.type, icon: true },
    //       //   hideAfter: this.hideAfter,
          
    //       // });
    //     }
    //   },
    //   error: (err) => {
    //     console.error('err', err);
    //   },
    // });
  }  
  private loadTodoGridData(){
    debugger;
      //this.isToDoGridLoaderShow.next(true);
      let alertType=this.alertTypeCode;
      var xfilter=[
        {"filters":[{"field":"entityId","operator":"eq","value":this.entityId},
        {"field":"entityTypeCode","operator":"eq","value":this.entityType},
        {"field":"alertTypeCode","operator":"eq","value":this.alertTypeCode}
      ],"logic":"and"}
      ]; 
      const gridDataRefinerValue = {
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'alertDueDate',
        sortType: 'asc',
        filter: xfilter,
      }; 
        this.isLoadAlertListEvent.emit({gridDataRefinerValue, alertType})

        this.alertList$.subscribe((data: any) => {
          var xyz = data?.items;
          if(data?.totalCount >=0 || data?.totalCount === -1){
            //this.isToDoGridLoaderShow.next(false);
          }
          //this.gridTodoDataSubject.next(this.gridDataResult);
        });
  } 
}
