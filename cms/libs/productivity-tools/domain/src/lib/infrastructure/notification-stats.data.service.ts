/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Event } from '../entities/event';
import { ConfigurationProvider } from "@cms/shared/util-core";

@Injectable({ providedIn: 'root' })
export class NotificationStatsDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  getStats(entityId:string, statsTypeCode:string) {
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notification-statistics/stats-by-entity-id?entityId=${entityId}&statsTypeCode=${statsTypeCode}`);
  }

  updateStats(entityId:string, entityTypeCode:string, statsTypeCode:string) {
    const statsDto ={
        EntityId: entityId,
        EntityTypeCode: entityTypeCode,
        StatsTypeCode: statsTypeCode, 
    };
    return this.http.post(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notification-statistics/stats`, statsDto);
  }

  resetStats(entityId:string, statsTypeCode:string) {
    const statsDto ={
        EntityId: entityId,
        StatsTypeCode: statsTypeCode, 
    };
    return this.http.post(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notification-statistics/reset-stats`, statsDto);
  }
  directMessageStats(entityId:string) {
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/direct-messages/count/${entityId}`);
  }
}
