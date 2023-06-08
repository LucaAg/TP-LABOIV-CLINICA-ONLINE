import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  seccion:string = 'menu';
  usuarioARegistrar:string = '';



  cambiarSeccion(registroElegido:string)
  {
    this.seccion = 'seleccion';
    this.usuarioARegistrar = registroElegido;
  }

  volverMenuSeleccion()
  {
    this.seccion = 'menu';
  }
}
