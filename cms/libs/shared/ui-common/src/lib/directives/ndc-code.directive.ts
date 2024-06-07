import {
  Directive,
  HostListener,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[ndcCode]',
})
export class NdcCodeDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const char = event.key;
    

    // Allow only numbers (0-9)
    if (!/^\d$/.test(char)) {
      event.preventDefault();
      return;
    }
    const value = inputElement.value.replace(/\D/g, '')+char;
    // Prevent entering more than 11 digits
    if (value.length > 11) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    const inputElement = this.el.nativeElement.querySelector('input.k-input-inner') as HTMLInputElement;
    let value = inputElement.value?.replace(/\D/g, '');

    inputElement.value = this.applyMask(value);
  }

  private applyMask(value: string): string {
    const match = value.match(/^(\d{0,5})(\d{0,4})(\d{0,2})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return value;
  }

}