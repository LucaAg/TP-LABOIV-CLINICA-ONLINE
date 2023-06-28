import { Component } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';

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
  listaHorarios:any = new Array();
  listaTurnos:any;
  fechaTurnoSeleccionado:string = "";
  pantalla = 0;
  paciente:any;
  popup:any;
  constructor(private firebaseServi:FirebaseService,
    private auth:AuthService,
    private sweetServ: SweetService)
  {
    this.auth.obtenerUsuarioIniciado().subscribe((usuario)=>{
      this.paciente = usuario;
    });
    this.firebaseServi.obtenerTurnos().subscribe((turnos)=>{
      this.listaTurnos = turnos;
    });
    this.activarSpinner();
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;      
    },3000);
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
    })
  }

  cargarEspecialistas()
  {
    this.firebaseServi.obtenerEspecialistas().subscribe((especialistas)=>{
      this.listaEspecialistas = especialistas;
    });
  }

  elegirEspecialista(especialista:any)
  {
    this.especialistaSeleccionado = especialista;
    this.pantalla++;
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

  async elegirEspecialidad(especialidad:any)
  {
    this.especialidadSeleccionada = especialidad;
    await this.cargarHorariosSolicitados();
    this.pantalla++;
  }
  
  cargarHorariosSolicitados()
  {
    return new Promise((resolve,rejected)=>{

      for (let i = 0; i < this.especialistaSeleccionado.disponibilidad.length; i++) {
        if(this.especialistaSeleccionado.disponibilidad[i].especialidad == this.especialidadSeleccionada)
        {
          console.log(this.especialistaSeleccionado.disponibilidad[i]);
          this.listaHorarios = this.especialistaSeleccionado.disponibilidad[i].horarios;
          break;
        }
      }
      this.verficiarDisponibilidadTurno(this.listaHorarios);
      resolve(this.listaHorarios);
    });
  }

  verficiarDisponibilidadTurno(listaHorarios:any)
  { 
    let arrayAux= listaHorarios;
    for (let i = 0; i < this.listaTurnos.length; i++) 
    {
      const fechaTurno = this.listaTurnos[i].fecha;
      for (let k = 0; k < listaHorarios.length; k++) {
        for (let j = 0; j < arrayAux[k].hora.length; j++) {
          const fechaHorario = this.formatearDia(arrayAux[k].dia)+ ' ' + this.formatHora(arrayAux[k].hora[j]);
          if(fechaHorario == fechaTurno)
          {
            console.log(this.listaTurnos[i].estado);
            if(this.listaTurnos[i].estado != 'rechazado' &&
            this.listaTurnos[i].estado != 'cancelado')
            {
              arrayAux[k].hora.splice(j,1);
            }
          }
        }
      }   
    }
  }

  pedirTurno()
  {
    const turno = {
      id: Math.floor(Date.now() / 1000).toString(),
      fecha: this.fechaTurnoSeleccionado,
      especialista: this.especialistaSeleccionado,
      especialidad: this.especialidadSeleccionada,
      estado: 'solicitado',
      paciente: this.paciente,
    }
    this.firebaseServi.agregarDocumento('turnos',turno);
    this.sweetServ.mensajeExitoso("Turno solicitado","Turnos");
    this.pantalla = 0;
    this.popup = false;
  }
  
  seleccionarHorario(dia:string,hora:string)
  {
    this.fechaTurnoSeleccionado = dia + ' ' + hora;
    console.log(this.fechaTurnoSeleccionado);
  }

  formatHora(hora: string): string {
    const horaDate = new Date();
    const [horaStr, minutoStr] = hora.split(':');
    horaDate.setHours(Number(horaStr), Number(minutoStr));
  
  
    const horaFormateada = horaDate.toLocaleString('es-AR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires'
    });
    const indicacion = horaDate.getHours() < 12 ? 'AM' : 'PM';
  
    return `${horaFormateada} ${indicacion}`;
  }


  formatearDia(dia: string): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date();
    const diaSemanaIndex = diasSemana.indexOf(dia);
  
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + ((diaSemanaIndex + 7 - hoy.getDay()) % 7));
  
    const formattedDia = fecha.toISOString().slice(0, 10);
  
    return formattedDia;
  }
}
