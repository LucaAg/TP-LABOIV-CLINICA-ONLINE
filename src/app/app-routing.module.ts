import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './paginas/bienvenida/bienvenida.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';
import { TurnosComponent } from './paginas/turnos/turnos.component';
import { SolicitarTurnoComponent } from './paginas/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './paginas/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './paginas/mis-turnos/mis-turnos.component';
import { PacientesComponent } from './paginas/pacientes/pacientes.component';
import { FormHistorialClinicoComponent } from './componentes/form-historial-clinico/form-historial-clinico.component';

const routes: Routes = [
  {path: "", redirectTo: '/bienvenida', pathMatch: 'full'},
  {path:'bienvenida', component:BienvenidaComponent},
  {path:'registrarse',component:RegistroComponent},
  {path:'iniciar-sesion',component:LoginComponent},
  {path:'usuarios',component:UsuariosComponent},
  {path:'turnos',component:TurnosComponent},
  {path:'solicitar-turno',component:SolicitarTurnoComponent},
  {path:'mi-perfil',component:MiPerfilComponent},
  {path:'mis-turnos',component:MisTurnosComponent},
  {path:'pacientes',component:PacientesComponent},
  {path:'historial-clinico',component:FormHistorialClinicoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
