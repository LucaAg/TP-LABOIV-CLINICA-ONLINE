import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAgregarBorder]'
})
export class AgregarBorderDirective {

  @Input() colorBorde!: string;
  @Input() widthBorde!: string;
  @Input() estiloBorde!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.aplicarBorder();
  }

  private aplicarBorder() {
    this.renderer.setStyle(this.el.nativeElement, 'border-color', this.colorBorde);
    this.renderer.setStyle(this.el.nativeElement, 'border-width', this.widthBorde);
    this.renderer.setStyle(this.el.nativeElement, 'border-style', this.estiloBorde);
  }

}
