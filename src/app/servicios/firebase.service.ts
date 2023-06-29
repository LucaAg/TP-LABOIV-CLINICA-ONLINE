import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor( private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore) { }

  obtenerEspecialidades()
  {
    const coleccion = this.angularFirestore.collection<any>('especialidades');
    return coleccion.valueChanges();
  }

  obtenerEspecialistas()
  {
    return this.angularFirestore.collection<any>('usuarios', ref => ref.where('perfil', '==', 'especialista')
    .where('aprobado', '==', true)).valueChanges();  
  }

  actualizarTurno(turno:any)
  {
    this.angularFirestore.collection('turnos', ref =>
    ref.where('id', '==', turno.id)
  )
  .get()
  .subscribe(snapshot => {
    if (snapshot.size === 1) {
      const turnoDoc = snapshot.docs[0];

      turnoDoc.ref.update(turno)
        .then(() => {
          console.log('Turno actualizado exitosamente');
        })
        .catch((error) => {
          console.error('Error al actualizar el turno:', error);
        });
    } else {
      console.error('No se encontró un único documento que cumpla con los criterios especificados');
    }
  });
  }

  async agregarDocumento(nombreColeccion:string,datos:any)
  {
    return this.angularFirestore.collection(nombreColeccion).add(datos);
  }

  obtenerUsuarios()
  {
    const coleccion = this.angularFirestore.collection<any>('usuarios');
    return coleccion.valueChanges();
  }

  obtenerTurnos()
  {
    const coleccion = this.angularFirestore.collection<any>('turnos');
    return coleccion.valueChanges();
  }

  obtenerHistoriasClinicas()
  {
    const coleccion = this.angularFirestore.collection<any>('historiales-clinicos');
    return coleccion.valueChanges();
  }
}
