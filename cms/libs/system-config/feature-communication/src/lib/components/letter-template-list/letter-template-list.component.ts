import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-letter-template-list',
  templateUrl: './letter-template-list.component.html',
  styleUrls: ['./letter-template-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterTemplateListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
