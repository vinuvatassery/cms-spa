import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'productivity-tools-event-log-description',
  templateUrl: './event-log-description.component.html',
  styleUrls: ['./event-log-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogDescriptionComponent {
  @Input() content: string = '';
  @Input() limit: number = 0;
  @Input() completeWords: boolean = false;

  urlSeparator:string= '!~!';
  titleOrlinkSeparator:string= '`';
  baseUrl:string='baseurl';
  anchorArray:any[]=[];
  data:any="";  
  hasUrl:boolean=false;

  constructor() {}

  ngOnInit() {
    this.formatContent();
    this.content = this.hasUrl ? this.data : this.content;
  }
  
  formatContent()
  {
    this.anchorArray=[];
    let anchorArray = this.content.split(this.urlSeparator);
    anchorArray.forEach((item: any) => {
      if(item.indexOf(this.baseUrl) !== -1)
      {
        let itemDataArray = item.split(this.titleOrlinkSeparator);
        let object = {
          url : itemDataArray[0].replace(this.baseUrl,window.location.origin),
          text : itemDataArray[1],
          title : itemDataArray[1],
          isUrlFlag : true            
        }
        this.anchorArray.push(object);
      }
      else
      {
        let object = {
          url : "",
          text : item,
          title : "",
          isUrlFlag : false            
        }
        this.anchorArray.push(object);
        this.data += item;
      }
    });
    let array = anchorArray.filter((res: any) =>
      res.indexOf(this.baseUrl) !== -1
    );
    this.hasUrl = array.length>0;
  }
}
