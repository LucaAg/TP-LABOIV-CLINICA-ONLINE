import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/servicios/auth.service';
import { Paciente } from 'src/app/models/paciente';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-form-registro-paciente',
  templateUrl: './form-registro-paciente.component.html',
  styleUrls: ['./form-registro-paciente.component.css']
})
export class FormRegistroPacienteComponent {
  nuevoPaciente = new Paciente();
  formPaciente: FormGroup;
  patterDNI:string="[0-9]{8}";
  patternContraseña:string=".{6,}";
  spinner:boolean = false;
  box:any;
  captcha: string = '';

  archivo1:string ="";
  ruta1:string = "";

  archivo2:string = "";
  ruta2:string = "";
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder:FormBuilder,
  private angularFireStorage: AngularFireStorage,
    private auth:AuthService,private sweetServ:SweetService)
  {
    this.formPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      dni: ['', [Validators.required,Validators.pattern(this.patterDNI)]],
      obraSocial: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      clave: ['', [Validators.required,Validators.pattern(this.patternContraseña)]],
      captcha: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      imagen2: ['', [Validators.required]],
    });
    this.activarSpinner();
    this.captcha = this.crearStringRandom(6);

  }

  ngAfterViewInit()
  {
    this.box = document.getElementById('box');
  }

  crearStringRandom(cantidad: number) {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let retorno = ' ';
    const length = caracteres.length;
    for (let i = 0; i < cantidad; i++) {
      retorno += caracteres.charAt(
        Math.floor(Math.random() * length)
      );
    }
    return retorno;
  }


  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }

  async registrarPaciente()
  {
    if(this.formPaciente.valid)
    {
      if( this.captcha.toLocaleLowerCase().trim() ==
      this.formPaciente.getRawValue().captcha.toLocaleLowerCase().trim())
      {
        await this.subirImagen();
        await this.subirImagen2();
        if(this.nuevoPaciente.imagen1 != '' && this.nuevoPaciente.imagen2 != '')
        {
  
            this.nuevoPaciente.nombre = this.formPaciente.getRawValue().nombre;
            this.nuevoPaciente.apellido = this.formPaciente.getRawValue().apellido;
            this.nuevoPaciente.edad = this.formPaciente.getRawValue().edad;
            this.nuevoPaciente.dni = this.formPaciente.getRawValue().dni;
            this.nuevoPaciente.obraSocial = this.formPaciente.getRawValue().obraSocial;
            this.nuevoPaciente.email = this.formPaciente.getRawValue().email;
            this.nuevoPaciente.clave = this.formPaciente.getRawValue().clave;
            this.nuevoPaciente.perfil = 'paciente';
            this.auth.registrarPaciente(this.nuevoPaciente);
            this.activarSpinner();
            setTimeout(()=>{
              this.formPaciente.reset();
              this.nuevoPaciente = new Paciente();
            },1000);     
            this.sweetServ.mensajeExitoso("Se ha creado al paciente exitosamente.","Registro");  
        }
        else
        {
          this.sweetServ.mensajeError("Debe cargar ambas imagenes.","Imagén");  
        }
      }
      else
      {
       this.sweetServ.mensajeError("Captcha incorrecto, ¿Es usted un robot?","Captcha");
      }
    }
    else
    {
      this.sweetServ.mensajeError("Todos los campos son obligatorios, por favor reviselos.","Campos");  

    }
  }


  cargarImagen($event: any) {
    this.archivo1 = $event.target.files[0];
    this.ruta1 = 'img ' + Date.now() + Math.random() * 10;
   
  }

  async subirImagen()
  {
    return new Promise(async (resolve,rejected)=>{
      const referencia = this.angularFireStorage.ref(this.ruta1);
      await referencia.put(this.archivo1).then(async () => {
        referencia.getDownloadURL().subscribe((urlImg) => {
          this.nuevoPaciente.imagen1 = urlImg;
          resolve(urlImg);
        });
      });
    });
  }

  async cargarImagen2($event: any) {
    this.archivo2 = $event.target.files[0];
    this.ruta2 = 'img ' + Date.now() + Math.random() * 10;
    
  }

  async subirImagen2()
  {
    return new Promise(async (resolve,rejected)=>{
      const referencia = this.angularFireStorage.ref(this.ruta2);
      await referencia.put(this.archivo2).then(async () => {
        referencia.getDownloadURL().subscribe((urlImg) => {
          this.nuevoPaciente.imagen2 = urlImg;
          resolve(urlImg);
        });
      });
   });
  }
}

