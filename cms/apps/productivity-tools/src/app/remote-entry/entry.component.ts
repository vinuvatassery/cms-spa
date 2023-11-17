import { Component } from '@angular/core';

@Component({
  selector: 'cms-productivity-tools-entry',
  template: `<div class="remote-entry">
      <h2>productivity-tools's Remote Entry Component</h2>
    </div>
    <router-outlet name="productivity-tools-header"></router-outlet>
    <router-outlet></router-outlet> `,
  styles: [
    `
      .remote-entry {
        background-color: #143055;
        color: white;
        padding: 5px;
      }
    `,
  ],
})
export class RemoteEntryComponent {}
