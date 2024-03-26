import { ChangeDetectionStrategy, Component, Type, ViewContainerRef, inject } from '@angular/core';
import { ReminderNotificationSnackBarsTemplateComponent } from '../reminder-notification-snack-bar-template/reminder-notification-snack-bar-template.component';

@Component({
  selector: 'cms-reminder-notification-snack-bars',
  templateUrl: './reminder-notification-snack-bars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderNotificationSnackBarsComponent {

  getAds() {
    return [
      {
        component: ReminderNotificationSnackBarsTemplateComponent,
        inputs: { entityName: 'Dr. IQ', alertText: 'Smart as they come' },
      },
      {
        component: ReminderNotificationSnackBarsTemplateComponent,
        inputs: { entityName: 'Bombasto', alertText: 'Brave as they come' },
      },
      {
        component: ReminderNotificationSnackBarsTemplateComponent,
        inputs: {
          entityName: 'Hiring for several positions',
          alertText: 'Submit your resume today!',
        },
      },
      {
        component: ReminderNotificationSnackBarsTemplateComponent,
        inputs: {
          entityName: 'Openings in all departments',
          alertText: 'Apply today',
        },
      },
    ] as {component: Type<any>, inputs: Record<string, unknown>}[];
  }
  

  private adList = this.getAds()

  private currentAdIndex = 0;

  get currentAd() {
    return this.adList[this.currentAdIndex];
  }

  displayNextAd() {
    this.currentAdIndex++;
    // Reset the current ad index back to `0` when we reach the end of an array.
    if (this.currentAdIndex === this.adList.length) {
      this.currentAdIndex = 0;
    }
  }

}