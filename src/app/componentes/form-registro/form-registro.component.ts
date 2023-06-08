import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Especialista } from 'src/app/models/especialista';
import { AuthService } from 'src/app/servicios/auth.service';
import { doc } from 'firebase/firestore';
@Component({
  selector: 'app-form-registro',
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.css']
})
export class FormRegistroComponent {
  nuevoEspecialista = new Especialista();
  agregoImagen = false;
  formEspecialista: FormGroup;
  formAgregarEspecialista: FormGroup;
  especialidades:string[]=[];
  patterDNI:string="[0-9]{8}";
  patternContraseña:string=".{6,}";
  agregarEspecialidadRef:any;
  nuevaEspecialidad = { especialidad: ""}
  lbEspecialidades:any;
  spinner:any;
  box:any;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder:FormBuilder,private formBuilder2:FormBuilder,
    private servicioFire:FirebaseService,private angularFireStorage: AngularFireStorage,
    private auth:AuthService)
  {
    this.formEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      dni: ['', [Validators.required,Validators.pattern(this.patterDNI)]],
      especialidad: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      clave: ['', [Validators.required,Validators.pattern(this.patternContraseña)]],
      imagen: ['', [Validators.required]],
    });
    this.formAgregarEspecialista = this.formBuilder2.group({
      nuevaEspecialidad: ['', [Validators.required]],
    })
  }

  ngOnInit()
  {
    this.cargarEspecialidades();
  }

  activarSpinner()
  {
    this.spinner.classList.remove('esconder');
    this.box.classList.add('esconder');
    setTimeout(()=>{
      this.spinner.classList.add('esconder');
      this.box.classList.remove('esconder');
    },3000);
  }

  ngAfterViewInit()
  {
    this.spinner = document.getElementById('spinner');
    this.box = document.getElementById('box');
    this.activarSpinner();
    this.agregarEspecialidadRef = document.getElementById('contenedor-pop-up');
    setTimeout(()=>{
      this.lbEspecialidades = document.getElementById('lb-especialidades');
    },1500);
  }
  
  async eliminarRadioButtons()
  {
    while(this.lbEspecialidades.hasChildNodes())
    {
      this.lbEspecialidades.removeChild(this.lbEspecialidades.firstChild);
    }
  }

  registrarEspecialista()
  {
    if(this.formEspecialista.valid)
    {
      if(this.nuevoEspecialista.imagen1 != '')
      {
        this.agregoImagen = true;
        this.nuevoEspecialista.nombre = this.formEspecialista.getRawValue().nombre;
        this.nuevoEspecialista.apellido = this.formEspecialista.getRawValue().apellido;
        this.nuevoEspecialista.edad = this.formEspecialista.getRawValue().edad;
        this.nuevoEspecialista.dni = this.formEspecialista.getRawValue().dni;
        this.nuevoEspecialista.email = this.formEspecialista.getRawValue().email;
        this.nuevoEspecialista.clave = this.formEspecialista.getRawValue().clave;
        this.nuevoEspecialista.perfil = "especialista";
        this.nuevoEspecialista.especialidad = this.obtenerEspecialidadesUsuario();
        this.auth.registrarEspecialista(this.nuevoEspecialista);
        this.activarSpinner();
        setTimeout(()=>{
          this.formEspecialista.reset();
          this.nuevoEspecialista = new Especialista();
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
        this.nuevoEspecialista.imagen1 = urlImg;
      });
    });
  }

  obtenerEspecialidadesUsuario()
  {
    const checkBoxes = document.getElementsByName('especialidades');
    let seleccion: string[] = [];
    checkBoxes.forEach((checkBox)=>{
      //@ts-ignore
      if(checkBox.checked)
      {
        //@ts-ignore
        seleccion.push(checkBox.value);
      }
    });
    return seleccion;
  }


  cargarEspecialidades()
  {
   this.servicioFire.obtenerEspecialidades().subscribe((res)=>{
    res.forEach((especialidad)=>{
      if(!this.especialidades.includes(especialidad.especialidad))
      {
        this.especialidades.push(especialidad.especialidad);
      }
      });
    });
  }

  crearLetrasRandom()
  {}

  async agregarEspecialidad()
  {
    if(this.formAgregarEspecialista.valid)
    {
      this.vaciarArray();
      //console.log(this.especialidades);
      await this.eliminarRadioButtons();
      this.nuevaEspecialidad.especialidad = this.formAgregarEspecialista.getRawValue().nuevaEspecialidad;
      if(!this.especialidades.includes(this.nuevaEspecialidad.especialidad))
      {
        await this.servicioFire.agregarDocumento('especialidades',this.nuevaEspecialidad);
        this.cerrarPopUp();       
        this.formAgregarEspecialista.reset();
      }
    }
  }

  abrirPopUp()
  {
    this.agregarEspecialidadRef.classList.remove("esconder");
    this.activarSpinner();

  }

  vaciarArray()
  {
    this.especialidades.forEach((especialidad)=>{
      this.especialidades.shift();
    })
  }

  cerrarPopUp()
  {
    this.agregarEspecialidadRef.classList.add("esconder");
  }
}
