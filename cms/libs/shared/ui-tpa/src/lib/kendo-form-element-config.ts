 
import { Injectable } from '@angular/core';
import { groupBy } from '@progress/kendo-data-query';
import { NumberFormatOptions, IntlService } from "@progress/kendo-angular-intl";
import { FileRestrictions } from '@progress/kendo-angular-upload';
export class UploadFileRistrictionOptions  {
 public fileRestrictions: FileRestrictions = {
    maxFileSize: 2500000,
  };
}

export class CurrencyFormat  {
  public currencyFormatOptions: NumberFormatOptions = {
    style: "currency",
    currency: "USD",
     currencyDisplay: "symbol",
    minimumFractionDigits: 2,
  };
}

@Injectable({ providedIn: 'root' })
export class IntlDateService {

  constructor(public intl: IntlService){

  }

  formatDate(date:any,format:any){
    return this.intl.formatDate(date, format);
  }
}

@Injectable({ providedIn: 'root' })
export class DataQuery {

  groupBy(data:any,options:any){
    return groupBy(data,options); 
  }
}
