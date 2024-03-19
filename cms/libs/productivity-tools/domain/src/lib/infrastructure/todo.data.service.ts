/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridFilterParam } from '@cms/case-management/domain';

/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Todo } from '../entities/todo';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class TodoDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadTodo(): Observable<Todo[]> {
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

  loadToDoSearch() {
    return of([
      { name: 'Donna Summer', id: 'XXXX', urn: 'XXX-XX-XXXX' },
      { name: 'David Miller', id: 'XXXX', urn: 'XXX-XX-XXXX' },
      { name: 'Philip David', id: 'XXXX', urn: 'XXX-XX-XXXX' },
      { name: 'Mike Flex', id: 'XXXX', urn: 'XXX-XX-XXXX' },
    ]);
  }

  loadAlerts(payload:any, alertTypeCode:any) {
    return this.http.put<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/${payload.alertType}`,payload.gridDataRefinerValue);
  }

  getTodoItem(alertId:any){  
    return this.http.get<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/${alertId}`);
  }
  createAlertItem(payload:any){  
      return this.http.post<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/${payload.type}`,payload);
    }
  markAlertAsDone (payload:any){  
    return this.http.post<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/markdone/${payload}`,null);
  }
  deleteAlert(payload:any){  
    return this.http.delete<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/${payload}`);
  }
  updateAlertItem(payload:any){
    return this.http.put<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts`,payload);

  }

   todoAndReminderByClient(clientId:any){  
    return this.http.post<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/clients/${clientId}`, null);
  }

  loadAlertsBanner(payload:any) {
    return this.http.get<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/banner/${payload}`);
  }
}

