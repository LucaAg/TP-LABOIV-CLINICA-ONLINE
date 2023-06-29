import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }


  generarPDF(data:any)
  {
    const doc = new jsPDF();

    const content = "";
  }
}
