import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {
  esEspecialista:boolean =false;
  esAdmin:boolean = false;
  esPaciente:boolean = false;
  usuario:any;
  formTiempoConsulta: FormGroup;
  especialidadElegida:string = "";
  /*Dias*/
  dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  /* HORARIOS */
  horas: string[] = [];
  duracionTurno:number = 30; //Valor por default
  disponibilidad:any[]=[];
  constructor(private authServ:AuthService, private sweetServ:SweetService,
    private formBuilder:FormBuilder)
  {
    this.formTiempoConsulta = this.formBuilder.group({
      tiempoConsulta: ['', [Validators.required, Validators.min(20), Validators.max(60)]],
    });
  }
  
  ngOnInit()
  {
    
  }

  actualizarDuracion()
  {
    this.usuario.duracionTurno = this.formTiempoConsulta.getRawValue().tiempoConsulta;
    this.horas = [];
    this.calcularHorariosDinamicos(this.usuario.duracionTurno, 8, 17);
    this.authServ.actualizarUsuario(this.usuario);
    this.sweetServ.mensajeExitoso("Horarios modificados.","Turnos");
  }
  
  ngAfterViewInit()
  {

    this.authServ.obtenerUsuarioIniciado().subscribe((user)=>{
      if(user)
      {
        this.usuario = user;
        if(this.usuario.perfil == "especialista")
        {
          this.esEspecialista = true;
          this.duracionTurno = parseInt(this.usuario.duracionTurno) || 30;
          this.calcularHorariosDinamicos(this.duracionTurno,8,16); 
          this.especialidadElegida = this.usuario.especialidad[0];   
          this.disponibilidad = this.usuario.disponibilidad || [];       
        }
        else if(this.usuario.perfil == "admin")          
        {
          this.esAdmin = true;
        }
        else                                            
        {
          this.esPaciente = true;
        }
      }
    });
  }

  seleccionarEspecialidad(especialidad:string)
  {
    this.especialidadElegida = especialidad;
  }

  calcularHorariosDinamicos(duracionTurno: number, horaInicio: number, horaFin: number) {
    const minutosPorHora = 60;
    const minutosDia = (horaFin - horaInicio) * minutosPorHora;
    let minutosActual = 0;
    for (let minutos = 0; minutos < minutosDia; minutos += duracionTurno) {
      const hora = Math.floor(minutosActual / minutosPorHora) + horaInicio;
      const minuto = minutosActual % minutosPorHora;
      const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
      this.horas.push(horario);

      minutosActual += duracionTurno;
    }
    
  }


  actualizarDisponibilidad(especialidad: string, dia: string, hora: string, $event: any)
  {
    if ($event.target.checked)
    {     
      const dispoEspecialidad = this.disponibilidad?.find((disp: any) => disp.especialidad === especialidad);
  
      if (dispoEspecialidad)
      {
        const dispoDia = dispoEspecialidad.horarios.find((horario: any) => horario.dia === dia);
        
        if (dispoDia)
        {
          dispoDia.hora.push(hora);
        }
        else {
          dispoEspecialidad.horarios.push({ dia, hora: [hora] });
        }
      }
      else {
        this.disponibilidad.push({ especialidad, horarios: [{ dia, hora: [hora] }] });
      }
    }
    else
    {
      const dispoEspecialidad = this.disponibilidad.find((disp: any) => disp.especialidad === especialidad);
  
      if (dispoEspecialidad)
      {
        const dispoDia = dispoEspecialidad.horarios.find((horario: any) => horario.dia === dia);
  
        if (dispoDia) {
          dispoDia.hora = dispoDia.hora.filter((h: string) => h !== hora);
          if (dispoDia.hora.length === 0) {
            dispoEspecialidad.horarios = dispoEspecialidad.horarios.filter((hor: any) => hor.dia !== dia);
          }
        }
        if (dispoEspecialidad.horarios.length === 0) {
          this.disponibilidad = this.disponibilidad.filter((disp: any) => disp.especialidad !== especialidad);
        }
      }
    }
  
    this.usuario.disponibilidad = this.disponibilidad;
    this.authServ.actualizarUsuario(this.usuario);
  }
  estaDisponible(especialidad: string, dia: string, hora: string): boolean
  {
    if(this.disponibilidad != undefined)
    {
      const dispoEspecialidad = this.disponibilidad?.find((disp: any) => disp.especialidad === especialidad);
      
      if (dispoEspecialidad) {
        const dispoDia = dispoEspecialidad.horarios.find((hor: any) => hor.dia === dia);
        if (dispoDia) {
          return dispoDia.hora.includes(hora) }
      }
    }
    return false;
  }
}
