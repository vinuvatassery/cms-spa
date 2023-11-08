import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tin',
})
export class TinPipe implements PipeTransform {
  transform(value: any, arg?: any): any {
    if (value != null) {
      let val = value.replace(/\D/g, '');
      if (value.length === 10) {
        return val.replace(/(\d+)(\d{2})(\d{7})/, '$1 $2-$3');
      }
      else {
        return val.replace(/(\d{2})(\d{7})/, '$1-$2');
      }
    }
    else return null;
  }
}
