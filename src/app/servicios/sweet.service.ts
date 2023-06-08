import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SweetService {

  constructor() { }
  mensajeExitoso(mensaje:string,titulo:string)
  {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Aceptar',
      background: '#c5e2ec',
    });
  }

  mensajeError(mensaje:string,titulo:string)
  {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Aceptar',
      background: '#c5e2ec',

    });
  }

  mensajeAlerta(mensaje:string,titulo:string)
  {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon:  'warning',
      showCancelButton: false,
      confirmButtonText: 'Aceptar',
      background: '#c5e2ec',

    });
  }
}
