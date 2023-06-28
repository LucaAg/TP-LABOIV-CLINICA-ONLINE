import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Especialista } from 'src/app/models/especialista';
import { AuthService } from 'src/app/servicios/auth.service';
import { doc } from 'firebase/firestore';
import { SweetService } from 'src/app/servicios/sweet.service';
@Component({
  selector: 'app-form-registro',
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.css']
})
export class FormRegistroComponent {
  nuevoEspecialista = new Especialista();
  agregoImagen = false;
  errorAgregarEspecialidadImagen:boolean = true;
  errorAgregarEspecialidad:boolean = true;
  formEspecialista: FormGroup;
  formAgregarEspecialista: FormGroup;
  especialidades:string[]=[];
  rutaImagen: string = "";
  archivo: string = "";
  patterDNI:string="[0-9]{8}";
  patternContraseña:string=".{6,}";
  agregarEspecialidadRef:any;
  nuevaEspecialidad = { especialidad: "", imagen: ""}
  lbEspecialidades:any;
  spinner:boolean = false;
  box:any;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder:FormBuilder,private formBuilder2:FormBuilder,
    private servicioFire:FirebaseService,private angularFireStorage: AngularFireStorage,
    private auth:AuthService,private sweetServ:SweetService)
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
      imagenNuevaEspecialidad: ['', [Validators.required]],
    });
    this.activarSpinner();
  }

  ngOnInit()
  {
    this.cargarEspecialidades();
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }

  ngAfterViewInit()
  {
   
    this.box = document.getElementById('box');
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

  async registrarEspecialista()
  {
    if(this.formEspecialista.valid)
    {
      await this.subirImagen(1);
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
        this.nuevaEspecialidad.especialidad = this.formAgregarEspecialista.getRawValue().nuevaEspecialidad;
        this.nuevoEspecialista.duracionTurno = 30;
        this.nuevoEspecialista.disponibilidad = []=[];
        this.auth.registrarEspecialista(this.nuevoEspecialista);
        this.activarSpinner();
        setTimeout(()=>{
          this.formEspecialista.reset();
          this.nuevoEspecialista = new Especialista();
        },2000); 
        this.sweetServ.mensajeExitoso("Especialista registrado exitosamente!","Especialista");
      }
      else
      {
        console.log("error imagen");
      }

    }
    else
    {
      console.log("error");
    }
  }

  cargarImagen($event: any) {
    this.archivo = $event.target.files[0];
    this.rutaImagen = 'img ' + Date.now() + Math.random() * 10;
  }

  async subirImagen(tipo:number)
  {
    return new Promise(async (resolve,rejected)=>{
      const referencia = this.angularFireStorage.ref(this.rutaImagen);
      await referencia.put(this.archivo).then(async () => {
        referencia.getDownloadURL().subscribe((urlImg) => {
          if(tipo == 1)
          {
            this.nuevoEspecialista.imagen1 = urlImg;
            resolve(urlImg);
          }
          if(tipo==2)
          {
            this.nuevaEspecialidad.imagen = urlImg;
            resolve(urlImg);
          }
        });
      });
    })
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
    console.log(this.formAgregarEspecialista.getRawValue().imagenNuevaEspecialidad);
    if(this.formAgregarEspecialista.valid)
    {
      this.vaciarArray();
      //console.log(this.especialidades);
      await this.eliminarRadioButtons();
      this.nuevaEspecialidad.especialidad = this.formAgregarEspecialista.getRawValue().nuevaEspecialidad;
      if(!this.especialidades.includes(this.nuevaEspecialidad.especialidad))
      {
        this.errorAgregarEspecialidadImagen = true;
        this. errorAgregarEspecialidad = true;
        await this.subirImagen(2);
        await this.servicioFire.agregarDocumento('especialidades',this.nuevaEspecialidad);
        this.sweetServ.mensajeExitoso("Especialidad agregada correctamente","Especialidad");
        this.cerrarPopUp();       
        this.formAgregarEspecialista.reset();
      }
    }
    else
    {
      console.log("error");
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
