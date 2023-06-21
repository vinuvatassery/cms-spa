import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesOrNo',
})
export class YesOrNoPipe implements PipeTransform {
  transform(value: any,arg?:any): any {
    if(value != null){
    return value === 'Y'? 'Yes': 'No';
    }
    else return '';
  }
}
