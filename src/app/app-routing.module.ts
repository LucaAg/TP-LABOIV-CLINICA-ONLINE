import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './paginas/bienvenida/bienvenida.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';

const routes: Routes = [
  {path: "", redirectTo: '/bienvenida', pathMatch: 'full'},
  {path:'bienvenida', component:BienvenidaComponent},
  {path:'registrarse',component:RegistroComponent},
  {path:'iniciar-sesion',component:LoginComponent},
  {path:'usuarios',component:UsuariosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
