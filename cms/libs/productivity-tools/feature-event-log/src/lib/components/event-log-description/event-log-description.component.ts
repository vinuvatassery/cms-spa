import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

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

  isContentToggled: boolean = false;
  nonEditedContent: string = '';
  isShowReadMore: boolean = false;

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.formattingContent();
    this.content = this.hasUrl ? this.data : this.content;
    this.nonEditedContent = this.content;
    this.setReadmoreDisplay();
    this.cd.detectChanges();
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
    this.cd.detectChanges();
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }  
  
  formattingContent()
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
  hasUrl:boolean=false;
}
