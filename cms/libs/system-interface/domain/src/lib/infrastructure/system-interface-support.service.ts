import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core'; 
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SystemInterfaceSupportService {
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

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

  
}