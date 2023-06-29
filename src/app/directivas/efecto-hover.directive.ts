import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEfectoHover]'
})
export class EfectoHoverDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.addHoverEffect();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeHoverEffect();
  }

  private addHoverEffect() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'lightblue');
    // Otros estilos que desees aplicar durante el hover
  }

  private removeHoverEffect() {
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    // Elimina otros estilos aplicados durante el hover
  }

}
