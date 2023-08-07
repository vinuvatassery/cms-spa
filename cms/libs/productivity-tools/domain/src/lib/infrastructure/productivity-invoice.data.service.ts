/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class ProductivityInvoiceDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/
 
  loadInvoiceListService(state:any,tabCode:any,sortValue:any,sortType:any) {  
    return of([
      {
        invoiceNbr: 1, 
        batchName: 'Attention', 
        clientName: 'Attention', 
        insuranceCardName: 'Attention', 
        clientId: 'xxxx', 
        serviceCount: 'xxxx', 
        totalCost: 'xxx', 
        totalDue: 'xx/xx/xxxx', 
        paymentStatusDesc: '12/2019',
        checkReconcileDate: 'Immediate',
        warrant: 'Expense',
        entryDate: 'Rent Deposit',
        typeOfUtility: 'Electric',
        amount: '(572.00)',
        fundingSource: 'Formula',
        paymentMethod: 'Check',
        frequency: 'One Time',
        serviceProvider: 'Post Centennial Park', 
        status: 'Submitted', 
        URN: '102456',
        clientNumber: '00000543',
        name: 'Sarah Phillips (Josh)',
        pcaCode: 'Code X',
        glAccount: '00000000', 
        sendBackNotes:'notes',
      },
      
      
     
    ]);    
    }
 

}
