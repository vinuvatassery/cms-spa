import { Component, OnInit, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'common-read-more',
  templateUrl: './read-more.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadMoreComponent {

  @Input() content: string = "";
  @Input() limit: number = 0;
  @Input() completeWords: boolean = false;

  isContentToggled: boolean = false;
  nonEditedContent: string = "";

  constructor() {

  }

  ngOnInit() {
    console.log(this.content);
    this.nonEditedContent = this.content;
    this.content = this.formatContent(this.content);
  }

  toggleContent() {
    this.isContentToggled = !this.isContentToggled;
    this.content = this.isContentToggled ? this.nonEditedContent : this.formatContent(this.content);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
}
