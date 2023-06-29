import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {
  spinner:boolean = false;
  especialidad:boolean = false;
  especialista:boolean = false;
  listaTurnos:any[]=[];
  turnosFiltrados:any[]=[];
  palabraFiltro:string = '';
  formRechazo: FormGroup;
  popup:boolean = false;
  turnoARechazar:any;
  constructor(private fireServ:FirebaseService,
    private formBuilder:FormBuilder,
    private sweetServ: SweetService)
  {
    this.formRechazo = this.formBuilder.group({
      razonRechazo: ['', [Validators.required]],
    })
    this.fireServ.obtenerTurnos().subscribe((turnos)=>{
      for (let i = 0; i < turnos.length; i++) {
        if(turnos[i].estado != 'disponible')
        {
          this.listaTurnos = turnos;
        }
      }
      this.turnosFiltrados = [...this.listaTurnos];
    })
    this.activarSpinner();
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
        || turno.especialista.apellido.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase() ||
        turno.especialista.nombre.toLocaleLowerCase() == this.palabraFiltro.toLocaleLowerCase())  
        {
          console.log("cumple");
          this.turnosFiltrados.push(turno);
        }   
      }
    }
  }

  obtenerTurnoRechazo(turno:any)
  {
    this.popup = true;
    this.turnoARechazar = turno;
  }

  rechazarTurno()
  {
    let turnoActualizado = this.asignarDatosTurno();
    this.popup = false;
    this.fireServ.actualizarTurno(turnoActualizado);
    this.sweetServ.mensajeExitoso("Turno modificado exitosamente","Turno");
    this.formRechazo.reset();
  }

  asignarDatosTurno()
  {
    console.log(this.turnoARechazar);
    let moldeTurno={
      id: this.turnoARechazar.id,
      especialidad: this.turnoARechazar.especialidad,
      especialista: this.turnoARechazar.especialista,
      paciente: this.turnoARechazar.paciente,
      fecha: this.turnoARechazar.fecha,
      estado: 'cancelado',
      comentario: this.formRechazo.getRawValue().razonRechazo,
    }
    return moldeTurno;
  }
}
