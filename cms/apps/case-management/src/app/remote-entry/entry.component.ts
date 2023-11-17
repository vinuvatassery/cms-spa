import { Component } from '@angular/core';

@Component({
  selector: 'cms-case-management-entry',
  template: `<div class="remote-entry">
      <h2>case-management's Remote Entry Component</h2>
    </div>
    <router-outlet name="case-management-header"></router-outlet>
    <router-outlet></router-outlet>`,
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
