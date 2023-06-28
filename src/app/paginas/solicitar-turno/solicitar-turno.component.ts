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
  pantalla = 1;
  paciente:any;
  popup:any;
  listaPacientes:any = new Array();
  admin:any;
  constructor(private firebaseServi:FirebaseService,
    private auth:AuthService,
    private sweetServ: SweetService)
  {
    this.auth.obtenerUsuarioIniciado().subscribe((usuario)=>{
      this.paciente = usuario;
      if(this.paciente.perfil == 'admin')
      {
        this.admin = this.paciente;
        this.pantalla = 0;
        this.listaPacientes = [];
        this.firebaseServi.obtenerUsuarios().subscribe((usuarios)=>{
          for (let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].perfil == 'paciente')
            {
              this.listaPacientes.push(usuarios[i]);
            }
          }
        });
        console.log(this.listaPacientes);
      }
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

  elegirPaciente(paciente:any)
  {
    this.paciente = paciente;
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
    if(this.admin)
    {
      this.pantalla = 0;
    }
    else
    {
      this.pantalla = 1;
    }
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
      hourCycle: 'h12',      
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  
    return `${horaFormateada}`;
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
