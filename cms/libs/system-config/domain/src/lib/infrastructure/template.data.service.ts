/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Data services **/
import { Template } from '../entities/template';
import { ConfigurationProvider } from 'libs/shared/util-core/src/lib/shared-util-core.module';

@Injectable({ providedIn: 'root' })
export class TemplateDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  /** Public methods **/
  loadTemplates(): Observable<Template[]> {
    return of([
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }

  //NOSONAR TODO - Add API to fetch templates
  getTemplates(templateId?: string) {
    //NOSONAR let url = `/case-management/templates` + (!!templateId ? `?templateId=${templateId}` : '');
    // return this.http.get(
    //   `${this.configurationProvider.appSettings.caseApiUrl}` + url
    // );
  }

}
