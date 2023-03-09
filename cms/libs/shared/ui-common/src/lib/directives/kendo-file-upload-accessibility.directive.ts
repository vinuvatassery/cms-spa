import { Directive, ElementRef, Renderer2 } from '@angular/core';

// Create for accessability fixes for arial label
@Directive({
    selector: 'kendo-upload'
})
export class KendoFileUploadDirective {
    constructor(public renderer: Renderer2, public hostElement: ElementRef) { }
    ngOnInit() {
        const ariaLabel = this.hostElement.nativeElement.getAttribute('aria-label');
        const inputElement = this.hostElement.nativeElement.children[0].children[0].children[0];
        this.renderer.setAttribute(inputElement, 'aria-label', ariaLabel);
    }
}