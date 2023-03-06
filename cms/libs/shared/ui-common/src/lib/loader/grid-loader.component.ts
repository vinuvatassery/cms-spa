/** Angular **/
import { Component } from '@angular/core';

@Component({
  selector: 'common-grid-loader-component',
  template: `
  <div class="grid-loading-container">
          <div class="loader-wrap"  >
            <div class="loader-item">
              <span class="k-icon k-i-loading k-input-loading-icon"></span>
            </div>
          </div>
        </div>
`,
  
})
export class GridLoaderComponent { }
