import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any,arg?:any): any {
    if(value != null && value != ""){
      const areaCodeStr = value.slice(0,3);
      const midSectionStr = value.slice(3,6);
      const lastSectionStr = value.slice(6,9);

      return `(${areaCodeStr}) ${midSectionStr}-${lastSectionStr}`;
    }
    return "";
  }

}
