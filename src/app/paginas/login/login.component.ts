import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  patternContraseña:string=".{6,}";
  email:string = "";
  contraseña:string = "";
  usuarioALoguear:any;
  inputEmail:any;
  inputClave:any;
  spinner:boolean = false;
  pantalla:any;
  listaUsuarios:any = new Array();
  contadorAdmin=0;
  contadorEspecialistas = 0;
  contadorPacientes = 0;
  constructor(private formBuilder:FormBuilder,
    private auth:AuthService,
    private router: Router,
    private sweetServ:SweetService,
    private firebaseServi:FirebaseService)
  {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      clave: ['', [Validators.required,Validators.pattern(this.patternContraseña)]],
    });
    this.inputEmail = document.getElementById('email');
    this.inputClave = document.getElementById('clave');
    this.cargarUsuarios();
    
    this.activarSpinner();

  }

  limpiarUsuarios()
  {
    this.listaUsuarios = new Array();
    this.contadorAdmin = 0;
    this.contadorEspecialistas = 0;
    this.contadorPacientes = 0;
  }
  cargarUsuarios()
  {
    this.firebaseServi.obtenerUsuarios().subscribe((res)=>{
      
      res.forEach(usuario => {
     if(this.listaUsuarios.find((u:any) => u.id === usuario.id) === undefined)
     {
       if(usuario.perfil == "admin" && this.contadorAdmin == 0)
       {
         this.listaUsuarios.push(usuario);
         this.contadorAdmin++;
       }
       else if(usuario.perfil == "especialista" && this.contadorEspecialistas < 2)
       {
         this.listaUsuarios.push(usuario);
         this.contadorEspecialistas++;
       }
       else if(usuario.perfil == "paciente" && this.contadorPacientes < 3)
       {
         this.listaUsuarios.push(usuario);
         this.contadorPacientes++;
       }
      
     }
     });  
    });
  }
  

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }

   async iniciarSesion() {
    if (this.formLogin.valid) {
      this.email = this.formLogin.getRawValue().email;
      this.contraseña = this.formLogin.getRawValue().clave;
      this.activarSpinner();
      let verificacion:string = "";
      try {
        await this.auth.iniciarSesion(this.email, this.contraseña).then(async(datos:any)=>{
            await this.obtenerDatosUsuario().then((usuario)=>{
              verificacion = this.verificarUsuario(datos,usuario);
                if (verificacion != "verificado") {
                  this.auth.cerrarSesion();
                  this.sweetServ.mensajeError(verificacion, "Iniciar sesión");
                } else {
                  this.auth.setLogueado();
                  this.sweetServ.mensajeExitoso("Inicio de sesión exitoso.", "Iniciar sesión");
                  this.router.navigate(['bienvenida']);
                }          
            });
          });       
        } catch (error) {
        console.log(error);
        this.sweetServ.mensajeError("Error al iniciar sesión", "Iniciar sesión");
      }
    }
  }

  verificarUsuario(datos:any,usuario:any)
  {
    let usuarioVerificado = "El usuario no pertenece a un perfil existente";
    datos.user?.reload;
    switch(usuario.perfil)
    {
      case 'especialista':
        if(usuario.aprobado)
        {     
          if(datos.user.emailVerified)
          {
            usuarioVerificado = "verificado";
          }
          else
          {
            usuarioVerificado = "Falta verificar su correo electrónico.";
          }
        }
        else
        {
          usuarioVerificado = "Usuario no aprobado";
        }
        break;
      case 'paciente':
        if(datos.user.emailVerified)
          {
            usuarioVerificado = "verificado";
          }
          else
          {
            usuarioVerificado = "Falta verificar su correo electrónico.";
          }
        break;
        default:
          usuarioVerificado = "verificado";
        break;    
    }
    return usuarioVerificado;
  }

  async obtenerDatosUsuario() {
    return new Promise<any>((resolve, reject) => {
      this.auth.obtenerUsuarioIniciado().subscribe((user) => {
        resolve(user);
      });
    });
  }

  ingresoRapido(usuario:any)
  {

    this.formLogin.get('email')?.setValue(usuario.email);
    this.formLogin.get('clave')?.setValue(usuario.clave);  
  }
}
