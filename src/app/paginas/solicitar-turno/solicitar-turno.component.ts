import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {
  spinner:boolean = false;
  boxEspecialista:boolean = true;
  boxEspecialidades:boolean = false;
  boxFechaHorarios:boolean = false;
  listaEspecialistas:any = new Array();
  listaEspecialidades:any = new Array();
  especialistaSeleccionado:any;
  especialidadSeleccionada:any;

  
  constructor(private firebaseServi:FirebaseService)
  {
  }
  
  ngOnInit()
  {
    this.cargarEspecialistas();
    this.cargarEspecialidades();
  }

  cargarEspecialidades()
  {
    this.firebaseServi.obtenerEspecialidades().subscribe((especialidades)=>{
      this.listaEspecialidades = especialidades;
      console.log(this.listaEspecialidades);
    })
  }

  cargarEspecialistas()
  {
    this.firebaseServi.obtenerEspecialistas().subscribe((especialistas)=>{
      this.listaEspecialistas = especialistas;
      console.log(this.listaEspecialistas);
    });
  }

  elegirEspecialista(especialista:any)
  {
    console.log(especialista);
    this.especialistaSeleccionado = especialista;
    this.boxEspecialista = false;
    this.boxEspecialidades = true;
  }

  asignarImagen(especialidad:any)
  {
    let rutaImagen = "";
    for (let i = 0; i < this.listaEspecialidades.length; i++) {
      if(this.listaEspecialidades[i].especialidad == especialidad)
      {
        rutaImagen = this.listaEspecialidades[i].imagen;
        break;
      }
    }
    return rutaImagen;
  }

  elegirEspecialidad(especialidad:any)
  {
    this.boxEspecialidades = false;
    this.boxFechaHorarios = true;
    console.log(especialidad);
  }
}
