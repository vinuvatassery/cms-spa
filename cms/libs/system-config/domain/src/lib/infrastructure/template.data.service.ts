/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Data services **/
import { Template } from '../entities/template';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class TemplateDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
   ) { }

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

  getDirectoryContent(typeCode:any ,filepath?: any) {
    let params = new HttpParams();
    params = params.append('templateId',filepath);
    params = params.append('typeCode',typeCode);
    return this.http.get(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}` + '/system-config/templates/browsefiles',{params:params}
    );
  }

  getFormsandDocumentsViewDownload(templateId: string) {
    let roleId = "";
    let url = `/system-config/templates/${templateId}/content`;
    return this.http.get(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}` + url+ `/${roleId}`
      , {
        responseType: 'blob'
      });
  }

}
