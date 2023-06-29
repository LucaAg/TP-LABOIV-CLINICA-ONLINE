import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {
  historialPorPaciente:any = new Array();
  listaPacientes:any = new Array();
  usuariosPorEspecialista:any = new Array();
  historial:boolean = false;
  especialista:any;
  listaHistoriasCLinicasPorEspecialista:any = new Array();
  pacientesCount: { [paciente: string]: { count: number; fechas: string[] } } = {};
  constructor(private authServ:AuthService,
    private fireServ:FirebaseService)
  {
    
  }

  ngOnInit()
  {
    this.authServ.obtenerUsuarioIniciado().subscribe((usuario)=>{
      this.especialista = usuario;
      console.log(usuario);
      this.listaHistoriasCLinicasPorEspecialista = [];
      this.fireServ.obtenerHistoriasClinicas().subscribe((historiasCli)=>{
        for (let i = 0; i < historiasCli.length; i++) {
          if(historiasCli[i].especialista.id == this.especialista.id)
          {
            this.listaHistoriasCLinicasPorEspecialista.push(historiasCli[i]);
          }
        }
        console.log(this.listaHistoriasCLinicasPorEspecialista);
        this.obtenerConteoPacientes();
        this.filtrarHistoriasClinicas();
      });
    })
  }

  obtenerConteoPacientes(): void {
    this.pacientesCount = {};
    for (const historia of this.listaHistoriasCLinicasPorEspecialista) {
      const paciente = historia.paciente;
      const fecha = historia.fechaTurno;

      if (paciente.id in this.pacientesCount) {
        this.pacientesCount[paciente.id].count++;
        if (this.pacientesCount[paciente.id].fechas.length < 3) {
          this.pacientesCount[paciente.id].fechas.push(fecha);
        }
      } else {
        this.pacientesCount[paciente.id] = { count: 1, fechas: [fecha] };
      }
    }
  }

  obtenerFechasPaciente(pacienteInfo: { count: number; fechas: string[]; }): string {
    const fechas = pacienteInfo.fechas.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return fechas.length > 0 ? fechas.join('<br> ') : 'No hay fechas disponibles';
  }

  filtrarHistoriasClinicas(): void {
    this.listaPacientes = [];
    const pacientesSet = new Set<string>();
    for (const historia of this.listaHistoriasCLinicasPorEspecialista) {
      const paciente = historia.paciente;

      if (!pacientesSet.has(paciente.id)) {
        pacientesSet.add(paciente.id);
        this.listaPacientes.push(paciente);
      }
    }

    console.log(this.listaPacientes);
  }

  verHistorial(paciente:any)
  {
    this.historial = true;
    this.obtenerHistorialPorPaciente(paciente);
  }

  obtenerHistorialPorPaciente(paciente:any)
  {
    this.historialPorPaciente = [];
    console.log(this.listaHistoriasCLinicasPorEspecialista);
    for (let i = 0; i < this.listaHistoriasCLinicasPorEspecialista.length; i++) {
      if(this.listaHistoriasCLinicasPorEspecialista[i].paciente.id == paciente.id)
      {
        this.historialPorPaciente.push(this.listaHistoriasCLinicasPorEspecialista[i]);
      }
    }
    console.log(this.historialPorPaciente);
  }
}
