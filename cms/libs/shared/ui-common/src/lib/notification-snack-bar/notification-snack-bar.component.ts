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

@Component({
  selector: 'common-notification-snack-bar',
  templateUrl: './notification-snack-bar.component.html',
  styleUrls: ['./notification-snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSnackBarComponent implements OnInit {
  /** Input properties **/
  @Input() data$!: Observable<SnackBar>;

  /** Public properties **/
  @ViewChild('notificationAlertTemplate', { read: TemplateRef })
  alertTemplate!: TemplateRef<any>;
  snackbarMessage!: SnackBar;

  /** Constructor **/
  constructor(private readonly notificationService: NotificationService) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.data$.subscribe({
      next: (res) => {
        if (res) {
          this.snackbarMessage = res;
          this.notificationService.show({
            content: this.alertTemplate,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 500 },
            closable: false,
            type: { style: res.type, icon: true },
            hideAfter: 800,
          });
        }
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
