import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SystemInterfaceSupportService {
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }
  private distributionBaseUrl = '/system-interface/interface-support/distribution';

  getSupportGroup(): Observable<any> {
    return of([
      {
        id: 1,
        interface: 'McKesson',
        groupName: 'Order',
        perGroup: 'MM/DD/YYYY',
        lastModified: 'MM/DD/YYYY',
        status: 'Failed',

      },
      {
        id: 2,
        interface: 'McKesson',
        groupName: 'Order',
        perGroup: 'MM/DD/YYYY',
        lastModified: 'MM/DD/YYYY',
        status: 'Failed',
      },
      {
        id: 3,
        interface: 'McKesson',
        groupName: 'Order',
        perGroup: 'MM/DD/YYYY',
        lastModified: 'MM/DD/YYYY',
        status: 'Failed',
      },
      {
        id: 4,
        interface: 'McKesson',
        groupName: 'Order',
        perGroup: 'MM/DD/YYYY',
        lastModified: 'MM/DD/YYYY',
        status: 'Failed',
      },

    ]);
  }
  getDistributionLists(): Observable<any> {
    return of([
      {
        id: 1,
        email: 'McKesson@email.com',
        firstName: 'Fname',
        lastName: 'Lname',
        status: 'Failed',
      },
      {
        id: 2,
        email: 'McKesson@email.com',
        firstName: 'Fname',
        lastName: 'Lname',
        status: 'Failed',
      },
      {
        id: 3,
        email: 'McKesson@email.com',
        firstName: 'Fname',
        lastName: 'Lname',
        status: 'Failed',
      },
      {
        id: 4,
        email: 'McKesson@email.com',
        firstName: 'Fname',
        lastName: 'Lname',
        status: 'Failed',
      },

    ]);
  }

  loadNotificationCategoryServices() {
    return of([
      {
        id: 1,
        notificationCategory: 'McKesson',
        description: 'Order',
        status: 'MM/DD/YYYY',

      },
      {
        id: 2,
        notificationCategory: 'McKesson',
        description: 'Order',
        status: 'MM/DD/YYYY',
      },
      {
        id: 3,
        notificationCategory: 'McKesson',
        description: 'Order',
        status: 'MM/DD/YYYY',
      },
      {
        id: 4,
        notificationCategory: 'McKesson',
        description: 'Order',
        status: 'MM/DD/YYYY',
      },

    ]);
  }

  addSupportGroup(notificationGroup: any) {

    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/support-group`, notificationGroup);
  }
  editSupportGroup(notificationGroupId: string, notificationGroup: any) {
    const body = {
      groupCode: notificationGroup.groupCode,
      groupName: notificationGroup.groupName,
      groupDesc: notificationGroup.groupDesc
    }
    return this.http.put(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/interface-support/support-group/${notificationGroupId}`, body);
  }
  getSupportGroupList(paginationParameters: any) {
    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/support-group/support-group-list`, paginationParameters);
  }

  changeSupportGroupStatus(notificationGroupId: string, status: boolean) {
    const options = {
      status: status,
    }
    return this.http.patch(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/interface-support/support-group/${notificationGroupId}`, options
    );
  }

  deleteSupportGroup(notificationGroupId: string, isHardDelete: boolean) {
    const options = {
      body: {
        hardDelete: isHardDelete,
      }
    }
    return this.http.delete(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/interface-support/support-group/${notificationGroupId}`, options
    );
  }

  // distribution ----------------------------------------
  getDistributionList(paginationParameters: any) {
    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/distribution/list`, paginationParameters);
  }

  addDistributionListUser(user: any) {
    debugger;
    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/distribution`, user);
  }



  // Notification Category Services 


  getNotificationCategoryList(paginationParameters: any) {
    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/notification-category/list`, paginationParameters);
  }

  addNotificationCategory(eventNotificationGroup: any) {

    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/notification-category`, eventNotificationGroup);
  }

  editNotificationCategory(eventNotificationGroupId: string, eventNotificationGroup: any) {
    const body = {
      eventId: eventNotificationGroup.eventId
    }
    return this.http.put(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/interface-support/notification-category/${eventNotificationGroupId}`, body);
  }

  changeNotificationCategoryStatus(eventNotificationGroupId: string, status: boolean) {
    const options = {
      status: status,
    }
    return this.http.patch(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/interface-support/notification-category/${eventNotificationGroupId}`, options
    );
  }

  deleteNotificationCategory(eventNotificationGroupId: string, isHardDelete: boolean) {
    const options = {
      body: {
        hardDelete: isHardDelete,
      }
    }
    return this.http.delete(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/interface-support/notification-category/${eventNotificationGroupId}`, options
    );
  }

  getEventLovList(groupCode: string) {
    return this.http.get<any[]>(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}` + `/system-interface/interface-support/notification-category/events-list/${groupCode}`);
  }
  // ----------------------------------------

  // distribution list ----------------------------------------
  changeDistributionListUserStatus(memberId: string, status: boolean) {
    const options = {
      status: status,
    }
    return this.http.post(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}${this.distributionBaseUrl}/${memberId}`, options);
  }

  deleteDistributionListUser(memberId: string) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}${this.distributionBaseUrl}/${memberId}`);
  }

  editDistributionListUser(body: any) {
    return this.http.put(`${this.configurationProvider.appSettings.sysInterfaceApiUrl}${this.distributionBaseUrl}/${body.notificationUserId}`, body);
  }
  // ----------------------------------------

}