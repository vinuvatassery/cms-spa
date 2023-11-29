import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ndcCode',
})
export class NdcCodePipe implements PipeTransform {
  transform(value: any, arg?: any): any {
    if (value != null) {
      let val = value.replace(/\D/g, '');
      if (value.length === 11) {
        return val.replace(/(\d{5})(\d{4})(\d{2})/, '$1-$2-$3');
      }
      else {
        return val.replace(/(\d{4})(\d{4})(\d{2})/, '$1-$2-$3');
      }
    }
    else return null;
  }
}