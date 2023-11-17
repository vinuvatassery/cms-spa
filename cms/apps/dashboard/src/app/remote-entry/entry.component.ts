import { Component } from '@angular/core';

@Component({
  selector: 'cms-dashboard-entry',
  template: `<div class="remote-entry">
      <h2>dashboard's Remote Entry Component</h2>
    </div>
    <cms-dashboard-wrapper></cms-dashboard-wrapper> `,
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
