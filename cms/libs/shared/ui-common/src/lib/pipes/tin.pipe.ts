import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tin'
  })
export class TinPipe implements PipeTransform {

    transform(value: any): any {
        if (value != null) {
          let val = value.replace(/\D/g, ''); 
          val = val.padStart(9, '0');
          val = val.replace(/^(\d{1})(\d{2})(\d{6})$/, '$1 $2-$3'); 
          return val;
        } else {
          return null;
        }
      }
}


