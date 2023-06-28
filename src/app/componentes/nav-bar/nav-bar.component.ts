import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  menu:any;
  navbar:any;
  usuarioLogueado=new Usuario();
  spinner:boolean = false;
  constructor(public authService:AuthService,
    private router: Router,
    private sweetServi:SweetService){
  }
  

  cerrarSesion()
  {
    this.authService.cerrarSesion();
    //this. activarSpinner();
    this.sweetServi.mensajeExitoso("Se ha cerrado exitosamente la sesión","Cerrar sesión");

    this.router.navigate(['bienvenida']);
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },2500);
  }

  ngAfterViewInit()
  {
    this.menu = document.getElementById('icono-menu');
    this.navbar = document.querySelector('.navbar');
    this.authService.obtenerUsuarioIniciado().subscribe((usuario: any) => {
      if(usuario)
      {
        this.usuarioLogueado = usuario;
      }
      else
      {
        console.log("no esta logueado");
      }
    });
  }

  agruparMenu()
  {
    this.menu.classList.toggle('bx-x');
    this.navbar.classList.toggle('open');
  }
}
