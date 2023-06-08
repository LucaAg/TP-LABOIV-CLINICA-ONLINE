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
  spinner:any;
  pantalla:any;
  listaUsuarios:any[]=[];
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
  }
  cargarUsuarios()
  {
    this.firebaseServi.obtenerUsuarios().subscribe((res)=>{
      this.listaUsuarios = res;
    });
  }

  ngAfterViewInit()
  {
    this.inputEmail = document.getElementById('email');
    this.inputClave = document.getElementById('clave');
    this.spinner = document.getElementById('spinner');
    this.pantalla = document.getElementById('pantalla');
    this.cargarUsuarios();
    this.activarSpinner();
  }

  

  activarSpinner()
  {
    this.spinner.classList.remove('esconder');
    this.pantalla.classList.add('esconder');
    setTimeout(()=>{
      this.spinner.classList.add('esconder');
      this.pantalla.classList.remove('esconder');
    },3000);
  }

   iniciarSesion() {
    if (this.formLogin.valid) {
      this.email = this.formLogin.getRawValue().email;
      this.contraseña = this.formLogin.getRawValue().clave;
      this.activarSpinner();
      let verificacion:string = "";
      try {
        this.auth.iniciarSesion(this.email, this.contraseña).then(async(datos:any)=>{
          setTimeout(()=>{          
          },3500);
        this.obtenerDatosUsuario().then((usuario)=>{
          verificacion = this.verificarUsuario(datos,usuario);
            if (verificacion != "verificado") {
              this.auth.cerrarSesion();
              this.sweetServ.mensajeError(verificacion, "Iniciar sesión");
            } else {
              this.auth.setLogueado();
              this.sweetServ.mensajeExitoso(verificacion, "Iniciar sesión");
              this.router.navigate(['bienvenida']);
            }          
        })
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

  // iniciarSesion()
  // {
  //   if(this.formLogin.valid)
  //   {
  //     let verificacion = "";
  //     this.email = this.formLogin.getRawValue().email;
  //     this.contraseña = this.formLogin.getRawValue().clave;
  //     this.auth.iniciarSesion(this.email,this.contraseña).then(async()=>{
  //       this.obtenerDatosUsuario();
  //       setTimeout(()=>{
  //         verificacion = this.verificarUsuario(usuario)
  //       },2500);
  //     });    
  //     this.activarSpinner();
  //     setTimeout(()=>{
  //       if(verificacion != 'verificado')
  //       {
  //         this.auth.cerrarSesion();
  //         this.sweetServ.mensajeError(verificacion,"Iniciar sesión");
  //       }
  //       else
  //       {
  //         this.sweetServ.mensajeExitoso('Usuario '+verificacion,"Iniciar sesión");
  //         this.router.navigate(['bienvenida']);
  //       }
  //     },2500);
  //   }  
  // }

  // verificarUsuario(usuario:any)
  // {
  //   let usuarioVerificado = "El usuario no pertenece a un perfil existente";

  //   switch(usuario.perfil)
  //   {
  //     case 'especialista':
  //       if(usuario.aprobado)
  //       {     
  //         if(this.auth.verificarUsuario())
  //         {
  //           usuarioVerificado = "verificado";
  //         }
  //         else
  //         {
  //           usuarioVerificado = "Falta verificar su correo electrónico.";
  //         }
  //       }
  //       else
  //       {
  //         usuarioVerificado = "Usuario no aprobado";
  //       }
  //       break;
  //     case 'paciente':
  //       if(this.auth.verificarUsuario())
  //         {
  //           usuarioVerificado = "verificado";
  //         }
  //         else
  //         {
  //           usuarioVerificado = "Falta verificar su correo electrónico.";
  //         }
  //       break;
  //       default:
  //         usuarioVerificado = "verificado";
  //       break;    
  //   }
  //   return usuarioVerificado;
  // }

  // async obtenerDatosUsuario()
  // {
  //   this.auth.obtenerUsuarioIniciado().subscribe((usuario: any) => {
  //     if(usuario)
  //     {
  //       usuario = usuario;
  //     }
  //   });
  // }
  async obtenerDatosUsuario() {
    return new Promise<any>((resolve, reject) => {
      this.auth.obtenerUsuarioIniciado().subscribe((user) => {
        resolve(user);
      });
    });
  }

  ingresoRapido(tipoUsuario:string)
  {
    switch(tipoUsuario)
    {
      case 'admin':
        this.formLogin.get('email')?.setValue('nahuquilmes01@hotmail.com');
        this.formLogin.get('clave')?.setValue(123456);
        break;
      case 'paciente':
        this.formLogin.get('email')?.setValue('nahuquilmes@hotmail.com');
        this.formLogin.get('clave')?.setValue(123456);
        break;
      case 'especialista':
        this.formLogin.get('email')?.setValue('lucanahuelagnoli@gmail.com');
        this.formLogin.get('clave')?.setValue(123456);
        break;    
    }
  }
}
