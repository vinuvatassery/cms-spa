import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
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
  sanitizedHtml:any;
  constructor(private sanitizer : DomSanitizer) {}

  ngOnInit() {
    this.nonEditedContent = this.content;
    this.setReadmoreDisplay();
    this.sanitizedHtml = this.content; //NOSONAR
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
    this.sanitizedHtml = this.content;  //NOSONAR
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substring(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substring(0, this.limit)}...`;
  }  
}
