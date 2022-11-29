 
import { NumberFormatOptions } from "@progress/kendo-angular-intl";
import { FileRestrictions } from '@progress/kendo-angular-upload';
 
export class UploadFileRistrictionOptions  {
 public fileRestrictions: FileRestrictions = {
    maxFileSize: 2500000,
  };
}

export class CurrencyFromat  {
  public currencyFormatOptions: NumberFormatOptions = {
    style: "currency",
    currency: "USD",
     currencyDisplay: "symbol",
    minimumFractionDigits: 2,
  };
}