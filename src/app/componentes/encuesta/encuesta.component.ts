import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {
  user: any = null;
  encuestaForm: FormGroup;
  validNewGame: string | boolean;
  @Output() encuestaCompletada: EventEmitter<any> = new EventEmitter<any>();  
  
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private fireServ: FirebaseService,
    private router: Router,
    private sweetCtrl:SweetService
  ) {
    this.validNewGame = false;
    this.encuestaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      masPersonal: [true],
      masSuministros: [false],
      juegosEspera: [false],
      especialistaFavorito: ['Humanidad'],
      recomiendaPagina: ['', [Validators.required]],
    });
  } // end of constructor

  ngOnInit(): void {
    this.auth.obtenerUsuarioIniciado().subscribe((usuario)=>{
      this.user = usuario;
    });
  }

  cargarForm() {
    if (this.encuestaForm.valid) {
      if (this.validarRecomendaciones()) {
        this.crearEncuesta();
        this.encuestaForm.reset({
          nombre: '',
          apellido: '',
          edad: '',
          telefono: '',
          masPersonal: true,
          masSuministros: false,
          juegosEspera: false,
          destacadoEspecialista: 'Atención',
          recomiendaPagina: '',
        });
      } else {
        this.validarElegirRecomendaciones();
   
      }
    } else {
      this.validarElegirRecomendaciones();
  
    }
  } // end of sendForm

  validarElegirRecomendaciones() {
    const masPersonal = this.encuestaForm.value.masPersonal;
    const masSuministros = this.encuestaForm.value.masSuministros;
    const juegos = this.encuestaForm.value.juegosEspera;
    if (!masPersonal && !masSuministros && !juegos) {
      this.validNewGame = 'Se debe elegir al menos una opción';
    } else {
      this.validNewGame = false;
    }
  } // end of showNewGameValidationMessage

  validarRecomendaciones(): boolean {
    const masPersonal = this.encuestaForm.value.masPersonal;
    const masSuministros = this.encuestaForm.value.masSuministros;
    const juegosEspera = this.encuestaForm.value.juegosEspera;
    if (!masPersonal && !masSuministros && !juegosEspera) {
      return false;
    }
    return true;
  } 

  crearEncuesta() {
    const fecha = new Date();
    const fechaActual = fecha.toLocaleDateString();
    const encuesta = {
      tipo: 'encuesta',
      usuario: this.user,
      fecha: fechaActual,
      encuesta: this.encuestaForm.value,
    };
    console.log(encuesta);
    this.fireServ.agregarDocumento('encuestas',encuesta);
    this.encuestaCompletada.emit(false);
  } 

  cancelar()
  {
    this.encuestaCompletada.emit(true);
  }
}
