import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';

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

  constructor(private authServ:AuthService)
  {

  }
  
  ngAfterViewInit()
  {
    this.authServ.obtenerUsuarioIniciado().subscribe((user)=>{
      this.usuario = user;
      console.log(this.usuario);
      if(this.usuario.perfil == "especialista")
      {
        this.esEspecialista = true;
      }
      else if(this.usuario.perfil == "admin")
      {
        this.esAdmin = true;
      }
      else
      {
        this.esPaciente = true;
      }
    });
    
  }

  
}
