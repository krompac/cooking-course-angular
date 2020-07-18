import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') clickedOnce = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.clickedOnce = this.elRef.nativeElement.contains(event.target) ? !this.clickedOnce : false;
  }

  constructor(private elRef: ElementRef) {}
}
