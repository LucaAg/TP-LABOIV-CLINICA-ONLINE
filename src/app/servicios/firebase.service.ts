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

  async agregarDocumento(nombreColeccion:string,datos:any)
  {
    return this.angularFirestore.collection(nombreColeccion).add(datos);
  }

  obtenerUsuarios()
  {
    const coleccion = this.angularFirestore.collection<any>('usuarios');
    return coleccion.valueChanges();
  }
}
