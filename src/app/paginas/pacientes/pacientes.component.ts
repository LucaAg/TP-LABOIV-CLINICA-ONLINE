import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {
  listaPacientes:any = new Array();
  usuariosPorEspecialista:any = new Array();
  especialista:any;
  constructor(private authServ:AuthService,
    private fireServ:FirebaseService)
  {
    
  }

  ngOnInit()
  {
    this.authServ.obtenerUsuarioIniciado().subscribe((usuario)=>{
      this.especialista = usuario;
      console.log(usuario);
      this.cargarPacientes();
    })
  }

  cargarPacientes()
  {
    this.fireServ.obtenerTurnos().subscribe((turnos)=>{
      this.listaPacientes = [];
      for (let i = 0; i < turnos.length; i++) 
      {
          if(this.especialista.id == turnos[i].especialista.id)
          {
            this.listaPacientes.push(turnos[i].paciente);
          }
        }  
      console.log(this.listaPacientes);
    });
  }
}
