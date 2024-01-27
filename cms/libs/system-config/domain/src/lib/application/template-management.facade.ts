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

  getDirectoryContent(typeCode:string, documentTemplateId?: string): any {
    return this.templateDataService.getDirectoryContent(typeCode, documentTemplateId);
  }

  getFormsandDocumentsViewDownload(id: string) {
    return this.templateDataService.getFormsandDocumentsViewDownload(id);
  }

}
