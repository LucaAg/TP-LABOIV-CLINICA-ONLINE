import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AuthService } from 'src/app/servicios/auth.service';


@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent {
  spinner:boolean = false;
  listaLogs:any = new Array();
  listaTurnos:any = new Array();
  listaTurnoSolicitados:any = new Array();
  listaTurnoFinalizados:any = new Array();
  turnosPorEspecialidad:any []=[];
  especialidades:any;
  turnosPorDia = [0,0,0,0,0,0];
  turnosSolicitados = [0,0,0];
  turnosFinalizados = [0,0,0];
  cantidadTurnosPorEspecialidad = [0,0,0,0];  
  turnosMedicoPorTiempo:any []=[];
  turnosFinalizadosMedicoPorTiempo:any []=[];
  barChart:any;
  chartPorEspecialidad:any;
  logs:boolean = false;
  turnosEspecialidad:boolean = false;
  turnosPorDias:boolean = false;
  turnosSolicitadosGrafico:boolean = false;
  turnosFinalizadosGrafico:boolean = false;
  constructor(private fireServ:FirebaseService,
    private authServ:AuthService)
  { 
    this.spinner = true;
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale
    );
    Chart.register(...registerables);
    this.listaLogs = [];
    this.listaTurnos = [];
    this.fireServ.obtenerLogs().subscribe((logs)=>{
      this.listaLogs = [...logs];
    });
    this.fireServ.obtenerTurnos().subscribe((turnos)=>{
      this.listaTurnos = [...turnos];
      this.cargarTurnosPorEspecialidad();
      this.cargarTurnosPorDia();
      for (let i = 0; i < turnos.length; i++) {
        if(turnos[i].estado == 'solicitado')
        {
          this.listaTurnoSolicitados.push(turnos[i]);
        }  
        else if(turnos[i].estado == 'finalizado')
        {
          this.listaTurnoFinalizados.push(turnos[i]);
        }
      }
      this.cargarTurnosSolicitadosMedico();
      this.cargarTurnosFinalizadosMedico();
    });
    this.fireServ.obtenerEspecialidades().subscribe((especialidades)=>{
      this.especialidades = [...especialidades];
      console.log(this.especialidades);
    });
    setTimeout(()=>{
      this.spinner = false;
    },2500);
  }



  ngAfterViewInit()
  {
   
  }

  cargarTurnosPorDia()
  {
    for (let i = 0; i < this.listaTurnos.length; i++)
    {
      switch(this.formeatearFecha(this.listaTurnos[i].fecha))
      { 
        case 'lunes':
          this.turnosPorDia[0]++;
          break;
        case 'martes':
          this.turnosPorDia[1]++;
          break;
        case 'miércoles':
          this.turnosPorDia[2]++;
          break;
        case 'jueves':
          this.turnosPorDia[3]++;
          break;
        case 'viernes':
          this.turnosPorDia[4]++;
          break;
        case 'sábado':
          this.turnosPorDia[5]++;
          break;             
      } 
    }
  }

  formeatearFecha(fecha:string)
  {
    const fechaActual = new Date(fecha);
    const dia = fechaActual.toLocaleDateString('es-AR', { weekday: 'long' });
    return dia;
  }

  cargarTurnosPorEspecialidad()
  {
    for (let i = 0; i < this.listaTurnos.length; i++) {
      switch(this.listaTurnos[i].especialidad)
      {
        case 'Hematología':
          this.cantidadTurnosPorEspecialidad[0]++;
          break;
        case 'Cardiología':
          this.cantidadTurnosPorEspecialidad[1]++;
          break;
        case 'Neurología':
          this.cantidadTurnosPorEspecialidad[2]++;
          break;
        case 'Traumatología':
          this.cantidadTurnosPorEspecialidad[3]++;
          break;      
      }
    }
  }

  cargarTurnosSolicitadosMedico()
  {
    for (let i = 0; i < this.listaTurnoSolicitados.length; i++) {
      if(this.listaTurnoSolicitados[i].especialista.aprobado)
      {
        switch(this.listaTurnoSolicitados[i].especialista.apellido)
        {
          case 'Braña':
            console.log("entro");
            this.turnosSolicitados[0]++;
            break;
          case 'Simpson':
            this.turnosSolicitados[1]++;
            break;
          case 'Agnoli':
            this.turnosSolicitados[2]++;
            break;
        }
      } 
    }
  }

  cargarTurnosFinalizadosMedico()
  {
    for (let i = 0; i < this.listaTurnoFinalizados.length; i++) {
      if(this.listaTurnoFinalizados[i].especialista.aprobado)
      {
        switch(this.listaTurnoFinalizados[i].especialista.apellido)
        {
          case 'Braña':
            this.turnosFinalizados[0]++;
            break;
          case 'Simpson':
            this.turnosFinalizados[1]++;
            break;
          case 'Agnoli':
            this.turnosFinalizados[2]++;
            break;
        }
      } 
    }
  }

  generarGraficoBarras()
  {
    if (this.barChart) {
      this.barChart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }
    const ctx = (<any>document.getElementById('barChart')).getContext('2d');
    const colors = [
      '#FCC85B',
      '#DB5F00',
      '#F08D62',
      '#DB2816',
    ];
    let i = 0;
    const coloresPuntaje = this.cantidadTurnosPorEspecialidad.map(
      (_:any) => colors[(i = (i + 1) % colors.length)]
    );
    //@ts-ignore
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hematología', 'Cardiología', 'Neurología','Traumatología'],
        datasets: [{
          label: 'Turnos por especialidad',
          data: this.cantidadTurnosPorEspecialidad,
          backgroundColor: coloresPuntaje,
          borderColor: coloresPuntaje,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 50 // Define el rango máximo en el eje Y
          }
        }
      }
    });
  }

  generarGraficoBarrasDias()
  {
    if (this.barChart) {
      this.barChart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }
    const ctx = (<any>document.getElementById('barChartDias')).getContext('2d');
    const colors = [
      '#FCC85B',
      '#DB5F00',
      '#F08D62',
      '#DB2816',
    ];
    let i = 0;
    const coloresPuntaje = this.turnosPorDia.map(
      (_:any) => colors[(i = (i + 1) % colors.length)]
    );
    //@ts-ignore
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles','Jueves','Vienes','Sábado'],
        datasets: [{
          label: 'Turnos por día',
          data: this.turnosPorDia,
          backgroundColor: coloresPuntaje,
          borderColor: coloresPuntaje,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 50 // Define el rango máximo en el eje Y
          }
        }
      }
    });
  }

  generarGraficoSolicitadosMedico()
  {
    if (this.chartPorEspecialidad) {
      this.chartPorEspecialidad.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }
    const ctx = (<any>(
      document.getElementById('turnosSolicitadosPorMedico')
    )).getContext('2d');

    const colors = [
      '#55ff9c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
      '#ffc409',
      '#eb445a',
      '#3dc2ff',

    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_: any) => colors[(i = (i + 1) % colors.length)]
    );


    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Braña', 'Simpson', 'Agnoli'],
        datasets: [
          {
            label: undefined,
            data: this.turnosSolicitados,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos solicitados por médico',
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }
  
  generarGraficoFinalizadosMedico()
  {
    if (this.barChart) {
      this.barChart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }
    const ctx = (<any>document.getElementById('barChartFinalizados')).getContext('2d');
    const colors = [
      '#FCC85B',
      '#DB5F00',
      '#F08D62',
      '#DB2816',
    ];
    let i = 0;
    const coloresPuntaje = this.turnosFinalizados.map(
      (_:any) => colors[(i = (i + 1) % colors.length)]
    );
    //@ts-ignore
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Braña', 'Simpson', 'Agnoli'],
        datasets: [{
          label: 'Turnos finalizados a 6 días',
          data: this.turnosFinalizados,
          backgroundColor: coloresPuntaje,
          borderColor: coloresPuntaje,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 50 // Define el rango máximo en el eje Y
          }
        }
      }
    });
  }

  exportarComoExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.guardarComoExcel(excelBuffer, excelFileName);
  }

  guardarComoExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  descargarExcelLogs() {
    this.exportarComoExcel(this.listaLogs, 'logUsuarios');
  }

  descargarPDFLogs() {
    const DATA = document.getElementById('pdflogs');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`logs_usuarios.pdf`);
      });
  }

  descargarPDFTurnosFinalizadosPorMedico() {
    const DATA = document.getElementById('pdfTurnosFinalizadosPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`turnosFinalizadosPorMedico.pdf`);
      });
  }

  descargarPDFTurnosSolicitadosPorMedico() {
    const DATA = document.getElementById('pdfTurnosSolicitadosPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`pdfTurnosSolicitadosPorMedico.pdf`);
      });
  }

  descargarPDFTurnosPorDiaPorMedico() {
    const DATA = document.getElementById('pdfTurnosPorDiaPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`pdfTurnosPorDiaPorMedico.pdf`);
      });
  }

  descargarPDFTurnosEspecialidadPorMedico() {
    const DATA = document.getElementById('pdfTurnosPorEspecialidadPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`pdfTurnosPorEspecialidadPorMedico.pdf`);
      });
  }
}
