import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cms-index',
  templateUrl: './index-list.component.html',
  styleUrls: ['./index-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
