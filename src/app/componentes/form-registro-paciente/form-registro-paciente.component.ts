import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/servicios/auth.service';
import { Paciente } from 'src/app/models/paciente';

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
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder:FormBuilder,
    private servicioFire:FirebaseService,private angularFireStorage: AngularFireStorage,
    private auth:AuthService)
  {
    this.formPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      dni: ['', [Validators.required,Validators.pattern(this.patterDNI)]],
      obraSocial: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      clave: ['', [Validators.required,Validators.pattern(this.patternContraseña)]],
      imagen: ['', [Validators.required]],
      imagen2: ['', [Validators.required]],
    });
    this.activarSpinner();

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

  registrarPaciente()
  {
    if(this.formPaciente.valid)
    {
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
        this.nuevoPaciente.imagen1 = urlImg;
      });
    });
  }

  async cargarImagen2($event: any) {
    const archivo = $event.target.files[0];
    const ruta = 'img ' + Date.now() + Math.random() * 10;
    const referencia = this.angularFireStorage.ref(ruta);
    await referencia.put(archivo).then(async () => {
      referencia.getDownloadURL().subscribe((urlImg) => {
        this.nuevoPaciente.imagen2 = urlImg;
      });
    });
  }
}

