import { Component } from '@angular/core';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {
  spinner:boolean = false;
  especialidad:boolean = false;
  especialista:boolean = false;

  constructor()
  {
    //this.activarSpinner();
  }


  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }

}
