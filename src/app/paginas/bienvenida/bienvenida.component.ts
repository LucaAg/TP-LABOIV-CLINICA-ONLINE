import { Component } from '@angular/core';
import { deslizarIzqADerAnimacion } from '../animaciones';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css'],
  animations: [deslizarIzqADerAnimacion]
})
export class BienvenidaComponent {

}
