import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './paginas/bienvenida/bienvenida.component';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { FormRegistroComponent } from './componentes/form-registro/form-registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { FormRegistroPacienteComponent } from './componentes/form-registro-paciente/form-registro-paciente.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';
import { FormRegistroAdminComponent } from './componentes/form-registro-admin/form-registro-admin.component';


@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    NavBarComponent,
    LoginComponent,
    RegistroComponent,
    FormRegistroComponent,
    SpinnerComponent,
    FormRegistroPacienteComponent,
    UsuariosComponent,
    FormRegistroAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent]
})
export class AppModule { }
