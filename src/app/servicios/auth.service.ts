import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Especialista } from '../models/especialista';
import { Paciente } from '../models/paciente';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Usuario } from '../models/usuario';
import { SweetService } from './sweet.service';
import * as firebase from 'firebase/compat';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  estaLogueado = false;
  constructor(  private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router,
    private sweetServi:SweetService) { }

  async iniciarSesion(email:string,contraseña:string) {
    try {
      return await this.angularFireAuth
        .signInWithEmailAndPassword(email, contraseña)
    } catch (error) {
      return null;
    }
  } 

  setLogueado()
  {
    this.estaLogueado = true;
  }

  obtenerUsuarioIniciado()
  {
    return this.angularFireAuth.authState.pipe(
      switchMap((usuario:any) =>{
        if(usuario)
        {
          return this.angularFirestore
          .collection('usuarios')
          .doc(usuario.uid)
          .get()
          .pipe(
            map((doc) =>{
              const datos = doc.data();
              if(doc.exists && datos)
              {
                return { id: doc.id, ...datos};
              }
              else{
                return null;
              }
            })
            )
        }
        else
        {
          return of(null);
        }
      })
    );
  }

  cerrarSesion() {
    this.angularFireAuth.signOut();
    setTimeout(()=>{
      this.estaLogueado = false;
    },1000);
  }

  registrarEspecialista(nuevoEspecialista:Especialista)
  {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoEspecialista.email,nuevoEspecialista.clave)
    .then((datos)=>{
      datos.user?.sendEmailVerification();
      this.angularFirestore.collection('usuarios').doc(datos.user?.uid)
      .set({
        id: datos.user?.uid,
        nombre: nuevoEspecialista.nombre,
        apellido: nuevoEspecialista.apellido,
        edad: nuevoEspecialista.edad,
        dni: nuevoEspecialista.dni,
        perfil: nuevoEspecialista.perfil,
        especialidad: nuevoEspecialista.especialidad,
        email: nuevoEspecialista.email,
        clave: nuevoEspecialista.clave,
        imagen1: nuevoEspecialista.imagen1,
        aprobado: nuevoEspecialista.aprobado,
      }).then(()=>{
        console.log("Registro exitoso!");
      }).catch((error)=>{
        console.log(error.code);
      })
    })
    .catch((error)=>{
      console.log(error.code);
    });
  }


  registrarPaciente(nuevoPaciente:Paciente)
  {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoPaciente.email,nuevoPaciente.clave)
    .then((datos)=>{
      datos.user?.sendEmailVerification();
      this.angularFirestore.collection('usuarios').doc(datos.user?.uid)
      .set({
        id: datos.user?.uid,
        nombre: nuevoPaciente.nombre,
        apellido: nuevoPaciente.apellido,
        edad: nuevoPaciente.edad,
        dni: nuevoPaciente.dni,
        obraSocial: nuevoPaciente.obraSocial,
        email: nuevoPaciente.email,
        perfil: nuevoPaciente.perfil,
        clave: nuevoPaciente.clave,
        imagen1: nuevoPaciente.imagen1,
        imagen2: nuevoPaciente.imagen2,
      }).then(()=>{
        console.log("Registro exitoso!");
        this.router.navigate(['']);
      }).catch((error)=>{
        console.log(error.code);
      })
    })
    .catch((error)=>{
      console.log(error.code);
    });
  }

  registrarAdmin(nuevoAdmin:Usuario)
  {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoAdmin.email,nuevoAdmin.clave)
    .then((datos)=>{
      datos.user?.sendEmailVerification();
      this.angularFirestore.collection('usuarios').doc(datos.user?.uid)
      .set({
        id: datos.user?.uid,
        nombre: nuevoAdmin.nombre,
        apellido: nuevoAdmin.apellido,
        edad: nuevoAdmin.edad,
        dni: nuevoAdmin.dni,
        perfil: nuevoAdmin.perfil,
        email: nuevoAdmin.email,
        clave: nuevoAdmin.clave,
        imagen1: nuevoAdmin.imagen1,
        esAdmin: true,
      }).then(()=>{
        console.log("Registro exitoso!");
      }).catch((error)=>{
        console.log(error.code);
      })
    })
    .catch((error)=>{
      console.log(error.code);
    });
  }

  actualizarUsuario(usuario: any) {
    this.angularFirestore
      .doc<any>(`usuarios/${usuario.id}`)
      .update(usuario)
      .then(() => {
        console.log(`Usuario ${usuario.apellido} actualizado`);
      })
    
      .catch((error) => {
        console.log("Error al actualizar usuario");
      });
  }
}
