import { Component } from '@angular/core';
import {
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from '@progress/kendo-angular-indicators';

@Component({
  selector: 'common-loader-component',
  template: `
    <div class="loader-wrap">
      <div class="loader-item" *ngFor="let loader of loaders">
        <kendo-loader
          [type]="loader.type"
          [themeColor]="loader.themeColor"
          [size]="loader.size"
        >
        </kendo-loader>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 -10px;
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 65%);
        z-index: 9999;

        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);
      }
      .loader-item {
        width: 50px;
        height: 50px;
        align-items: center;
        justify-content: center;
        display: flex;
        background: #ffffff;
        border-radius: 50%;
      }
    `,
  ],
})
export class LoaderComponent {
  public loaders = [
    {
      type: <LoaderType>'infinite-spinner',
      themeColor: <LoaderThemeColor>'secondary',
      size: <LoaderSize>'medium',
    },
  ];
}
