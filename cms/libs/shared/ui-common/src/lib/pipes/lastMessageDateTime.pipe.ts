import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'lastMessageDateTime',
})
export class LastMessageDateTimePipe implements PipeTransform {
  transform(value: any, arg?: any): any {
    if (value != null) {
      let pstDate = new Date(value).toLocaleString("en-US", {year: 'numeric', month: 'numeric', 
                    day: 'numeric', hour: '2-digit', minute: '2-digit'});
      let date = pstDate.split(',')[0];
      let time = pstDate.split(',')[1].split('.')[0];
      return date + ' @' + time;
    }
    else value;
  }
}
