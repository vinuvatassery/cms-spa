import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[commonPlaceholder]'
})
export class PlaceholderDirective {

  constructor(public viewContainerRef:ViewContainerRef){ }

}
