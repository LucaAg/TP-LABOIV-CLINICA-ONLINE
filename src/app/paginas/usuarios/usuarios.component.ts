import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  listaUsuarios:any[]=[];
  popUpRef:any;
  boxRef:any;
  registroRef:any;
  spinner: boolean = false;
  pantalla:any;
  constructor(private firebaseServi:FirebaseService,private auth:AuthService,
    private router:Router)
  {
    this.activarSpinner();
  }

  ngOnInit()
  {
    this.cargarUsuarios();
  }

  ngAfterViewInit()
  {
    this.pantalla = document.getElementById('pantalla');
    this.popUpRef = document.getElementById('contenedor-pop-up');
    this.boxRef = document.getElementById('box');
    this.registroRef = document.getElementById('registro');
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }

  cargarUsuarios()
  {
    this.firebaseServi.obtenerUsuarios().subscribe((res)=>{
      this.listaUsuarios = res;
    });
  }

  cambiarEstadoHabilitacion(usuario:any,e:Event)
  {
    usuario.aprobado = (e.target as HTMLInputElement).checked;
    this.auth.actualizarUsuario(usuario);
  }

  generarExcel()
  {
    alert("Próximamente...\nEl alert va a desaparecer :)");
  }

  registrarUsuario(tipoUsuario:string)
  {
    if(tipoUsuario == 'otros')
    {
      this.router.navigate(['registrarse']);
    }
    else
    {
      this.cancelarRegistro();
    }
    this.cerrarPopUp();
    this.activarSpinner();
  }

  cancelarRegistro()
  {
    this.boxRef.classList.add("esconder");
    this.registroRef.classList.remove("esconder");
  }

  registroAdminCompletado()
  {
    this.boxRef.classList.remove("esconder");
    this.registroRef.classList.add("esconder");
  }

  abrirPopUp()
  {
    this.popUpRef.classList.remove("esconder");

  }

  cerrarPopUp()
  {
    this.popUpRef.classList.add("esconder");
  }
}
