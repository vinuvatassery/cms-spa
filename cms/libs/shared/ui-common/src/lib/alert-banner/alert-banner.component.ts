/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
  constructor(private configurationProvider : ConfigurationProvider) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {   
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
}
