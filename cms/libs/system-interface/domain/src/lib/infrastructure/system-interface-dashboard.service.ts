import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable, of } from 'rxjs';   
@Injectable({
  providedIn: 'root',
})
export class SystemInterfaceDashboardService {
  constructor(private http: HttpClient) {}

 
  getDashboardContent(): Observable<any[]> {
    return of([
      {
    
        component: 'ClientByStatus',
        widgetChartConfig:{ 
          title:{
            text:'Program Expenses'
          },
          legend:{ 
            position:'right',
            orientation: 'vertical',
           
          },
          categoryAxis:{
            categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
          },
          series:[
            
              {
                data: [
                  {
                    category: 'UPP',
                    value: 45,
                    color: '#FFD064',
                  },
                  {
                    category: 'GROUP I',
                    value: 15,
                    color: '#ED6363',
                  },
                  {
                    category: 'GROUP II',
                    value: 10,
                    color: '#57BAC3',
                  },
                  {
                    category: 'BRIDGE',
                    value: 10,
                    color: '#0063A6',
                  },
                  {
                    category: 'GROUP I / INS GAP',
                    value: 10,
                    color: '#BF61A5',
                  },
                  {
                    category: 'GROUP II / INS GAP',
                    value: 10,
                    color: '#D8D365',
                  },
                ],
            
              type:'donut',
              color:'red'
            },
          ]
        }
        
      },
  
      {
    
        component: 'ClientByStatus',
        widgetChartConfig: {
          title: {
            text: 'ACTIVE CLIENTS BY GROUP',
           
          },
          legend: { 
            position: 'top',
            orientation: 'horizontal',
          },
          categoryAxis:{
            categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
          },
          series: [
            {
              data: [
                {
                  category: 'UPP',
                  value: 45,
                  color: '#FFD064',
                },
                {
                  category: 'GROUP I',
                  value: 15,
                  color: '#ED6363',
                },
                {
                  category: 'GROUP II',
                  value: 10,
                  color: '#57BAC3',
                },
                {
                  category: 'BRIDGE',
                  value: 10,
                  color: '#0063A6',
                },
                {
                  category: 'GROUP I / INS GAP',
                  value: 10,
                  color: '#BF61A5',
                },
                {
                  category: 'GROUP II / INS GAP',
                  value: 10,
                  color: '#D8D365',
                },
              ],
              type: 'donut',
              color: 'red',
            },
          ],
        },
      },
    
    ]);
  }

 
  loadActivityLogListsServices() {
    return of([
      {
        id: 1,
        interface: 'McKesson',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Failed',
        totalRecords: 100,
        failedRecords: 4,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM', 
      },
      {
        id: 2,
        interface: 'OHA',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Success',
        totalRecords: 100,
        failedRecords: 0,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM', 
      },
      {
        id: 3,
        interface: 'Kaiser',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Success',
        totalRecords: 100,
        failedRecords: 0,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM', 
      },
      {
        id: 4,
        interface: 'Surveillance',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Success',
        totalRecords: 100,
        failedRecords: 0,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM', 
      },
      
    ]);
  }
}
