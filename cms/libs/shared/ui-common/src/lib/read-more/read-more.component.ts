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

  constructor() {}

  ngOnInit() {
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
}