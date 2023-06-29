import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltarTexto]'
})
export class ResaltarTextoDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'DarkCyan');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '10px');
  }

}
