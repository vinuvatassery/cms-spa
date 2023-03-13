/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Template } from '../entities/template';
/** Data services **/
import { TemplateDataService } from '../infrastructure/template.data.service';

@Injectable({ providedIn: 'root' })
export class TemplateManagementFacade {
  /** Private properties **/
  private templateSubject = new BehaviorSubject<Template[]>([]);
  private templatesListSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  templates$ = this.templateSubject.asObservable();
  templatesList$ = this.templatesListSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly templateDataService: TemplateDataService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService) { }

  /** Public methods **/
  loadTemplates(): void {
    this.templateDataService.loadTemplates().subscribe({
      next: (templateResponse) => {
        this.templateSubject.next(templateResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  showSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.snackbarService.manageSnackBar(type, subtitle);
  }

  getTemplates(templateId?: string) {
    this.templateDataService.getTemplates(templateId).subscribe({
      next: (templateResponse) => {
        this.templatesListSubject.next(templateResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  getTemplatesViewDownload(templateId: string) {
    return this.templateDataService.getTemplatesViewDownload(templateId);
  }

  viewOrDownloadTemplate(eventType: string, templateId: string, templateName: string) {
    if (templateId === undefined || templateId === '') {
      return;
    }
    this.loaderService.show()
    this.getTemplatesViewDownload(templateId).subscribe({
      next: (data: any) => {

        const fileUrl = window.URL.createObjectURL(data);
        if (eventType === 'view') {
          window.open(fileUrl, "_blank");
        } else {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = templateName;
          downloadLink.click();
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.showSnackBar(SnackBarNotificationType.ERROR, error);
      }
    });
  }
}
