import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SweetService } from 'src/app/servicios/sweet.service';
// import * as XLSX from 'xlsx/xlsx.mjs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  listaUsuarios:any[]=[];
  popUpRef:any;
  boxRef:any;
  registroRef:any;
  spinner: boolean = false;
  pantalla:any;
  historialPorPaciente:any = new Array();
  historialesClinicos:any = new Array();
  historial:boolean = false;
  turnosPaciente:any = new Array();
  constructor(private firebaseServi:FirebaseService,private auth:AuthService,
    private router:Router,
    private sweetServ:SweetService)
  {
    this.activarSpinner();
    this.historialesClinicos = [];
    this.firebaseServi.obtenerHistoriasClinicas().subscribe((historiasCli)=>{  
      this.historialesClinicos = [...historiasCli];    
    });
  }

  ngOnInit()
  {
    this.cargarUsuarios();
  }

  ngAfterViewInit()
  {
    this.pantalla = document.getElementById('pantalla');
    this.popUpRef = document.getElementById('contenedor-pop-up');
    this.boxRef = document.getElementById('box');
    this.registroRef = document.getElementById('registro');
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }

  cargarUsuarios()
  {
    this.firebaseServi.obtenerUsuarios().subscribe((res)=>{
      this.listaUsuarios = res;
    });
  }

  cambiarEstadoHabilitacion(usuario:any,e:Event)
  {
    usuario.aprobado = (e.target as HTMLInputElement).checked;
    this.auth.actualizarUsuario(usuario);
  }

  generarExcel()
  {
    alert("Próximamente...\nEl alert va a desaparecer :)");
  }

  registrarUsuario(tipoUsuario:string)
  {
    if(tipoUsuario == 'otros')
    {
      this.router.navigate(['registrarse']);
    }
    else
    {
      this.cancelarRegistro();
    }
    this.cerrarPopUp();
    this.activarSpinner();
  }

  cancelarRegistro()
  {
    this.boxRef.classList.add("esconder");
    this.registroRef.classList.remove("esconder");
  }

  registroAdminCompletado()
  {
    this.boxRef.classList.remove("esconder");
    this.registroRef.classList.add("esconder");
  }

  abrirPopUp()
  {
    this.popUpRef.classList.remove("esconder");

  }

  cerrarPopUp()
  {
    this.popUpRef.classList.add("esconder");
  }

  filtrarHistorialesPorPaciente(paciente:any)
  {
    for (let i = 0; i < this.historialesClinicos.length; i++) {
      if(this.historialesClinicos[i].paciente.id == paciente.id)
      {
        this.historialPorPaciente.push(this.historialesClinicos[i]);
      }   
    }
  }

  verHistorial(paciente:any)
  {
    this.historial = true;
    this.filtrarHistorialesPorPaciente(paciente);
  }

  exportarArchivoExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.guardarArchivoExcel(excelBuffer, excelFileName);
  }

  guardarArchivoExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  filtrarTurnosPorPaciente(paciente:any)
  {
    this.turnosPaciente = [];
    for (let i = 0; i < this.historialesClinicos.length; i++) {
      if(paciente.id == this.historialesClinicos[i].paciente.id)
      {
        this.turnosPaciente.push(this.historialesClinicos[i]);
      } 
    }
  }

  descargarExcel(paciente:any) {
    if(paciente.perfil == 'paciente')
    {
      this.filtrarTurnosPorPaciente(paciente);
      this.exportarArchivoExcel(this.turnosPaciente, 'Turnos usuario');
      this.sweetServ.mensajeExitoso(
        'Excel generado exitosamente',
        'Usuarios'
      );
    }
  }
}
