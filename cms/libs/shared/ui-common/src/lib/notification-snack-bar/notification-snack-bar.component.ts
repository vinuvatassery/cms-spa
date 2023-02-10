/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Entities **/
import { SnackBar } from '../entities/snack-bar';
/** Services **/
import { NotificationService } from '@progress/kendo-angular-notification';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

@Component({
  selector: 'common-notification-snack-bar',
  templateUrl: './notification-snack-bar.component.html',
   styleUrls: ['./notification-snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSnackBarComponent implements OnInit {
  /** Input properties **/
  @Input() data$!: Observable<SnackBar>;
  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =this.configurationProvider.appSettings.snackbarAnimationDuration;
  /** Public properties **/
  @ViewChild('notificationAlertTemplate', { read: TemplateRef })
  alertTemplate!: TemplateRef<any>;
  snackbarMessage!: SnackBar;


  /** Constructor **/
  constructor(private readonly notificationService: NotificationService,
    private configurationProvider : ConfigurationProvider) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.data$.subscribe({
      next: (res) => {
        this.removePreviousMessage()
        if (res) {
          this.snackbarMessage = res;
          this.notificationService.show({
            content: this.alertTemplate,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: this.duration },
            closable: false,
            type: { style: res.type, icon: true },
            hideAfter: this.hideAfter,
          });
        }
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }   

  private removePreviousMessage()
  {      
   const divMessage = document.getElementsByClassName("k-notification-container ng-star-inserted");
   if(divMessage.length > 0)
     {    
      var currentMessgae = divMessage.item(0);
      currentMessgae?.remove(); 
    }
   }


}
