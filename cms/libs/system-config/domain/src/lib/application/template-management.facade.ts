/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService,ConfigurationProvider, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Template } from '../entities/template';
/** Data services **/
import { TemplateDataService } from '../infrastructure/template.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class TemplateManagementFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueClientNotification = 'scenario'; 
  public sortClientNotificationGrid: SortDescriptor[] = [{
    field: this.sortValueClientNotification,
  }];
  public sortValueEmailTemplates = 'creationTime'; 
  public sortEmailTemplatesGrid: SortDescriptor[] = [{
    field: this.sortValueEmailTemplates,
  }];
  public sortValueLetterTemplates = 'creationTime'; 
  public sortLetterTemplatesGrid: SortDescriptor[] = [{
    field: this.sortValueLetterTemplates,
  }];
  public sortValueFunds = 'creationTime'; 
  public sortFundsGrid: SortDescriptor[] = [{
    field: this.sortValueFunds,
  }];
  public sortValueFromsDocs = 'creationTime'; 
  public sortFromsDocsGrid: SortDescriptor[] = [{
    field: this.sortValueFromsDocs,
  }];
  public sortValueSmsTextTemplates = 'creationTime'; 
  public sortSmsTextTemplatesGrid: SortDescriptor[] = [{
    field: this.sortValueSmsTextTemplates,
  }];
  public sortValueLayoutTemplates = 'creationTime'; 
  public sortLayoutTemplatesGrid: SortDescriptor[] = [{
    field: this.sortValueLayoutTemplates,
  }];
 

  /** Private properties **/
  private templateSubject = new BehaviorSubject<Template[]>([]);
  private clientNotificationDefaultsListsSubject = new BehaviorSubject<any>([]);
  private emailTemplatesListsSubject = new BehaviorSubject<any>([]); 
  private letterTemplatesListsSubject = new BehaviorSubject<any>([]); 
  private smsTextTemplatesListsSubject = new BehaviorSubject<any>([]); 
  private templatesListSubject = new BehaviorSubject<any>([]);
  private layoutTemplatesListSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  templates$ = this.templateSubject.asObservable();
  clientNotificationDefaultsLists$ = this.clientNotificationDefaultsListsSubject.asObservable();
  emailTemplatesLists$ = this.emailTemplatesListsSubject.asObservable();
 letterTemplatesLists$ = this.letterTemplatesListsSubject.asObservable();
  smsTextTemplatesLists$ = this.smsTextTemplatesListsSubject.asObservable();
  templatesList$ = this.templatesListSubject.asObservable();
  layoutTemplatesList$ = this.layoutTemplatesListSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly templateDataService: TemplateDataService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly configurationProvider: ConfigurationProvider) { }

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

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.snackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  getDirectoryContent(typeCode:string, documentTemplateId?: string): any {
    return this.templateDataService.getDirectoryContent(typeCode, documentTemplateId);
  }

  getFormsandDocumentsViewDownload(id: string) {
    return this.templateDataService.getFormsandDocumentsViewDownload(id);
  }



  loadClientNotificationDefaultsLists(
    skipcount: number,
    sort: string,
    sortType: string,
    filter:string,
  ) {
    this.showLoader();
    filter = JSON.stringify(filter);
    this.templateDataService.loadClientNotificationDefaultsLists(skipcount,
      sort,
      sortType,
      filter)
      .subscribe({
        next: (response:any) => {
          if (response) {
            this.hideLoader();
            const gridView = {
              data: response['items'],
              total: response['totalCount'],
            };
          this.clientNotificationDefaultsListsSubject.next(gridView);
        }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }


  loadEmailTemplateLists() {
    this.templateDataService
      .loadEmailTemplatesListsService()
      .subscribe({
        next: (response) => {
          this.emailTemplatesListsSubject.next(response);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
  loadLetterTemplateLists() {
    this.templateDataService
      .loadTemplatesListsService()
      .subscribe({
        next: (response) => {
          this.letterTemplatesListsSubject.next(response);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  loadSmsTextTemplateLists() {
    this.templateDataService
      .loadTemplatesListsService()
      .subscribe({
        next: (response) => {
          this.smsTextTemplatesListsSubject.next(response);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
  loadLayoutTemplateLists() {
    this.templateDataService
      .loadLayoutTemplatesListsService()
      .subscribe({
        next: (response) => {
          this.layoutTemplatesListSubject.next(response);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

}
