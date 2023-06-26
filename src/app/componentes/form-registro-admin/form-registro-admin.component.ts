import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-form-registro-admin',
  templateUrl: './form-registro-admin.component.html',
  styleUrls: ['./form-registro-admin.component.css']
})
export class FormRegistroAdminComponent {
  @Output() registroCompletado: EventEmitter<void> = new EventEmitter<void>();
  nuevoAdmin = new Usuario();
  formAdmin: FormGroup;
  patterDNI:string="[0-9]{8}";
  patternContraseña:string=".{6,}";
  spinner:boolean = false;
  box:any;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder:FormBuilder,private angularFireStorage: AngularFireStorage,
    private auth:AuthService)
  {
    this.formAdmin = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      dni: ['', [Validators.required,Validators.pattern(this.patterDNI)]],
      email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      clave: ['', [Validators.required,Validators.pattern(this.patternContraseña)]],
      imagen: ['', [Validators.required]],
    });

  }

  ngAfterViewInit()
  {
    this.box = document.getElementById('box');
  }

  

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }


  registrarAdmin()
  {
    if(this.formAdmin.valid)
    {
      if(this.nuevoAdmin.imagen1 != '')
      {
        this.nuevoAdmin.nombre = this.formAdmin.getRawValue().nombre;
        this.nuevoAdmin.apellido = this.formAdmin.getRawValue().apellido;
        this.nuevoAdmin.edad = this.formAdmin.getRawValue().edad;
        this.nuevoAdmin.dni = this.formAdmin.getRawValue().dni;
        this.nuevoAdmin.email = this.formAdmin.getRawValue().email;
        this.nuevoAdmin.clave = this.formAdmin.getRawValue().clave;
        this.nuevoAdmin.perfil = 'admin';
        this.auth.registrarAdmin(this.nuevoAdmin);
        setTimeout(()=>{
          this.formAdmin.reset();
          this.nuevoAdmin = new Usuario();
          this.registroCompletado.emit();
        },2000);       
      }
    }
  }

  async cargarImagen($event: any) {
    const archivo = $event.target.files[0];
    const ruta = 'img ' + Date.now() + Math.random() * 10;
    const referencia = this.angularFireStorage.ref(ruta);
    await referencia.put(archivo).then(async () => {
      referencia.getDownloadURL().subscribe((urlImg) => {
        this.nuevoAdmin.imagen1 = urlImg;
      });
    });
  }

  cancelarRegistro()
  {
    this.registroCompletado.emit();
  }
}
