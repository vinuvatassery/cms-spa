import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'ssn',
})
export class SsnPipe implements PipeTransform {
  transform(value: any,arg?:any): any {
    if(value != null){
    let val = value.replace(/\D/g, '');
    val = val.replace(/^(\d{3})/, '$1-');
    val = val.replace(/-(\d{2})/, '-$1-');
    val = val.replace(/(\d)-(\d{4}).*/, '$1-$2');
    return val;
    }
    else return null;
  }
}


