import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConstantValue } from '@cms/productivity-tools/domain';

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
  isViewLetter:boolean = false;
  isViewEmail:boolean = false;
  isViewSmsText:boolean = false;
  viewText:string = '';
  isViewLetterEmailTextDialog:boolean = false;
  ViewLetter:string = "{View Letter}";
  ViewEmail:string = "{View Email}";
  ViewSmsText:string = "{View Text(s)}";
  
  constructor() {}

  ngOnInit() {
    this.formatContent();
    this.content = this.data;
  }

  setHasUrl(anchorArray:any)
  {
    let array = anchorArray.filter((res: any) =>
      res.indexOf(this.baseUrl) !== -1
    );
    return array.length > 0;
  }
  
  formatContent()
  {
    this.anchorArray=[];
    let anchorArray = this.content.split(this.urlSeparator);
    this.hasUrl = this.setHasUrl(anchorArray);
    if(this.content.indexOf(this.baseUrl) !== -1){
      this.setHasUrlConstructingData(anchorArray);
    }
    else if(this.content.indexOf(this.urlSeparator) !== -1 && this.content.indexOf(this.baseUrl) == -1)
    {
      debugger;
      this.setAnchorWithOutBaseUrl(anchorArray);
    }
    else
    {
      this.setHasViewEmailAddressSMSTextFlag();
    }
  }

  setAnchorWithOutBaseUrl(anchorArray:any)
  {
    this.data = anchorArray[0];
    anchorArray.forEach((item: any) => {
        let itemDataArray = item.split(this.titleOrlinkSeparator); 
        if(itemDataArray.length>1) 
        {
          let object = {
            url : itemDataArray[0],
            text : itemDataArray[1],
            title : itemDataArray[1],
            isBaseUrlFlag : false , 
            isFilePathUrl : true     
          }
          this.anchorArray.push(object);
        }
    });
    this.hasUrl = anchorArray.length >1;
  }
  
  setHasUrlConstructingData(anchorArray:any)
  {
    anchorArray.forEach((item: any) => {
      if(item.indexOf(this.baseUrl) !== -1){    
        let itemDataArray = item.split(this.titleOrlinkSeparator);      
        let object = {
          url : itemDataArray[0].replace(this.baseUrl,window.location.origin),
          text : itemDataArray[1],
          title : itemDataArray[1],
          isBaseUrlFlag : true ,  
          isFilePathUrl : false     
        }
        this.anchorArray.push(object);
        this.data += object.text;
      }
      else{
        let object = {
          url : "",
          text : item,
          title : "",
          isBaseUrlFlag : false,  
          isFilePathUrl : false     
        }
        this.anchorArray.push(object);
        this.data += object.text;
      }
    });
  }
    
  setHasViewEmailAddressSMSTextFlag()
  {
    this.isViewLetter = this.content.indexOf(this.ViewLetter) !== -1;
    this.isViewEmail = this.content.indexOf(this.ViewEmail) !== -1;
    this.isViewSmsText = this.content.indexOf(this.ViewSmsText) !== -1;
    this.data=this.content;
    this.data = this.data.replace(this.ViewLetter,'');
    this.data = this.data.replace(this.ViewEmail,'');
    this.data = this.data.replace(this.ViewSmsText,'');
    this.hasUrl = (this.isViewLetter || this.isViewEmail || this.isViewSmsText);
    this.viewText = this.setViewText();
  }
  setViewText()
  {
    if(this.isViewLetter)
    {
      return this.ViewLetter.replace('{','').replace('}','');
    }
    if(this.isViewEmail)
    {
      return this.ViewEmail.replace('{','').replace('}','');;
    }
    if(this.isViewSmsText)
    {
      return this.ViewSmsText.replace('{','').replace('}','');;
    }
    return "";
  }
  
  getViewFlag()
  {
    return (this.isViewEmail || this.isViewLetter || this.ViewSmsText);
  }

  OpenModalPopUp()
  {
    this.isViewLetterEmailTextDialog = true;
  }
  onCloseLetterEmailSmsTextClicked()
  {
    this.isViewLetterEmailTextDialog = false;
  } 
}
