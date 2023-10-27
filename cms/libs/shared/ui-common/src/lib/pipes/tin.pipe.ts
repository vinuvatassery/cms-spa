import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tin',
})
export class TinPipe implements PipeTransform {
  transform(value: any,arg?:any): any {
    if(value != null){
    let val = value.replace(/\D/g, '');  
    return val.replace(/(\d{1})(\d{2})(\d{6})/, '$1 $2-$3');  
    }
    else return null;
  }
}
