import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetService } from 'src/app/servicios/sweet.service';

@Component({
  selector: 'app-form-historial-clinico',
  templateUrl: './form-historial-clinico.component.html',
  styleUrls: ['./form-historial-clinico.component.css']
})
export class FormHistorialClinicoComponent {
  @Output() historialCompleatado: EventEmitter<any> = new EventEmitter<any>();  
  @Input() paciente: any;
  @Input() especialista: any;
  camposDinamicos: { key: string, value: any }[] = [];
  peso:any = '';
  temperatura:any = '';
  presion:any = '';
  altura:any = '';
  error:boolean = false;
  constructor(
    
  ) {

  } // end of constructor

  ngOnInit(): void {

  }


  agregarCamposDinamicos() {
    if (this.camposDinamicos.length < 3) {
      this.camposDinamicos.push({ key: '', value: '' });
    }
  }

  quitarCampoDinamico(index: number) {
    this.camposDinamicos.splice(index, 1);
  }

  crearHistorial() {
    const historialClinico: { [ket:string]:any}={
      altura: this.altura,
      peso: this.peso,
      temperatura: this.temperatura,
      presion: this.presion,
    };
    if(this.altura != '' && this.peso != '' && this.temperatura != '' && this.presion != '')
    {
      this.error = false;
  
      this.camposDinamicos.forEach(campo => {
        historialClinico[campo.key] = campo.value;
      });
      
      this.historialCompleatado.emit(historialClinico);
    }
    else
    {
      this.error = true;
    }

  } 

  cancelar()
  {
    this.historialCompleatado.emit('Cancelar');
  }
}
