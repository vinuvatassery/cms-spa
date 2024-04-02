import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'common-read-more',
  templateUrl: './read-more.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadMoreComponent {
  @Input() content: string = '';
  @Input() limit: number = 0;
  @Input() completeWords: boolean = false;

  isContentToggled: boolean = false;
  nonEditedContent: string = '';
  isShowReadMore: boolean = false;
  urlSeparator:string= '!~!';
  titleOrlinkSeparator:string= '`';
  baseUrl:string='baseurl';
  anchorArray:any[]=[];
  data:any="";

  constructor() {}

  ngOnInit() {
    this.findAnchorTag();
    this.content = this.data;
    this.nonEditedContent = this.content;
    this.setReadmoreDisplay();
  }

  setReadmoreDisplay() {
    if (this.content.length > this.limit) {
      this.content = this.formatContent(this.content);
      this.isShowReadMore = true;
    }
  }

  toggleContent() {
    this.isContentToggled = !this.isContentToggled;
    this.content = this.isContentToggled
      ? this.nonEditedContent
      : this.formatContent(this.content);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
  
  findAnchorTag()
  {
    this.anchorArray=[];
    let anchorArray = this.content.split(this.urlSeparator);
    this.data=anchorArray[0];
    let array = anchorArray.filter((res: any) =>
        res.indexOf(this.baseUrl) !== -1
    );
    if(array.length>0)
    {
      array.forEach((item: any) => {
        let itemDataArray = item.split(this.titleOrlinkSeparator);
        let object={
          url : itemDataArray[0].replace(this.baseUrl,window.location.origin),
          text : itemDataArray[1],
          title : itemDataArray[1]            
        }
        this.anchorArray.push(object);
      });
    }
  }
}
