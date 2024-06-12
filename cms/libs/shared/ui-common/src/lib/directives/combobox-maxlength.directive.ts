import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[comboboxMaxLength]'
})
export class ComboboxMaxLengthDirective implements AfterViewInit {
  @Input() comboboxMaxLength: number=0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const input = this.el.nativeElement.querySelector('input');
    if (input) {
      input.setAttribute('maxlength', this.comboboxMaxLength.toString());
    }
  }
}