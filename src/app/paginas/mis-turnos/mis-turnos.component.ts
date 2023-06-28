import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';
import { deslizarIzqADerAnimacion } from '../animaciones';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
  animations: [deslizarIzqADerAnimacion]
})
export class MisTurnosComponent {
  palabraFiltro:string = '';
  listaTurnos:any[]=[];
  turnosFiltrados:any[]=[];
  spinner:boolean = false;
  usuario:any;
  popupEspecialista:boolean = false;
  popupEspecialistaAceptar:boolean = false;
  popUpResenia:boolean = false;
  formAccion:FormGroup;
  accion:string = "";
  turnoEspActualizar:any;
  resenia:string = '';
  encuesta:boolean = false;
  turnoACalificar:any;
  pacienteSolicitado:any;
  historialClinico:boolean = false;
  dato1: string[] = ['clave 1', 'valor 1'];
  dato2: string[] = ['clave 2', 'valor 2'];
  dato3: string[] = ['clave 3', 'valor 3'];
  constructor(private fireServ:FirebaseService,
    private sweetServ: SweetService,
    private authServ:AuthService,
    private formBuilder:FormBuilder)
  {
    this.formAccion = this.formBuilder.group({
      accionForm: ['', [Validators.required]],
    })
    
    //this.activarSpinner();
  }

  ngOnInit()
  {
    
    
    this.authServ.obtenerUsuarioIniciado().subscribe((usuario)=>{
      this.usuario = usuario;
      this.fireServ.obtenerTurnos().subscribe((turnos)=>{
        this.listaTurnos = [];
        for (let i = 0; i < turnos.length; i++) {
          if(turnos[i].estado != 'disponible')
          {
            if(this.usuario.perfil == 'especialista')
            {
              if(turnos[i].especialista.id == this.usuario.id )
              {
                console.log("entro");
                this.listaTurnos.push(turnos[i]);
              }
            }
            else if(this.usuario.perfil == 'paciente')
            {
              if(turnos[i].paciente.id == this.usuario.id)
              {
                this.listaTurnos.push(turnos[i]);
              }
            }
            
          }
        }
        this.turnosFiltrados = [...this.listaTurnos];
      })
    });
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }


  filtrarCampos()
  {
    this.turnosFiltrados = [];
    if(this.palabraFiltro == '')
    {
      this.turnosFiltrados = [...this.listaTurnos];
    }
    else
    {
      const busqueda = this.palabraFiltro.trim().toLocaleLowerCase();
      console.log(busqueda);

      for (let i = 0; i < this.listaTurnos.length; i++) {
        const turno = this.listaTurnos[i];
        if(turno.especialidad.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase()
        || turno.paciente.apellido.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase() ||
        turno.paciente.nombre.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase())  
        {
          this.turnosFiltrados.push(turno);
        }   
      }
    }
  }

  filtrarCamposPaciente()
  {
    this.turnosFiltrados = [];
    if(this.palabraFiltro == '')
    {
      this.turnosFiltrados = [...this.listaTurnos];
    }
    else
    {
      const busqueda = this.palabraFiltro.trim().toLocaleLowerCase();
      console.log(busqueda);

      for (let i = 0; i < this.listaTurnos.length; i++) {
        const turno = this.listaTurnos[i];
        if(turno.especialidad.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase()
        || turno.especialista.apellido.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase() ||
        turno.especialista.nombre.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase())  
        {
          this.turnosFiltrados.push(turno);
        }   
      }
    }
  }

  accionCancelarEsp(turno:any)
  {
    this.accion = "Cancelar";
    this.popupEspecialista = true;
    this.turnoEspActualizar = turno;
    console.log('Cancelo el turno: ' + turno);
  }

  accionRechazar(turno:any)
  {
    this.accion = "Rechazar";
    this.popupEspecialista = true;
    this.turnoEspActualizar = turno;
    console.log('Rechazo el turno: ' + turno);
  }

  accionAceptar(turno:any)
  {
    this.accion = "Aceptar";
    this.popupEspecialistaAceptar = true;
    this.turnoEspActualizar = turno;

    console.log('Acepto el turno: ' + turno);
  }

  accionFinalizar(turno:any)
  {
    this.accion = "Finalizar";
    this.turnoEspActualizar = turno;
    this.pacienteSolicitado = turno.paciente;
    this.popupEspecialista = true;
    console.log('Finalizo el turno: ' + turno);
  }

  verResenia(turno:any)
  {
    this.resenia = turno.comentario;
    this.popUpResenia = true;
  }

  accionReseñaEsp()
  {
    //Mostrar reseña si corresponde
  }

  accionEspecialista()
  {
    switch(this.accion)
    {
      case 'Rechazar':
        this.asignarDatosTurno('rechazado',1);
        break;
      case 'Cancelar':
        this.asignarDatosTurno('cancelado',1);
        break;  
      case 'Finalizar':
        this.asignarDatosTurno('finalizado',3);
        break;  
      case 'Calificar':
        this.asignarDatosTurno('finalizado',2);
        break;  
    }
    
  }

  cargarHistoriaClinica()
  {
    this.historialClinico = true;
  }

  asignarDatosTurno(estadoNuevo:string,tipo:number)
  {
    console.log(this.turnoEspActualizar);
    let moldeTurno:any={
      id: this.turnoEspActualizar.id,
      especialidad: this.turnoEspActualizar.especialidad,
      especialista: this.turnoEspActualizar.especialista,
      paciente: this.turnoEspActualizar.paciente,
      fecha: this.turnoEspActualizar.fecha,
      estado: estadoNuevo,
      calificacionEspecialista: ''
    }
    if(tipo == 1)
    {
      moldeTurno.comentario = this.formAccion.getRawValue().accionForm;
    }
    else if(tipo == 2)
    {
      moldeTurno.calificacionEspecialista = this.formAccion.getRawValue().accionForm;
    }
    else if(tipo == 3)
    {
      this.cargarHistoriaClinica();
      moldeTurno.comentario = this.formAccion.getRawValue().accionForm;
    }
    console.log(moldeTurno);
    this.popupEspecialista = false;
    this.popupEspecialistaAceptar = false;
    this.formAccion.reset();
    this.fireServ.actualizarTurno(moldeTurno);
  }


  onEncuestaCompletada(e:any)
  {
    if(!e)
    {
      this.sweetServ.mensajeExitoso("¡Gracias a su tiempo mejoramos cada día!","Encuesta completada");
    }
    this.encuesta = false;
  }

  accionCalificar(turno:any)
  {
    this.accion = "Calificar";
    this.turnoEspActualizar = turno;
    this.popupEspecialista = true;
  }

  onHistorialTerminado(e:any)
  {
    if(e != 'Cancelar')
    {
      e.paciente = this.turnoEspActualizar.paciente;
      e.especialista = this.turnoEspActualizar.especialista;
      e.especialidad = this.turnoEspActualizar.especialidad;
      console.log(e);
      this.fireServ.agregarDocumento('historiales-clinicos',e);
      this.sweetServ.mensajeExitoso('Historial clínico agregado correctamente','Historial clínico');
      this.historialClinico = false;
    }
    else
    {
      this.historialClinico = false;
    }
  }
}
